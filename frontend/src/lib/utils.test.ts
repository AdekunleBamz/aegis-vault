import { describe, it, expect } from 'vitest';
import { cn, getComponentMetadata } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge tailwind classes correctly', () => {
      expect(cn('px-2', 'py-2')).toBe('px-2 py-2');
      expect(cn('px-2', 'px-4')).toBe('px-4');
      expect(cn('px-2', { 'py-2': true, 'py-4': false })).toBe('px-2 py-2');
    });
  });

  describe('getComponentMetadata', () => {
    it('should return correct metadata with only name', () => {
      const metadata = getComponentMetadata('Test Component');
      expect(metadata).toEqual({
        'aria-label': 'Test Component',
        'role': 'region',
      });
    });

    it('should return correct metadata with name and description', () => {
      const metadata = getComponentMetadata('Test Component', 'A test component description');
      expect(metadata).toEqual({
        'aria-label': 'Test Component: A test component description',
        'role': 'region',
      });
    });
  });
});
