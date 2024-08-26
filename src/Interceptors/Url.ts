/**
 * @since 0.0.1
 */

import { Chain } from "../Interceptor.js";
import { HttpRequest } from "../Request.js";

const Url = (base: string) => {
  return function (chain: Chain) {
    const req = chain.request;
    const url = req.url.toString();

    let url_ = url
      ? base.replace(/\/+$/, "") + "/" + url.replace(/^\/+/, "")
      : base;

    return chain.proceed(new HttpRequest(url_, req.init));
  };
};

/**
 * @since 0.0.1
 * @category interceptor
 */
export default Url;
