import { Body, Form, Json, Text, URLEncoded } from "../Body.js";
import { Init } from "../Fetch.js";

export function isBody(input: unknown): input is Body {
  return (
    typeof input === "object" &&
    input !== null &&
    "_id" in input &&
    "_tag" in input &&
    input._tag === "Body"
  );
}

export function text(input: string): Text {
  return {
    _id: "Text",
    _tag: "Body",
    value: input,
    headers: {
      "Content-Type": "text/plain",
      "Content-Length": input.length.toString(),
    },
  };
}

export function json(input: object): Json {
  const body = JSON.stringify(input);
  return {
    _id: "Text",
    _tag: "Body",
    value: body,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Content-Length": body.length.toString(),
    },
  };
}

export function form(
  input: FormData | Record<string, string | Array<unknown>>
): Form {
  const formData = new FormData();

  if (!(input instanceof FormData)) {
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        const item = input[key];

        if (Array.isArray(item)) {
          for (let n of item) formData.append(key, n as any);
        } else {
          formData.set(key, item);
        }
      }
    }
  }

  return {
    _id: "Form",
    _tag: "Body",
    value: formData,
  };
}

export function urlencoded(
  input: Record<string, unknown | Array<unknown>>
): URLEncoded {
  const data = new URLSearchParams();

  if (!(input instanceof URLSearchParams)) {
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        const item = input[key];

        if (Array.isArray(item)) {
          for (let n of item) data.append(key, n as any);
        } else {
          data.set(key, item as any);
        }
      }
    }
  }

  return {
    _tag: "Body",
    _id: "URLEncoded",
    value: data.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
}

export function prepare(init: Init) {
  let rest: RequestInit = {};
  let body: RequestInit["body"];
  let headers: RequestInit["headers"];

  if (isBody(init)) {
    body = init.value;
    headers = init.headers;
  } else {
    let { body: local_body, headers: local_headers, ..._ } = init ?? {};

    if (local_body && isBody(local_body)) {
      const body = local_body;

      if (local_headers) {
        const headers = {
          ...Object.fromEntries(Object.entries(local_headers)),
        };

        for (const key in body.headers) {
          headers[key] = body.headers[key];
        }

        local_headers = headers;
      } else {
        local_headers = body.headers;
      }

      local_body = body.value;
    }

    rest = _;

    body = local_body;
    headers = local_headers;
  }

  return { ...rest, body, headers };
}
