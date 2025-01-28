import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import Page from '@/app/page';

test('Test Index Page', () => {
  render(<Page />);

  expect(
    screen.getByRole('heading', { level: 1, name: 'Next-Admin app' }),
  ).toBeDefined();
});
