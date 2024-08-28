import { expect, test } from "vitest";

import * as E from "fp-ts/Either";

import Adapter from "../src/Adapters/Platform.js";
import { fetch, fetch_, andThen } from "../src/index.js";
import { filterStatusOk, HttpResponse } from "../src/Response.js";

const base_url = "https://reqres.in/api";

test("google", async () => {
  const res = await fetch("https://www.google.com")(Adapter);
  const result = await res.ok((r) => r.text());
  expect((result as E.Right<string>).right).toContain("Google");
});

test("streaming", async () => {
  const program = fetch_("https://www.google.com");

  const res = await program(Adapter);

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
  const res = await fetch(base_url + "/users/2")(Adapter);
  const result = await res.ok((_) => _.json());
  expect((result as E.Right<any>).right.data.id).toBe(2);
});

test("should be able to abort request", async () => {
  const controller = new AbortController();

  const req = fetch(base_url + "/users/2?delay=10", {
    signal: controller.signal,
  });

  let timeout = setTimeout(() => {
    controller.abort();
    clearTimeout(timeout);
  }, 500);

  const res = await req(Adapter);
  const result = await res.ok((_) => _.json());

  const { left } = result as Extract<typeof result, { _tag: "Left" }>;
  const { cause } = left as Exclude<typeof left, HttpResponse>;

  expect(cause).toBeInstanceOf(DOMException);
  expect((cause as DOMException).name).toBe("AbortError");
});

test("should partition response with status filter", async () => {
  const request = await fetch(base_url + "/users/2")(Adapter);
  const ok = andThen(request.response, filterStatusOk);
  const result = await andThen(ok, (r) => r.json());
  expect((result as E.Right<any>).right.data.id).toBe(2);
});
