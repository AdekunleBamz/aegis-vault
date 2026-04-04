import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Button } from '../button';

describe('Button', () => {
  it('defaults to a non-submit button while preserving explicit types', () => {
    expect(renderToStaticMarkup(<Button>Stake</Button>)).toContain('type="button"');
    expect(renderToStaticMarkup(<Button type="submit">Stake</Button>)).toContain('type="submit"');
  });
});
