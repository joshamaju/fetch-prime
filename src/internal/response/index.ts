import { bimap, Either, isLeft, left, right } from "fp-ts/Either";

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

export const filterStatusOk = <E>(
  response: HttpResponse<E>
): Either<E | StatusError, Response> => {
  if ("_tag" in response) {
    if (isLeft(response)) return response;
    return filterStatusOk(response.right);
  }

  return response.ok ? right(response) : left(new StatusError(response));
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

export type HttpResponse<E> = Either<E, Response> | Response;
