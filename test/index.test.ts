import { describe, expect, test } from "vitest";

import * as E from "fp-ts/Either";
import { constNull, pipe } from "fp-ts/function";

import Adapter from "../src/Adapters/Platform.js";
import { fetch as fetcher, andThen, Interceptor } from "../src/index.js";
import { filterStatusOk, HttpResponse, json } from "../src/Response.js";

const base_url = "https://reqres.in/api";

const fetch = fetcher(Adapter);

test("google", async () => {
  const res = await fetch("https://www.google.com");
  const result = await res.ok((r) => r.text());
  expect((result as E.Right<string>).right).toContain("Google");
});

test("streaming", async () => {
  const program = await fetch("https://www.google.com");

  const res = program.response;

  let result = "";

  if (E.isRight(res)) {
    if (res.right.body) {
      for await (const chunk of res.right.body) {
        result += new TextDecoder().decode(chunk);
      }
    }
  }

  expect(result).toContain("Google");
});

test("should make request", async () => {
  const res = await fetch(base_url + "/users/2");
  const result = await res.ok((_) => _.json());
  expect((result as E.Right<any>).right.data.id).toBe(2);
});

test("should be able to abort request", async () => {
  const controller = new AbortController();

  const req = fetch(base_url + "/users/2?delay=10", {
    signal: controller.signal,
  });

  setTimeout(() => controller.abort(), 500);

  const res = await req;
  const result = await res.ok((_) => _.json());

  const { left } = result as Extract<typeof result, { _tag: "Left" }>;
  const { cause } = left as Exclude<typeof left, HttpResponse>;

  expect(cause).toBeInstanceOf(DOMException);
  expect((cause as DOMException).name).toBe("AbortError");
});

test("should partition response with status filter", async () => {
  const request = await fetch(base_url + "/users/2");
  const ok = andThen(request.response, filterStatusOk);
  const result = await andThen(ok, (r) => r.json());
  expect((result as E.Right<any>).right.data.id).toBe(2);
});

test("passthrough", async () => {
  const response = await fetch("https://www.google.com");
  const result = await response.ok((r) => r.text());
  expect((result as E.Right<string>).right).toContain("Google");
});

describe("Response methods", () => {
  const data = { id: "2" };

  const mock_success = async function (chain: Interceptor.Chain) {
    return E.right(new Response(JSON.stringify(data), { status: 200 }));
  };

  const mock_failure = async function (chain: Interceptor.Chain) {
    return E.left(data);
  };

  const mock_success_failure = async function (chain: Interceptor.Chain) {
    return E.right(new Response(JSON.stringify(data), { status: 500 }));
  };

  const interceptors_asc = pipe(
    Interceptor.empty(),
    Interceptor.add(mock_success)
  );

  let interceptor = Interceptor.make(interceptors_asc)(Adapter);

  const fetch = fetcher(interceptor);

  test("should clone response", async () => {
    const result = await fetch("/user");
    const clone = await andThen(result.clone(), json);
    expect(E.getOrElse(constNull)(clone)).toMatchObject(data);
  });

  test("should get raw response", async () => {
    const result = await fetch("/user");
    expect(result.getOrNull()?.status).toBe(200);
  });

  test("should throw when I try to get raw response on request failure", async () => {
    const interceptors = pipe(
      Interceptor.empty(),
      Interceptor.add(mock_failure)
    );

    let interceptor = Interceptor.make(interceptors)(Adapter);

    const fetch = fetcher(interceptor);

    const result = await fetch("/user");
    expect(() => result.get()).toThrow();
  });

  test("should return null when I try to get raw response on request failure", async () => {
    const interceptors = pipe(
      Interceptor.empty(),
      Interceptor.add(mock_failure)
    );

    let interceptor = Interceptor.make(interceptors)(Adapter);

    const fetch = fetcher(interceptor);

    const result = await fetch("/user");
    expect(result.getOrNull()).toBeNull();
    expect(() => result.get()).toThrow();
  });

  test("should decode response", async () => {
    const result = await fetch("/user");
    const json = await result.json();
    expect(E.getOrElse(constNull)(json)).toMatchObject(data);
  });

  test("should not decode not ok response", async () => {
    const interceptors = pipe(
      Interceptor.empty(),
      Interceptor.add(mock_success_failure)
    );

    let interceptor = Interceptor.make(interceptors)(Adapter);

    const fetch = fetcher(interceptor);

    const result = await fetch("/user");

    const json = await result.ok((_) => _.json());

    let err: E.Either<any, any> | null = null;

    if (E.isLeft(json) && json.left instanceof HttpResponse) {
      err = await json.left.json();
    }

    expect(json).not.toMatchObject(E.right(data));
    expect(err).toMatchObject(E.right(data));
  });

  test("should map over response", async () => {
    const result = await fetch("/user");
    const json = result.map((_) => _.status);
    expect(json).toMatchObject(E.right(200));
  });

  test("should use andThen to decode response", async () => {
    const result = await fetch("/user");
    const json = await result.andThen((_) => _.json());
    expect(E.getOrElse(constNull)(json)).toMatchObject(data);
  });

  test("should not map over right channel using andThen", async () => {
    const interceptors = pipe(
      Interceptor.empty(),
      Interceptor.add(mock_failure)
    );

    let interceptor = Interceptor.make(interceptors)(Adapter);

    const fetch = fetcher(interceptor);

    const result = await fetch("/user");

    const json = await result.andThen((_) => _.json());

    expect(E.getOrElse(constNull)(json)).not.toMatchObject(data);
    expect(json).toMatchObject(E.left(data));
  });

  test("should not decode over right channel", async () => {
    const interceptors = pipe(
      Interceptor.empty(),
      Interceptor.add(mock_failure)
    );

    let interceptor = Interceptor.make(interceptors)(Adapter);

    const fetch = fetcher(interceptor);

    const result = await fetch("/user");

    const json = await result.json();

    expect(E.getOrElse(constNull)(json)).not.toMatchObject(data);
    expect(json).toMatchObject(E.left("10"));
  });
});
