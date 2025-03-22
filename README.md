# Fetch Prime

`fetch` but with super-powers

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
import { fetch } from "fetch-prime/Fetch";
import adapter from "fetch-prime/Adapters/Platform";

const res = await fetch(adapter)("/users");

if (E.isRight(res.response) && res.response.right.ok) {
  const users = await response.right.json();
}

// or
import { fetch } from "fetch-prime/Fetch";
import { andThen } from "fetch-prime/Function";
import {filterStatusOk} from "fetch-prime/Response";

const res = await fetch(adapter)("/users");
const ok = andThen(res.response, filterStatusOk);
const users = await andThen(ok, (res) => res.json());

// or
const response = await fetch(adapter)("/users");
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

// make function that executes our interceptors
const interceptor = Interceptor.make(interceptors);

// we finally make the HTTP adapter
const intercept = interceptor(adapter);

const response = await fetch(intercept)("/users");
```

## Adapters

`fetch-prime` provides a default adapter that uses the platform fetch.

```ts
import FetchAdapter from "fetch-prime/Adapters/Platform";
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

### Example

Instead of checking if the response is ok i.e 200

```ts
const response = await fetch(adapter)("/users");
const users = await response.ok(res => res.json());
```

We can delegate that to a response interceptor that performs that check.

```ts
const interceptors = Interceptor.of(StatusOK);

const interceptor = Interceptor.make(interceptors);

const adapter = interceptor(Adapter);

const response = await fetch(adapter)("/users");
const users = await response.json();
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
