# Fetch Prime

`fetch` but with super-powers

- 🔗 Interceptors
- 🔐 Strongly typed errors
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

const response = await fetch("/users")(adapter);

if (E.isRight(response) && response.right.ok) {
  const users = await response.right.json();
}

// or
import { chain } from "fetch-prime/Function";
import * as Response from "fetch-prime/Response";

const result = await fetch("/users")(adapter);
const ok = E.chainW(Response.filterStatusOk)(result);
const users = await chain(ok, (res) => res.json());
```

### With interceptor

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
const intercept_adapter = interceptor(adapter);

const response = await fetch("/users")(intercept_adapter);
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

### Example

Instead of checking if the response is ok i.e 200

```ts
const response = await fetch("/users")(adapter);

if (E.isRight(response) && response.right.ok) {
  const users = await response.json();
}
```

We can delegate that to a response interceptor that performs that check.

```ts
const interceptors = Interceptor.of(StatusOK);

const interceptor = Interceptor.make(interceptors);

const adapter = interceptor(adapter);

const request = await fetch("/users")(adapter);
const users = await chain(request, (res) => res.json());
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
