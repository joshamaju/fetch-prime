/**
 * @since 0.0.1
 */

import { Adapter } from "../Fetch.js";
import { prepare } from "../internal/body.js";
import { HttpRequest } from "../internal/request.js";

const fetch_ = async (url: Adapter.url, init?: Adapter.init) => {
  return url instanceof HttpRequest
    ? fetch(url.url, url.init)
    : fetch(url, prepare(init));
};

/**
 * @since 0.0.1
 * @category adapter
 */
export default fetch_;
