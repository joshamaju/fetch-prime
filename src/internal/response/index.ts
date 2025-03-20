import {
  bimap,
  Either,
  isLeft,
  left,
  map,
  right,
  tryCatch,
} from "fp-ts/Either";

import { decode } from "../utils.js";
import { StatusCode, StatusNotOK, StatusOK } from "./types.js";

export class StatusError {
  readonly _tag = "StatusError";
  constructor(readonly response: Response) {}
}

export interface StatusErrorT<S extends number> extends StatusError {
  response: Omit<Response, "status"> & { status: S };
}

export interface ResponseT<S extends StatusCode> extends Response {
  status: S;
}

export const json = decode((response: Response) => response.json());

export const blob = decode((response: Response) => response.blob());

export const text = decode((response: Response) => response.text());

export const formData = decode((response: Response) => response.formData());

export const arrayBuffer = decode((response: Response) =>
  response.arrayBuffer()
);

export const filterStatusOk = <R extends Response | HttpResponse>(
  response: R
) => {
  return response.ok
    ? right(response)
    : left(
        new StatusError(
          response instanceof HttpResponse ? response.response : response
        )
      );
};

export const filterStatusOkT = (response: Response) => {
  return bimap(
    (e: StatusError) => e as StatusErrorT<StatusNotOK>,
    (r: Response) => r as ResponseT<StatusOK>
  )(filterStatusOk(response));
};

export const filterStatus = (
  response: Response,
  fn: (status: number) => boolean
) => {
  return fn(response.status)
    ? right(response)
    : left(new StatusError(response));
};

export class HttpResponse {
  constructor(readonly response: Response) {}

  get headers(): Headers {
    return this.response.headers;
  }

  get ok(): boolean {
    return this.response.ok;
  }

  get redirected(): boolean {
    return this.response.redirected;
  }

  get status(): number {
    return this.response.status;
  }

  get statusText(): string {
    return this.response.statusText;
  }

  get type(): ResponseType {
    return this.response.type;
  }

  get url(): string {
    return this.response.url;
  }

  get body(): ReadableStream<Uint8Array> | null {
    return this.response.body;
  }

  get bodyUsed(): boolean {
    return this.response.bodyUsed;
  }

  clone(): Either<Error, Response> {
    return tryCatch(
      () => this.response.clone(),
      (error) => error as Error
    );
  }

  arrayBuffer() {
    return arrayBuffer(this.response);
  }

  blob() {
    return blob(this.response);
  }

  formData() {
    return formData(this.response);
  }

  json() {
    return json(this.response);
  }

  text() {
    return text(this.response);
  }
}

export class ResponseEither<E> {
  constructor(private res: Either<E, Response>) {}

  get response() {
    return map((_: Response) => new HttpResponse(_))(this.res);
  }

  get() {
    if (isLeft(this.res)) throw this.res.left;
    return this.res.right;
  }

  getOrNull() {
    if (isLeft(this.res)) return null;
    return this.res.right;
  }

  map<A>(fn: (r: HttpResponse) => A) {
    return map((r: HttpResponse) => fn(r))(this.response);
  }

  andThen<E1, B>(
    fn: (self: HttpResponse) => Promise<Either<E1, B>>
  ): Promise<Either<E | E1, B>>;
  andThen<E1, B>(fn: (self: HttpResponse) => Either<E1, B>): Either<E | E1, B>;
  andThen<B>(fn: (self: HttpResponse) => B): Either<E, B>;
  andThen<E1, B>(
    fn: (self: HttpResponse) => Promise<Either<E1, B>> | Either<E1, B> | B
  ) {
    const res = this.response;
    if (isLeft(res)) return res;
    return fn(res.right);
  }

  async ok<E1, A>(
    fn: (self: HttpResponse) => Promise<Either<E1, A>>
  ): Promise<Either<E | E1 | HttpResponse, A>> {
    const res = this.response;
    if (isLeft(res)) return res;
    return res.right.ok ? fn(res.right) : left(res.right);
  }

  get headers() {
    return this.map((_) => _.headers);
  }

  get redirected() {
    return this.map((_) => _.redirected);
  }

  get status() {
    return this.map((_) => _.status);
  }

  get statusText() {
    return this.map((_) => _.statusText);
  }

  get type() {
    return this.map((_) => _.type);
  }

  get url() {
    return this.map((_) => _.url);
  }

  get body() {
    return this.map((_) => _.body);
  }

  get bodyUsed() {
    return this.map((_) => _.bodyUsed);
  }

  clone() {
    return this.andThen((_) => _.clone());
  }

  arrayBuffer() {
    return this.andThen((_) => _.arrayBuffer());
  }

  blob() {
    return this.andThen((_) => _.blob());
  }

  formData() {
    return this.andThen((_) => _.formData());
  }

  json() {
    return this.andThen((_) => _.json());
  }

  text() {
    return this.andThen((_) => _.text());
  }
}
