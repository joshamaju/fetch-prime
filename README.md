# Fetch Prime

`fetch` but with super-powers

- 🖇 Interceptors
- 🔐 Strongly typed errors

## Install

```bash
npm install fetch-prime fp-ts
```

```html
<script src="https://unpkg.com/fetch-prime/dist/index.js"></script>
```

## Example

```ts
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

import { fetch, map } from "fetch-prime/Fetch";
import { chain } from "fetch-prime/Function";
import * as Result from "fetch-prime/Response";
import adapter from "fetch-prime/Adapters/Platform";

const result = await fetch("/users")(adapter);
const res = pipe(result, E.chainW(Result.filterStatusOk));
const users = await chain(res, (res) => res.json());
```

### With interceptor

```ts
import * as Interceptor from "fetch-prime/Interceptor";
import BaseURL from "fetch-prime/Interceptors/Url";

const baseURL = "https://reqres.in/api";

// our list of interceptors
const interceptors = Interceptor.of(BaseURL(baseURL));

// make function that executes our interceptors
const interceptor = Interceptor.make(interceptors);

// we finally make the HTTP adapter using the native Fetch API
const adapter = interceptor(adapter);

const result = await program(adapter);
```

## POST Request

```ts
const request = fetch("/users", { method: "POST" });
// ...
```

## Interceptors

`fetch-prime` ships with default interceptors

- Base URL
- Timeout
- Logger
- Status Filter
- Bearer and Basic authentication

### Status Filter

To avoid manually forking the response into the error and success paths

```ts
const result = await fetch("/users")(adapter);

// equivalent to response.ok ? response.json() : // handle not ok status
const res = pipe(result, E.chainW(Result.filterStatusOk));

const users = await chain(res, (res) => res.json());
```

We can delegate that to an interceptor. So we can decode the response body without worrying about the OK status

```ts
const interceptors = Interceptor.of(StatusOK);

const interceptor = Interceptor.make(interceptors);

const adapter = interceptor(adapter);

const request = await fetch("/users")(adapter);
const users = await chain(request, (res) => res.json());

if (E.isLeft(users) && users.left instanceof StatusError) {
  // do something with error status response
}
```

### Writing your own interceptor

```ts
import * as Interceptor from "fetch-prime/Interceptor";

const my_interceptor = async function (chain: Interceptor.Chain) {
  const clone = chain.request.clone(); // do something with request
  const response = await chain.proceed(chain.request);
  // do something with response
  return response;
};
```

> Interceptors are executed in the order which they were added (top to bottom).

[more examples](/test)
