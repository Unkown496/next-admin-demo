import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import Page from '@/app/page';

// Mocking next layout

/** Simple Layout file without html, body and like tag, for running test */
const MockLayout = ({ children }) => {
  return <>{children}</>;
};

describe('Test Index Layout With Page', () => {
  render(
    <MockLayout>
      <Page />
    </MockLayout>,
  );

  it('Have elements', () => {
    expect(
      screen.getByRole('heading', { level: 1, name: 'Next-Admin app' }),
    ).toBeDefined();

    expect(screen.getByRole('button', { name: 'Next App' })).toBeDefined();
  });
});
