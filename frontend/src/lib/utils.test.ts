import { describe, it, expect } from 'vitest';
import { cn, getComponentMetadata } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge tailwind classes correctly', () => {
      expect(cn('px-2 py-2', 'px-4')).toBe('py-2 px-4');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'active', false && 'hidden')).toBe('base active');
      expect(cn('base', undefined, null, 0, '')).toBe('base');
    });
  });

  describe('getComponentMetadata', () => {
    it('should return metadata for valid components', () => {
      const meta = getComponentMetadata('StakeForm');
      expect(meta).toBeDefined();
      expect(meta['aria-label']).toBe('StakeForm');
    });

    it('should include description in aria-label if provided', () => {
      const meta = getComponentMetadata('StakeForm', 'Stake your tokens');
      expect(meta['aria-label']).toBe('StakeForm: Stake your tokens');
    });

    it('should return role region', () => {
      const meta = getComponentMetadata('Test');
      expect(meta.role).toBe('region');
    });

    it('should return null for unknown components', () => {
      expect(getComponentMetadata('UnknownComponent')).toBeNull();
    });

    it('should be case sensitive', () => {
      expect(getComponentMetadata('stakeform')).toBeNull();
    });
    });
  });
});
