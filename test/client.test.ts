import { describe, expect, test } from "vitest";

import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";

import { andThen } from "../src/Function.js";
import PlatformAdapter from "../src/Adapters/Platform.js";
import { create } from "../src/Client.js";
import * as Interceptor from "../src/Interceptor.js";
import { TimeoutError } from "../src/Interceptors/Timeout.js";
import Config from "../src/Interceptors/Config.js";
import BaseURL from "../src/Interceptors/Url.js";
import { json } from "../src/internal/body.js";
import * as Response from "../src/Response.js";
import { HttpError } from "../src/Error.js";

const base_url = "https://reqres.in/api";

const base_url_interceptor = BaseURL(base_url);

const headers_interceptor = Config({
  headers: { "x-api-key": "reqres-free-v1" },
});

test("should make client with http methods", async () => {
  const interceptors = pipe(
    Interceptor.of(base_url_interceptor),
    Interceptor.add(headers_interceptor)
  );

  const client = create({ interceptors, adapter: PlatformAdapter });

  const res = await client.get("/users/2");
  const json = await res.andThen((_) => _.json());

  const result = json as Extract<typeof result, { _tag: "Right" }>;

  expect(result.right.data.id).toBe(2);
});

test("should be able to use client thunk and have access to raw result", async () => {
  const interceptors = pipe(
    Interceptor.of(base_url_interceptor),
    Interceptor.add(headers_interceptor)
  );

  const client = create({ interceptors, adapter: PlatformAdapter });

  const res = await client("/users/2");
  const json = await andThen(res, Response.json);

  const result = json as Extract<typeof json, { _tag: "Right" }>;

  expect(E.isLeft(res) || E.isRight(res)).toBeTruthy();
  expect(result.right.data.id).toBe(2);
});

test("should make client with base URL for every request", async () => {
  const client = create({
    url: base_url,
    adapter: PlatformAdapter,
    interceptors: [headers_interceptor],
  });

  const res = await client.get("/users/2");

  const result = await res.andThen((_) => _.json());

  expect((result as E.Right<any>).right.data.id).toBe(2);
});

test("should make client with interceptors", async () => {
  const interceptors = pipe(
    Interceptor.of(base_url_interceptor),
    Interceptor.add(headers_interceptor)
  );

  const client = create({ interceptors, adapter: PlatformAdapter });

  const res = await client.get("/users/2");

  const result = await res.andThen((_) => _.json());

  expect((result as E.Right<any>).right.data.id).toBe(2);
});

test("should attach JSON body and headers", async () => {
  let body;
  let headers: Headers | undefined;

  const spy = (chain: Interceptor.Chain) => {
    body = chain.request.init?.body;
    headers = new Headers(chain.request.init?.headers);
    return chain.proceed(chain.request);
  };

  const interceptors = pipe(
    Interceptor.of(base_url_interceptor),
    Interceptor.add(headers_interceptor),
    Interceptor.add(spy)
  );

  const client = create({ interceptors, adapter: PlatformAdapter });

  const body_json = json({ name: "morpheus", job: "leader" });

  const res = await client.post("/users", body_json);

  const result = await res.andThen((_) => _.json());

  expect((result as E.Right<any>).right).toMatchObject({
    name: "morpheus",
    job: "leader",
  });

  expect(body).toBe('{"name":"morpheus","job":"leader"}');
  expect(headers?.get("Content-Type")).toBe("application/json");
  expect(headers?.has("Content-Length")).toBeTruthy();
});

test("should attach JSON body and headers with custom headers", async () => {
  let headers: Headers | undefined;

  const spy = (chain: Interceptor.Chain) => {
    headers = new Headers(chain.request.init?.headers);
    return chain.proceed(chain.request);
  };

  const interceptors = pipe(
    Interceptor.of(base_url_interceptor),
    Interceptor.add(headers_interceptor),
    Interceptor.add(spy)
  );

  const client = create({ interceptors, adapter: PlatformAdapter });

  const res = await client.post("/users", {
    headers: { "X-Custom-API-Key": "Bearer <APIKEY>" },
    body: json({ name: "morpheus", job: "leader" }),
  });

  const result = await res.andThen((_) => _.json());

  // expect((result as E.Right<any>).right).toMatchObject({
  //   name: "morpheus",
  //   job: "leader",
  // });

  expect(headers?.get("X-Custom-API-Key")).toBe("Bearer <APIKEY>");
});

test("should copy/inherit interceptors", async () => {
  const explode = async () => E.left({ explosive: "boom" });

  const interceptors = Interceptor.add(
    Interceptor.empty(),
    base_url_interceptor
  );

  const clone = Interceptor.add(Interceptor.copy(interceptors), explode);

  const client = create({ interceptors: clone, adapter: PlatformAdapter });

  const result = await client.get("/users/2");

  expect(clone.length).not.toEqual(interceptors.length);
  expect(result.response).toEqual(E.left({ explosive: "boom" }));
});

describe("timeout", () => {
  test("with number timeout", async () => {
    const client = create({
      timeout: 100,
      url: base_url,
      adapter: PlatformAdapter,
    });

    const response = await client.get("/users/2?delay=10");
    const result = response.response;

    expect(E.isLeft(result)).toBeTruthy();
    expect((result as E.Left<any>).left).instanceOf(HttpError);
    expect((result as E.Left<HttpError>).left.cause).instanceOf(TimeoutError);
  });
});

describe("method", () => {
  test("POST", async () => {
    let method;

    const check = async (chain: Interceptor.Chain) => {
      method = chain.request.init?.method;
      return E.right(new globalThis.Response(""));
    };

    const interceptors = Interceptor.of(check);

    const client = create({ interceptors, adapter: PlatformAdapter });

    await client.post("/users/2");

    expect(method).toBe("POST");
  });

  test("HEAD", async () => {
    let method;

    const check = async (chain: Interceptor.Chain) => {
      method = chain.request.init?.method;
      return E.right(new globalThis.Response(""));
    };

    const interceptors = Interceptor.of(check);
    const client = create({ interceptors, adapter: PlatformAdapter });
    await client.head("/users/2");

    expect(method).toBe("HEAD");
  });
});

// describe("Automatic response decoding", () => {
//   test("should automatically decode response to json", async () => {
//     let data = { age: 10 };

//     const check = async (chain: Interceptor.Chain) => {
//       // await chain.proceed(chain.request);
//       return E.right(
//         new globalThis.Response(JSON.stringify(data), { status: 200 })
//       );
//     };

//     const interceptors = Interceptor.of(check);

//     const client = create({ interceptors, adapter: PlatformAdapter });

//     const res = await client.get("/users/2", { responseType: "json" });

//     expect(res).toMatchObject(E.right({ data }));
//   });

//   test("should automatically decode response to text", async () => {
//     let data = "1000";

//     const check = async (chain: Interceptor.Chain) => {
//       return E.right(new globalThis.Response(data));
//     };

//     const interceptors = Interceptor.of(check);

//     const client = create({ interceptors, adapter: PlatformAdapter });

//     const res = await client.get("/users/2", { responseType: "text" });

//     expect(res).toMatchObject(E.right(data));
//   });

//   test("should not automatically decode response", async () => {
//     let data = { age: 10 };

//     const check = async (chain: Interceptor.Chain) => {
//       return E.right(new globalThis.Response(JSON.stringify(data)));
//     };

//     const interceptors = Interceptor.of(check);

//     const client = create({ interceptors, adapter: PlatformAdapter });

//     const res = await client.get("/users/2");

//     expect(res).not.toMatchObject(E.right(data));
//   });

//   test("should unset/reset automatically response decoding", async () => {
//     let data = { age: 10 };

//     const check = async (chain: Interceptor.Chain) => {
//       return E.right(new globalThis.Response(JSON.stringify(data)));
//     };

//     const interceptors = Interceptor.of(check);

//     const client = create({ interceptors, adapter: PlatformAdapter });

//     const res = await client.get("/users/2", { responseType: "unset" });
//     const json = await res.ok((_) => _.json());

//     expect(res).not.toMatchObject(E.right(data));
//     expect(json).toMatchObject(E.right(data));
//   });

//   // here
//   test("should automatically decode response to text", async () => {
//     let data = "1000";

//     const check = async (chain: Interceptor.Chain) => {
//       return E.right(new globalThis.Response(data));
//     };

//     const interceptors = Interceptor.of(check);

//     const client = create({
//       interceptors,
//       responseType: "blob",
//       adapter: PlatformAdapter,
//     });

//     const res = await client.get("/users/2");

//     if (E.isLeft(res)) {
//       if (res.left._tag == "Decode") {
//         res.left.error.cause;
//       }
//     } else {
//       res.right.data;
//     }

//     expect(res).toMatchObject(E.right(data));
//   });
// });
