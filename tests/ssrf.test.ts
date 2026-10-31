import { describe, it, expect } from 'vitest';
import { isPrivateOrReservedIp, validateUrlForSSRF } from '@/lib/security/ssrf';

describe('SSRF Guard & IP Validator', () => {
  it('correctly detects loopback, private, and cloud metadata IPs', () => {
    expect(isPrivateOrReservedIp('127.0.0.1')).toBe(true);
    expect(isPrivateOrReservedIp('10.0.5.2')).toBe(true);
    expect(isPrivateOrReservedIp('172.16.0.1')).toBe(true);
    expect(isPrivateOrReservedIp('192.168.1.1')).toBe(true);
    expect(isPrivateOrReservedIp('169.254.169.254')).toBe(true); // AWS Metadata
    expect(isPrivateOrReservedIp('::1')).toBe(true);
  });

  it('allows standard public IP addresses', () => {
    expect(isPrivateOrReservedIp('8.8.8.8')).toBe(false);
    expect(isPrivateOrReservedIp('1.1.1.1')).toBe(false);
  });

  it('blocks non-HTTP protocols', async () => {
    const fileResult = await validateUrlForSSRF('file:///etc/passwd');
    expect(fileResult.isValid).toBe(false);

    const ftpResult = await validateUrlForSSRF('ftp://internal.server/data');
    expect(ftpResult.isValid).toBe(false);
  });

  it('blocks localhost domain targets', async () => {
    const localResult = await validateUrlForSSRF('http://localhost:3000/api');
    expect(localResult.isValid).toBe(false);
  });
});

