import type { Operation } from "effection";
import { call, createContext } from "effection";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import PlatformAdapter from "../../Adapters/Platform.js";
import { Adapter, Fetch } from "../../Fetch.js";
import * as Http from "../../index.js";
import { Interceptor } from "../../index.js";
import * as Result from "../../Response.js";

const context = createContext<Adapter>("fetch");

export function* useFetchAdapter<T extends Fetch<any>>(): Operation<T> {
  // @ts-expect-error
  return yield* context;
}

const first = async function (chain: Interceptor.Chain) {
  const res = await chain.proceed(chain.request);
  const text = await Http.andThen(res, Result.text);
  return E.map((t: string) => new Response((parseFloat(t) + 2).toString()))(
    text
  );
};

const second = async function (chain: Interceptor.Chain) {
  const res = await chain.proceed(chain.request);
  const text = await Http.andThen(res, Result.text);
  return E.map((t: string) => new Response((parseFloat(t) + 1).toString()))(
    text
  );
};

const third = async () => E.right(new Response("1"));

const interceptors = pipe(
  Interceptor.empty(),
  Interceptor.add(first),
  Interceptor.add(second),
  Interceptor.add(third)
);

const interceptor = Interceptor.make(interceptors)(PlatformAdapter);

function* app() {
  const adapter = yield* useFetchAdapter<typeof interceptor>();
  const res = yield* call(Http.fetch("/users/2")(adapter));
  const result = yield* call(res.ok((_) => _.text()));
}
