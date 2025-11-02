import { right } from "fp-ts/Either";
import { test, expect } from "vitest";
import { url, andThen } from "../src/Function";

test("url", () => {
  const args = { age: 10, user: 123 };
  const full_url = url("https://example.com/{age}?user={user}", args);
  expect(full_url).toBe("https://example.com/10?user=123");
});

test("andThen - sync", () => {
  const result = andThen(right(2), (n) => right(n * 2));
  expect(result).toEqual(right(4));
});

test("andThen - async", async () => {
  const result = await andThen(right(2), (n) => Promise.resolve(right(n * 2)));
  expect(result).toEqual(right(4));
});
