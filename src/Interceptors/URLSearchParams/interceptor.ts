import { Chain } from "../../Interceptor.js";
import { HttpRequest } from "../../Request.js";

export interface Config {
  params?: string[][] | Record<string, any> | string | URLSearchParams;
}

export function URLSearchParams(chain: Chain) {
  const req = chain.request;
  let url = req.url.toString();
  const params = (req.init as Config | undefined)?.params;

  if (params) {
    const serialized =
      params instanceof globalThis.URLSearchParams
        ? params
        : new globalThis.URLSearchParams(params);

    url += (url.indexOf("?") === -1 ? "?" : "&") + serialized.toString();
  }

  return chain.proceed(new HttpRequest(url, req.init));
}
