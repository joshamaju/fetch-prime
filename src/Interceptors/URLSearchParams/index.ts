/**
 * @since 0.3.0
 */
import { Config, URLSearchParams } from "./interceptor.js";

declare module "../../Fetch.js" {
  interface RequestInit extends Config {}
}

/**
 * @since 0.3.0
 * @category interceptor
 */
export default URLSearchParams;
