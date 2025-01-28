import { NextResponse } from 'next/server';

/**
 * A test Type Schema
 * @typedef {object} Test
 * @property {number} test - test field number type
 */

/**
 * GET /api/v1/hello
 * @async
 * @description Test api endpoint description
 * @summary Test api endopoint
 * @tags Test
 * @return {Test} 200 - Test api endpoint return description - application/json
 */
export async function GET(request) {
  return NextResponse.json({ test: 123 });
}
