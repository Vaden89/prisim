/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as board_functions from "../board_functions.js";
import type * as http from "../http.js";
import type * as invitation_functions from "../invitation_functions.js";
import type * as org_functions from "../org_functions.js";
import type * as status_functions from "../status_functions.js";
import type * as sub_task_functions from "../sub_task_functions.js";
import type * as task_functions from "../task_functions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  board_functions: typeof board_functions;
  http: typeof http;
  invitation_functions: typeof invitation_functions;
  org_functions: typeof org_functions;
  status_functions: typeof status_functions;
  sub_task_functions: typeof sub_task_functions;
  task_functions: typeof task_functions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("@convex-dev/better-auth/_generated/component.js").ComponentApi<"betterAuth">;
};
