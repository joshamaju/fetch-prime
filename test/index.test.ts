import { describe, expect, test } from "vitest";

import * as E from "fp-ts/Either";
import { constNull, pipe } from "fp-ts/function";

import Adapter from "../src/Adapters/Platform.js";
import * as Http from "../src/index.js";
import { andThen } from "../src/index.js";
import { filterStatusOk, HttpResponse, json } from "../src/Response.js";

const base_url = "https://reqres.in/api";

const config = {
  headers: { "x-api-key": "reqres-free-v1" },
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
  const res = await fetch_(base_url + "/users/2", config);
  const result = await res.ok((_) => _.json());
  expect((result as E.Right<any>).right.data.id).toBe(2);
});

test("should be able to abort request", async () => {
  const controller = new AbortController();

  let timeout = setTimeout(() => {
    controller.abort();
    clearTimeout(timeout);
  }, 500);

  const res = await fetch_(base_url + "/users/2?delay=10", {
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
  const request = await fetch(base_url + "/users/2", config);
  const ok = andThen(request, filterStatusOk);
  const result = await andThen(ok, json);
  expect((result as E.Right<any>).right.data.id).toBe(2);
});
