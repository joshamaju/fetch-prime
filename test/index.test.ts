import { expect, test } from "vitest";

import * as E from "fp-ts/Either";
import { identity, pipe } from "fp-ts/function";

import PlatformAdapter from "../src/Adapters/Platform.js";
import * as Http from "../src/index.js";
import { filterStatusOk } from "../src/Response.js";

const base_url = "https://reqres.in/api";

test("google", async () => {
  const res = await Http.fetch("https://www.google.com")(PlatformAdapter);
  const result = await Http.chain(res, (r) => r.text());
  expect((result as E.Right<string>).right).toContain("Google");
});

test("streaming", async () => {
  const program = Http.fetch_("https://www.google.com");

  const res = await program(PlatformAdapter);

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
  const res = await Http.fetch(base_url + "/users/2")(PlatformAdapter);
  const part = pipe(res, E.chainW(filterStatusOk));
  const result = await Http.chain(part, (_) => _.json());
  expect((result as E.Right<any>).right.data.id).toBe(2);
});

test("should be able to abort request", async () => {
  const controller = new AbortController();

  const req = Http.fetch(base_url + "/users/2?delay=10", {
    signal: controller.signal,
  });

  let timeout = setTimeout(() => {
    controller.abort();
    clearTimeout(timeout);
  }, 500);

  const res = await req(PlatformAdapter);
  const result = await Http.chain(res, (_) => _.json());

  const { cause } = (result as Extract<typeof result, { _tag: "Left" }>).left;

  expect(cause).toBeInstanceOf(DOMException);
  expect((cause as DOMException).name).toBe("AbortError");
});

test("should create wrapper function", async () => {
  const res = Http.fetch(base_url + "/users/2");
  const json = Http.map(
    res,
    E.map((r) => r.json())
  );
  const result = await Http.chain(await json(PlatformAdapter), identity);
  expect((result as E.Right<any>).right.data.id).toBe(2);
});

test("should create wrapper function and transform response", async () => {
  const res = Http.fetch(base_url + "/users/2");
  const json = Http.map(
    res,
    Http.chain((r) => r.json())
  );
  const result = await json(PlatformAdapter);
  expect((result as E.Right<any>).right.data.id).toBe(2);
});

test("should create wrapper function with status filter", async () => {
  const request = Http.fetch(base_url + "/users/2");
  const req = Http.map(request, E.chainW(filterStatusOk));

  const users = Http.map(
    req,
    Http.chain((r) => r.json())
  );

  const result = await users(PlatformAdapter);

  expect((result as E.Right<any>).right.data.id).toBe(2);
});
