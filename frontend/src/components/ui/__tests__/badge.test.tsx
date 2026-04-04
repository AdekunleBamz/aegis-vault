import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { Badge } from '../badge';

describe('Badge', () => {
  it('renders removable badges with safe button semantics', () => {
    const markup = renderToStaticMarkup(
      <Badge removable onRemove={vi.fn()}>
        Premium
      </Badge>
    );

    expect(markup).toContain('type="button"');
    expect(markup).toContain('aria-label="Remove badge"');
  });
});
