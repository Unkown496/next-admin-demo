import { describe, it, expect } from 'vitest';

import { testRequest } from '@utils/test';

import { GET } from '@api/v1/hello/route';

describe('API Route /api/v1/hello testing', () => {
  it('GET', async () => {
    const request = testRequest('/api/v1/hello'),
      response = await GET(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ test: 123 });
  });

  // others method if exists
});
