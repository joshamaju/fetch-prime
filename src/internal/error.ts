export abstract class TaggedError extends Error {
  abstract readonly _tag: string;

  constructor(...args: Parameters<typeof Error>) {
    super(...args);

    if ("captureStackTrace" in Error) {
      // @ts-expect-error
      Error.captureStackTrace(this, TaggedError);
    }
  }
}

export class HttpError extends TaggedError {
  readonly _tag = "HttpError";
}

export class DecodeError extends TaggedError {
  readonly _tag = "DecodeError";
}
