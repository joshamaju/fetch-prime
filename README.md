# Fetch Prime

> `fetch` with super-powers

- 🔗 Interceptors
- 🔐 Fully typed errors
- 🔌 Platform adapters

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
import * as Http from "fetch-prime/Fetch";
import adapter from "fetch-prime/Adapters/Platform";

const fetch = Http.fetch(adapter);

const res = await fetch("/users");

if (E.isRight(res.right) && res.right.ok) {
  const users = await response.right.json();
}

// or
import { andThen } from "fetch-prime/Function";
import { filterStatusOk } from "fetch-prime/Response";

const res = await fetch("/users");
const ok = andThen(res, filterStatusOk);
const users = await andThen(ok, (res) => res.json());

// or
const fetch = Http.fetch_(adapter);
const response = await fetch("/users");
const users = await response.ok((res) => res.json());
```

## With interceptor

```ts
import * as Interceptor from "fetch-prime/Interceptor";
import BaseURL from "fetch-prime/Interceptors/Url";

const baseURL = "https://reqres.in/api";

// our list of interceptors
const interceptors = Interceptor.of(BaseURL(baseURL));
// or
const interceptors = Interceptor.add(Interceptor.empty(), BaseURL(baseURL));
// or using pipeline
import { pipe } from "fp-ts/function";

const interceptors = pipe(
  Interceptor.empty(),
  Interceptor.add(BaseURL(baseURL))
);

// make the function that executes our interceptors
const interceptor = Interceptor.make(interceptors);

// finally, make the HTTP adapter
const fetch = Http.fetch(interceptor(adapter));

const response = await fetch("/users");
```

## Adapters

`fetch-prime` provides the following adapters:

- Platform fetch
- Axios adapter

### Example

```ts
import * as Http from "fetch-prime/Fetch";
import adapter from "fetch-prime/Adapters/Axios";

const fetch = Http.fetch(adapter);

const res = await fetch("/users");
```

> You can write your own adapter i.e using XMLHttpRequest

## Interceptors

`fetch-prime` ships with the following interceptors

- Base URL
- Timeout
- Logger
- Status Filter
- Bearer and Basic authentication
- URLSearchParams
- Config

## Misc

`fetch-prime` provides a wrapper, `HttpResponseEither` that provides methods to easily manipulate the `Response` success channel.

### Example

Instead of doing

```ts
const response = await fetch("/users");

if (E.isRight(response) && response.right.ok) {
  const users = await response.right.json();
}
```

to check if the response is ok i.e 200. Do

```ts
import * as Http from "fetch-prime/Fetch";
import adapter from "fetch-prime/Adapters/Platform";

const fetch = Http.fetch_(adapter);

const response = await fetch("/users");
const users = await response.ok((res) => res.json());
```

It can also be delegated to a response interceptor that performs the check.

```ts
const interceptors = Interceptor.of(StatusOK);

const interceptor = Interceptor.make(interceptors);

const fetch = Http.fetch(interceptor(adapter));

const response = await fetch("/users");
const users = await andThen(response, (res) => res.json());
// ...
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
