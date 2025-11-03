/**
 * @since 0.0.1
 */
import { left, right } from "fp-ts/Either";

import type { Adapter } from "../Fetch.js";
import { HttpError } from "../internal/error.js";

const fetch_: Adapter = async (url, init) => {
  try {
    const res = await fetch(url, init);
    return right(res);
  } catch (error) {
    return left(new HttpError(error));
  }
};

/**
 * @since 0.0.1
 * @category adapter
 */
export default fetch_;
