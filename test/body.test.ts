import { expect, test } from "vitest";

import Adapter from "../src/adapters/Platform.js";
import { form, isBody, json, urlencoded } from "../src/Body.js";
import * as Interceptor from "../src/Interceptor.js";
import { neverThrow } from "../src/Function.js";

test("should serialize json and add headers", async () => {
  let body = { name: "John Doe" };
  let init: RequestInit | undefined;

  const interceptor = async function (chain: Interceptor.Chain) {
    init = chain.request.init;
    const res = await chain.proceed(chain.request);
    return res;
  };

  const interceptors = Interceptor.of(interceptor);

  let fetch = Interceptor.make(interceptors)(neverThrow(Adapter));

  await fetch("/users/2", json(body));

  expect(init?.body).toBeDefined();
  expect(init?.headers).toBeDefined();

  expect(init?.body).toEqual(JSON.stringify(body));

  expect(Object.fromEntries(new Headers(init?.headers))).toMatchObject({
    "content-type": "application/json",
    accept: "application/json",
  });
});

test("should serialize to FormData and add headers", async () => {
  let data = { name: "John Doe", choices: ["a", "b"] };
  let init: RequestInit | undefined;

  const interceptor = async function (chain: Interceptor.Chain) {
    init = chain.request.init;
    const res = await chain.proceed(chain.request);
    return res;
  };

  const interceptors = Interceptor.of(interceptor);

  let fetch = Interceptor.make(interceptors)(neverThrow(Adapter));

  await fetch("/users/2", form(data));

  expect(init?.body).toBeDefined();
  expect(init?.body).instanceOf(FormData);

  const body = init?.body as FormData;
  const choices = body.getAll("choices");

  expect(body.get("name")).toBe(data.name);
  expect(choices[0]).toBe(data.choices[0]);
  expect(choices[1]).toBe(data.choices[1]);
});

test("should serialize and add headers for urlencoded request", async () => {
  let data = { name: "John Doe", choices: ["a", "b"] };
  let init: RequestInit | undefined;

  const interceptor = async function (chain: Interceptor.Chain) {
    init = chain.request.init;
    const res = await chain.proceed(chain.request);
    return res;
  };

  const interceptors = Interceptor.of(interceptor);

  let fetch = Interceptor.make(interceptors)(neverThrow(Adapter));

  await fetch("/users/2", urlencoded(data));

  expect(init?.body).toBeDefined();
  expect(init?.body).toBeTypeOf("string");

  expect(init?.body).toBeDefined();
  expect(init?.headers).toBeDefined();

  expect(Object.fromEntries(new Headers(init?.headers))).toMatchObject({
    "content-type": "application/x-www-form-urlencoded",
  });

  const body = new URLSearchParams(init?.body as string);
  const choices = body.getAll("choices");

  expect(body.get("name")).toBe(data.name);
  expect(choices[0]).toBe(data.choices[0]);
  expect(choices[1]).toBe(data.choices[1]);
});

test("should support Body as request body", async () => {
  let body = { name: "John Doe" };
  let init: RequestInit | undefined;

  const interceptor = async function (chain: Interceptor.Chain) {
    init = chain.request.init;
    const res = await chain.proceed(chain.request);
    return res;
  };

  const interceptors = Interceptor.of(interceptor);

  let fetch = Interceptor.make(interceptors)(neverThrow(Adapter));

  await fetch("/users/2", { body: json(body) });

  expect(init?.body).toBeDefined();
  expect(init?.headers).toBeDefined();

  expect(init?.body).toEqual(JSON.stringify(body));

  expect(Object.fromEntries(new Headers(init?.headers))).toMatchObject({
    "content-type": "application/json",
    accept: "application/json",
  });
});

test("should forward only fully formed request to interceptor", async () => {
  let body = { name: "John Doe" };
  let init: RequestInit | undefined;

  const interceptor = async function (chain: Interceptor.Chain) {
    init = chain.request.init;
    const res = await chain.proceed(chain.request);
    return res;
  };

  const interceptors = Interceptor.of(interceptor);

  let fetch = Interceptor.make(interceptors)(neverThrow(Adapter));

  await fetch("/users/2", { body: json(body) });

  expect(init?.body).toBeDefined();
  expect(init?.headers).toBeDefined();

  expect(init?.body).toBeTypeOf("string");
  expect(isBody(init?.body)).toBeFalsy();
  expect(init?.body).toEqual(JSON.stringify(body));

  expect(Object.fromEntries(new Headers(init?.headers))).toMatchObject({
    "content-type": "application/json",
    accept: "application/json",
  });
});
