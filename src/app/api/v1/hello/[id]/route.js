import withValidation from '@lib/withValidation';
import { Type as T } from '@sinclair/typebox';
import { NextResponse } from 'next/server';

/**
 * POST /api/v1/hello/{id}
 * @async
 * @description Test fake create endpoint
 * @summary Test api endopoint
 * @tags Test
 * @param {string} id.path - test id
 * @param {string} test.query.required
 * @param {Test} request.body - test body fields
 * @returns
 */
export const POST = withValidation(
  async req => {
    return NextResponse.json({ ok: true });
  },
  {
    body: T.Object({
      test: T.Number({
        minimum: 0,
        maximum: 10,
      }),
    }),
    query: T.Object({
      test: T.Number({ maximum: 10 }),
    }),
  },
);
