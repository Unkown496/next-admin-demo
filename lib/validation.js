import { FormatRegistry, JavaScriptTypeBuilder, Type } from "@sinclair/typebox";

FormatRegistry.Set("email", value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));

/** @type {JavaScriptTypeBuilder & { Numeric: import("@sinclair/typebox").TString }} */
export default {
  ...Type,
  Numeric: options =>
    Type.String({
      ...options,
      pattern: "^[0-9]+$",
    }),
};
