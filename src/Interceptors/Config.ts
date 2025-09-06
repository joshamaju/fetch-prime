import { Chain } from "../Interceptor.js";
import { HttpRequest } from "../Request.js";

const Config = (config: RequestInit) => {
  return function (chain: Chain) {
    const { url, init } = chain.request;

    const req = new HttpRequest(url, {
      ...init,
      ...config,
      headers: { ...init?.headers, ...config.headers },
    });

    return chain.proceed(req);
  };
};

/**
 * @since 0.0.1
 * @category interceptor
 */
export default Config;
