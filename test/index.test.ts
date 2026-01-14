import { expect, test, describe } from "vitest";

import * as E from "fp-ts/Either";

import Adapter from "../src/Adapters/Platform.js";
import * as Http from "../src/index.js";
import { andThen } from "../src/index.js";
import * as Interceptor from "../src/Interceptor.js";
import {
  json,
  text,
  formData,
  HttpResponse,
  filterStatusOk,
} from "../src/Response.js";
import { API_KEY, API_URL } from "./constants.js";

const config = {
  headers: { "x-api-key": API_KEY },
};

const fetch = Http.fetch(Adapter);
const fetch_ = Http.fetch_(Adapter);

test("google", async () => {
  const res = await fetch_("https://www.google.com");
  const result = await res.ok((r) => r.text());
  expect((result as E.Right<string>).right).toContain("Google");
});

test("streaming", async () => {
  const res = await fetch("https://www.google.com");

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
  const res = await fetch_(API_URL + "/users/2", config);
  const result = await res.ok((_) => _.json());
  expect((result as E.Right<any>).right.id).toBe(2);
});

test("should be able to abort request", async () => {
  const controller = new AbortController();

  let timeout = setTimeout(() => {
    controller.abort();
    clearTimeout(timeout);
  }, 500);

  const res = await fetch_(API_URL + "/users/2?delay=1000", {
    ...config,
    signal: controller.signal,
  });

  const result = await res.ok((_) => _.json());

  const { left } = result as Extract<typeof result, { _tag: "Left" }>;
  const { cause } = left as Exclude<typeof left, HttpResponse>;

  expect(cause).toBeInstanceOf(DOMException);
  expect((cause as DOMException).name).toBe("AbortError");
});

test("should partition response with status filter", async () => {
  const request = await fetch(API_URL + "/users/2", config);
  const ok = andThen(request, filterStatusOk);
  const result = await andThen(ok, json);
  expect((result as E.Right<any>).right.id).toBe(2);
});

describe("decoders", () => {
  test("should decode json response", async () => {
    const res = await fetch(API_URL + "/users/2", config);
    const result = await andThen(res, json);
    expect((result as E.Right<any>).right.id).toBe(2);
  });

  test("should decode text response", async () => {
    const early = async () => E.right(new Response("10"));
    const interceptor = Interceptor.make(Interceptor.of(early));
    const fetch = Http.fetch(interceptor(Adapter));
    const res = await fetch(API_URL + "/users/2", config);
    const result = await andThen(res, text);
    expect((result as E.Right<any>).right).toBe("10");
  });

  test("should decode formdata response", async () => {
    const early = async () => {
      const form = new FormData();
      form.set("key", "value");
      return E.right(new Response(form));
    };

    const interceptor = Interceptor.make(Interceptor.of(early));
    const fetch = Http.fetch(interceptor(Adapter));
    const res = await fetch(API_URL + "/users/2", config);
    const result = await andThen(res, formData);
    const form = (result as Extract<typeof result, E.Right<any>>).right;
    expect(form).toBeInstanceOf(FormData);
    expect(form.get("key")).toBe("value");
  });
});
