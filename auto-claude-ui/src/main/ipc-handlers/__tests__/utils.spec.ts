import { describe, it, expect } from 'vitest';

import { isSafeExternalUrl } from '../utils';

describe('ipc-handlers utils', () => {
  describe('isSafeExternalUrl', () => {
    it('allows http/https', () => {
      expect(isSafeExternalUrl('https://example.com')).toBe(true);
      expect(isSafeExternalUrl('http://example.com/path?q=1')).toBe(true);
    });

    it('blocks non-http(s) protocols', () => {
      expect(isSafeExternalUrl('javascript:alert(1)')).toBe(false);
      expect(isSafeExternalUrl('file:///etc/passwd')).toBe(false);
      expect(isSafeExternalUrl('data:text/html;base64,PGgxPmg8L2gxPg==')).toBe(false);
    });

    it('blocks invalid URLs', () => {
      expect(isSafeExternalUrl('not a url')).toBe(false);
    });
  });
});
