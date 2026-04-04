import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { CopyButton } from '../copy-button';

describe('CopyButton', () => {
  it('renders as a non-submit button by default', () => {
    const markup = renderToStaticMarkup(<CopyButton text="SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N" />);

    expect(markup).toContain('type="button"');
    expect(markup).toContain('Copy');
  });
});
