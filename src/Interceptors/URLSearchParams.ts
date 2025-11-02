/**
 * @since 0.3.0
 */
import { URLSearchParams } from "./internal/url-search-params.js";

/**
 * @since 0.3.0
 * @category model
 */
export interface Config {
  params?: string[][] | Record<string, any> | string | URLSearchParams;
}

/**
 * @since 0.3.0
 * @category interceptor
 */
export default URLSearchParams;
