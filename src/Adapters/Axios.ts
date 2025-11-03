/**
 * @since 0.3.1
 */
import axios, { isCancel } from "axios";
import { left, right } from "fp-ts/Either";

import type { Adapter } from "../Fetch.js";
import { HttpError } from "../internal/error.js";

const fetch_: Adapter = async (url, init) => {
  try {
    let {
      body,
      method = "GET",
      headers,
      signal,
      credentials,
      redirect,
    } = init ?? {};

    if (headers) {
      headers = { ...Object.fromEntries(Object.entries(headers)) };
    }

    const res = await axios(url.toString(), {
      method,
      headers,
      data: body,
      validateStatus: () => true,
      signal: signal ?? undefined,
      responseType: "arraybuffer",
      maxRedirects:
        redirect === "error" || redirect == "manual" ? 0 : undefined,
      withCredentials:
        credentials == "omit"
          ? false
          : credentials === "include"
          ? true
          : undefined,
      // onDownloadProgress(progressEvent) {
      //   console.log(progressEvent);
      // },
    });

    const res_headers = new Headers();

    for (const [key, value] of Object.entries(res.headers || {})) {
      if (Array.isArray(value)) {
        value.forEach((v) => res_headers.append(key, v));
      } else if (value != null) {
        res_headers.append(key, value);
      }
    }

    const res_body = res.data ? new Blob([res.data]) : null;

    const response = new Response(res_body, {
      headers: res_headers,
      status: res.status,
      statusText: res.statusText,
    });

    return right(response);
  } catch (error) {
    let e: any = error;

    if (isCancel(error)) {
      e = new DOMException("Aborted", "AbortError");
      e.cause = error.cause;
      e.stack = error.stack;
    }

    return left(new HttpError(e));
  }
};

/**
 * @since 0.3.1
 * @category adapter
 */
export default fetch_;
