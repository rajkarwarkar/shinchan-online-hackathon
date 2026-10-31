import dns from 'dns/promises';
import { URL } from 'url';

export interface SSRFValidationResult {
  isValid: boolean;
  error?: string;
  resolvedIp?: string;
}

/**
 * Checks if an IPv4 or IPv6 address is private, loopback, or link-local.
 */
export function isPrivateOrReservedIp(ip: string): boolean {
  // IPv6 checks
  if (ip === '::1' || ip.startsWith('fe80:') || ip.startsWith('fc') || ip.startsWith('fd')) {
    return true;
  }

  // IPv4 mapped IPv6 (e.g. ::ffff:127.0.0.1)
  const ipv4Match = ip.match(/^(?:::ffff:)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  if (!ipv4Match) {
    return false;
  }

  const parts = ipv4Match[1].split('.').map(Number);
  if (parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true;
  }

  const [a, b] = parts;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;

  // 10.0.0.0/8 (Private)
  if (a === 10) return true;

  // 172.16.0.0/12 (Private)
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.168.0.0/16 (Private)
  if (a === 192 && b === 168) return true;

  // 169.254.0.0/16 (Link-Local, Cloud Metadata 169.254.169.254)
  if (a === 169 && b === 254) return true;

  // 0.0.0.0/8
  if (a === 0) return true;

  // 224.0.0.0/4 (Multicast) or 240.0.0.0/4 (Reserved)
  if (a >= 224) return true;

  return false;
}

/**
 * Validates a target URL against SSRF attacks.
 */
export async function validateUrlForSSRF(urlString: string): Promise<SSRFValidationResult> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlString);
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }

  // Protocol allowlist
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return {
      isValid: false,
      error: `Protocol '${parsedUrl.protocol}' is forbidden. Only HTTP and HTTPS are permitted.`
    };
  }

  const hostname = parsedUrl.hostname;

  // Reject localhost strings immediately
  if (
    hostname.toLowerCase() === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local')
  ) {
    return {
      isValid: false,
      error: 'Access to localhost and internal domain names is blocked.'
    };
  }

  // Resolve DNS to verify the actual IP address
  try {
    const addresses = await dns.lookup(hostname, { all: true });
    if (!addresses || addresses.length === 0) {
      return { isValid: false, error: 'DNS lookup returned no IP addresses for host.' };
    }

    for (const record of addresses) {
      if (isPrivateOrReservedIp(record.address)) {
        return {
          isValid: false,
          error: `Access to internal IP range (${record.address}) is forbidden.`,
          resolvedIp: record.address
        };
      }
    }

    return {
      isValid: true,
      resolvedIp: addresses[0].address
    };
  } catch (err) {
    return {
      isValid: false,
      error: `Failed to resolve hostname DNS: ${err instanceof Error ? err.message : 'Unknown resolution error'}`
    };
  }
}

