/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions from "../actions.js";
import type * as constants from "../constants.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as mutations from "../mutations.js";
import type * as queries from "../queries.js";
import type * as telegram from "../telegram.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  actions: typeof actions;
  constants: typeof constants;
  crons: typeof crons;
  http: typeof http;
  mutations: typeof mutations;
  queries: typeof queries;
  telegram: typeof telegram;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
