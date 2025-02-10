import { excludeKeys } from "@helpers/object";
import { TypeCheck, TypeCompiler } from "@sinclair/typebox/compiler";

import { headersToObject } from "@utils/request";
import { NextRequest, NextResponse } from "next/server";

const validationFields = ["headers", "body", "query", "params", "cookie"];

/**
 * @typedef {Record<"headers" | "body" | "query" | "params" | "cookie", import('@sinclair/typebox').TSchema>} ValidationSchema
 */

/**
 * @exports
 * @template [T, V]
 * @param {(req: Request, response: NextResponse<T>) => Promise<void>} handler
 * @param {Partial<ValidationSchema>} schema
 * @returns {(req: Request, res: NextResponse<T>) => Promise<void>}
 */
export default function withValidation(handler, schema) {
  const validateParamsArrayEntries = Object.entries(schema)
    .filter(([schemaKey]) => validationFields.includes(schemaKey))
    .map(([validateKey, validateSchema]) => [
      validateKey,
      TypeCompiler.Compile(validateSchema),
    ]);

  /** @type {Record<keyof ValidationSchema, TypeCheck<import('@sinclair/typebox').TSchema>>} */
  let validateParams = {};

  if (validateParamsArrayEntries.length !== 0)
    validateParams = Object.fromEntries(validateParamsArrayEntries);

  return async (req, res) => {
    const { json, headers, url } = req;

    const { searchParams: reqQuery } = new URL(url);
    const params = await res.params;

    const requestParams = {
      body: await json(),
      query: Object.fromEntries(reqQuery),
      headers: headersToObject(headers),
      params,
      cookie: "",
    };

    // run validation
    const validationErrors = {};

    if (Object.keys(validateParams).length !== 0) {
      Object.entries(validateParams).forEach(([validateKey, validate]) => {
        const currentRequestParam = requestParams[validateKey];

        const isValidate = validate.Check(currentRequestParam);

        if (!isValidate)
          validationErrors[validateKey] = {
            errors: [...validate.Errors(currentRequestParam)],
          };
      });
    }
    if (Object.keys(validationErrors).length !== 0) {
      const errorJSON = {};

      Object.entries(validationErrors).forEach(([erroredField, errorsData]) => {
        const { errors } = errorsData;

        const finalErrors = errors.map(errorObject => {
          return excludeKeys(errorObject, ["type", "schema"]);
        });

        errorJSON[erroredField] = finalErrors;
      });

      return NextResponse.json(errorJSON, {
        status: 400,
      });
    }

    return await handler(req, res);
  };
}
