/**
 * @since 0.3.0
 */
import { Chain } from "../Interceptor.js";
import { HttpRequest } from "../Request.js";

const Config = (config: RequestInit) => {
  return function (chain: Chain) {
    const { url, init } = chain.request;
    const headers = { ...init?.headers, ...config.headers };
    const req = new HttpRequest(url, { ...init, ...config, headers });
    return chain.proceed(req);
  };
};

/**
 * @since 0.3.0
 * @category interceptor
 */
export default Config;
