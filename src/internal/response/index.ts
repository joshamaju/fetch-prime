import {
  map,
  left,
  right,
  bimap,
  chainW,
  isLeft,
  tryCatch,
  Either,
} from "fp-ts/Either";

import { decode } from "../utils.js";
import { StatusCode, StatusNotOK, StatusOK } from "./types.js";
import { andThen } from "../function.js";

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

export class HttpResponseEither<E> {
  constructor(readonly response: Either<E, HttpResponse>) {}

  private map<A>(fn: (r: HttpResponse) => A) {
    return map((r: HttpResponse) => fn(r))(this.response);
  }

  private chain<E1, A>(fn: (r: HttpResponse) => Either<E | E1, A>) {
    return chainW((r: HttpResponse) => fn(r))(this.response);
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
    return this.chain((_) => _.clone());
  }

  arrayBuffer() {
    return andThen(this.response, (_) => arrayBuffer(_.response));
  }

  blob() {
    return andThen(this.response, (_) => blob(_.response));
  }

  formData() {
    return andThen(this.response, (_) => formData(_.response));
  }

  json() {
    return andThen(this.response, (_) => json(_.response));
  }

  text() {
    return andThen(this.response, (_) => text(_.response));
  }
}
