import { describe, expect, test } from "vitest";

import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";

import { andThen } from "../src/Function.js";
import adapter from "../src/Adapters/Platform.js";
import * as Http from "../src/Client.js";
import * as Interceptor from "../src/Interceptor.js";
import { TimeoutError } from "../src/Interceptors/Timeout.js";
import BaseURL from "../src/Interceptors/Url.js";
import { json } from "../src/Body.js";
import * as Response from "../src/Response.js";
import { HttpError } from "../src/Error.js";
import { HttpRequest } from "../src/Request.js";

const base_url = "https://reqres.in/api";

const base_url_interceptor = BaseURL(base_url);

const config = {
  headers: { "x-api-key": "reqres-free-v1" },
};

const headers_interceptor = async function (chain: Interceptor.Chain) {
  const { url, init } = chain.request;

  const req = new HttpRequest(url, {
    ...init,
    ...config,
    headers: { ...init?.headers, ...config.headers },
  });

  return chain.proceed(req);
};

const interceptors = Interceptor.of(headers_interceptor);

const client = Http.create({ adapter, interceptors, url: base_url });

test("should make client with http methods", async () => {
  const interceptors = Interceptor.of(headers_interceptor);

  const client = Http.create({ adapter, interceptors, url: base_url });

  const res = await client.get("/users/2");
  const json = await andThen(res, Response.json);

  const result = json as Extract<typeof result, { _tag: "Right" }>;

  expect(result.right.data.id).toBe(2);
});

test("should make client with base URL for every request", async () => {
  const client = Http.create({
    interceptors,
    url: base_url,
    adapter: adapter,
  });

  const res = await client.get("/users/2");

  const result = await andThen(res, Response.json);

  expect((result as E.Right<any>).right.data.id).toBe(2);
});

test("should make client with interceptors", async () => {
  const interceptors = Interceptor.of(headers_interceptor);

  const client = Http.create({
    interceptors,
    url: base_url,
    adapter: adapter,
  });

  const res = await client.get("/users/2");

  const result = await andThen(res, Response.json);

  expect((result as E.Right<any>).right.data.id).toBe(2);
});

test("should attach JSON body and headers", async () => {
  let body;
  let headers;

  const spy = (chain: Interceptor.Chain) => {
    body = chain.request.init?.body;
    headers = new Headers(chain.request.init?.headers);
    return chain.proceed(chain.request);
  };

  const interceptors = pipe(
    Interceptor.of(base_url_interceptor),
    Interceptor.add(headers_interceptor),
    Interceptor.add(spy),
  );

  const client = Http.create({ interceptors, adapter: adapter });

  const body_json = json({ name: "morpheus", job: "leader" });

  const res = await client.post("/users", body_json);

  const result = await andThen(res, Response.json);

  expect((result as E.Right<any>).right).toMatchObject({
    name: "morpheus",
    job: "leader",
  });

  expect(body).toBe('{"name":"morpheus","job":"leader"}');
  expect(headers.get("Content-Type")).toBe("application/json");
  expect(headers.has("Content-Length")).toBeTruthy();
});

test("should attach JSON body and headers with custom headers", async () => {
  let headers;

  const spy = (chain: Interceptor.Chain) => {
    headers = new Headers(chain.request.init?.headers);
    return chain.proceed(chain.request);
  };

  const interceptors = pipe(
    Interceptor.of(base_url_interceptor),
    Interceptor.add(headers_interceptor),
    Interceptor.add(spy),
  );

  const client = Http.create({ interceptors, adapter: adapter });

  const res = await client.post("/users", {
    headers: { "X-API-Key-2": "Bearer <APIKEY>" },
    body: json({ name: "morpheus", job: "leader" }),
  });

  const result = await andThen(res, Response.json);

  expect((result as E.Right<any>).right).toMatchObject({
    name: "morpheus",
    job: "leader",
  });

  expect(headers.get("X-API-Key-2")).toBe("Bearer <APIKEY>");
});

describe("timeout", () => {
  test("with number timeout", async () => {
    const client = Http.create({
      timeout: 100,
      interceptors,
      url: base_url,
      adapter: adapter,
    });

    const result = await client.get("/users/2?delay=10");

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

    const client = Http.create({
      interceptors,
      url: base_url,
      adapter: adapter,
    });

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

    const client = Http.create({
      interceptors,
      url: base_url,
      adapter: adapter,
    });

    await client.head("/users/2");

    expect(method).toBe("HEAD");
  });
});
