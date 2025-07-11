import { expect, test } from "vitest";

import * as E from "fp-ts/Either";

import { prepare } from "../src/Body.js";
import { Adapter, andThen, neverThrow } from "../src/index.js";
import * as Platform from "../src/adapters/Platform.js";
import { filterStatusOk, json, text } from "../src/Response.js";

type Config = {
  headers: RequestInit["headers"];
};

export function withDefaults(args: Config): typeof Platform.default;
export function withDefaults(args: { neverThrow: true } & Config): Adapter;
export function withDefaults({ headers, ..._ }: Config) {
  return async (url: Adapter.url, init?: Adapter.init) => {
    const init_ = prepare(init);
    const fn =
      "neverThrow" in _ && _.neverThrow
        ? neverThrow(Platform.default)
        : Platform.default;
    return fn(url, {
      ...init_,
      headers: {
        ...headers,
        ...(init_.headers
          ? Object.fromEntries(Object.entries(init_.headers))
          : {}),
      },
    });
  };
}

const base_url = "https://reqres.in/api";

const config = {
  headers: { "x-api-key": "reqres-free-v1" },
};

const fetch = withDefaults(config);

test("google", async () => {
  const res = await fetch("https://www.google.com");
  const result = await andThen(filterStatusOk(res), text);
  expect((result as E.Right<string>).right).toContain("Google");
});

test("streaming", async () => {
  const res = await fetch("https://www.google.com");

  let result = "";

  if (res.body) {
    for await (const chunk of res.body) {
      result += new TextDecoder().decode(chunk);
    }
  }

  expect(result).toContain("Google");
});

test("should make request", async () => {
  const res = await fetch(base_url + "/users/2");
  const result = await andThen(filterStatusOk(res), json);
  expect((result as E.Right<any>).right.data.id).toBe(2);
});

test("should be able to abort request", async () => {
  const controller = new AbortController();

  let timeout = setTimeout(() => {
    controller.abort();
    clearTimeout(timeout);
  }, 500);

  const fetch = withDefaults({ ...config, neverThrow: true });

  const res = await fetch(base_url + "/users/2?delay=10", {
    signal: controller.signal,
  });

  const result = await andThen(filterStatusOk(res), json);

  const { left } = result as Extract<typeof result, { _tag: "Left" }>;
  const { cause } = left as Extract<typeof left, { _tag: "HttpError" }>;

  expect(cause).toBeInstanceOf(DOMException);
  expect((cause as DOMException).name).toBe("AbortError");
});

test("should partition response with status filter", async () => {
  const res = await fetch(base_url + "/users/2");
  const result = await andThen(filterStatusOk(res), json);
  expect((result as E.Right<any>).right.data.id).toBe(2);
});
