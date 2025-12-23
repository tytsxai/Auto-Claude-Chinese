/**
 * HTTP client utilities for fetching updates
 */

import https from 'https';
import { createWriteStream } from 'fs';
import { DEFAULT_GITHUB_PROXY, ENABLE_PROXY_FALLBACK, TIMEOUTS } from './config';

/**
 * Normalize proxy base URL (remove trailing slash)
 */
const normalizeProxyBase = (proxyBase?: string | null) =>
  proxyBase?.replace(/\/+$/, '') || null;

/**
 * Build a proxied URL (auto-fallback to default proxy if enabled)
 */
export function buildProxiedUrl(url: string, proxyBase?: string | null): string | null {
  const base = normalizeProxyBase(proxyBase) || (ENABLE_PROXY_FALLBACK ? DEFAULT_GITHUB_PROXY : null);
  if (!base) return null;
  // Avoid double-prefixing if caller already passed a proxied URL
  if (url.startsWith(base)) return url;
  return `${base}/${url}`;
}

const formatError = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

/**
 * Fetch JSON from a URL using https
 */
export function fetchJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'Auto-Claude-UI',
      'Accept': 'application/vnd.github+json'
    };

    const request = https.get(url, { headers }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          fetchJson<T>(redirectUrl).then(resolve).catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        // Collect response body for error details (limit to 10KB)
        const maxErrorSize = 10 * 1024;
        let errorData = '';
        response.on('data', chunk => {
          if (errorData.length < maxErrorSize) {
            errorData += chunk.toString().slice(0, maxErrorSize - errorData.length);
          }
        });
        response.on('end', () => {
          const errorMsg = `HTTP ${response.statusCode}: ${errorData || response.statusMessage || 'No error details'}`;
          reject(new Error(errorMsg));
        });
        response.on('error', reject);
        return;
      }

      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          resolve(JSON.parse(data) as T);
        } catch (_e) {
          reject(new Error('Failed to parse JSON response'));
        }
      });
      response.on('error', reject);
    });

    request.on('error', reject);
    request.setTimeout(TIMEOUTS.requestTimeout, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Fetch JSON with a proxy fallback for environments无法直连 GitHub
 */
export async function fetchJsonWithFallback<T>(url: string, proxyBase?: string | null): Promise<T> {
  try {
    return await fetchJson<T>(url);
  } catch (primaryError) {
    const proxiedUrl = buildProxiedUrl(url, proxyBase);
    if (!proxiedUrl) throw primaryError;

    try {
      return await fetchJson<T>(proxiedUrl);
    } catch (proxyError) {
      throw new Error(
        `检查更新失败：直连 ${formatError(primaryError)}；代理 ${formatError(proxyError)}。` +
        '请检查网络或配置 AUTO_CLAUDE_GITHUB_PROXY 后重试。'
      );
    }
  }
}

/**
 * Download a file with progress tracking
 */
export function downloadFile(
  url: string,
  destPath: string,
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(destPath);

    // GitHub API URLs need the GitHub Accept header to get a redirect to the actual file
    // Non-API URLs (CDN, direct downloads) use octet-stream
    const isGitHubApi = url.includes('api.github.com');
    const headers = {
      'User-Agent': 'Auto-Claude-UI',
      'Accept': isGitHubApi ? 'application/vnd.github+json' : 'application/octet-stream'
    };

    const request = https.get(url, { headers }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, destPath, onProgress).then(resolve).catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        file.close();
        // Collect response body for error details (limit to 10KB)
        const maxErrorSize = 10 * 1024;
        let errorData = '';
        response.on('data', chunk => {
          if (errorData.length < maxErrorSize) {
            errorData += chunk.toString().slice(0, maxErrorSize - errorData.length);
          }
        });
        response.on('end', () => {
          const errorMsg = `HTTP ${response.statusCode}: ${errorData || response.statusMessage || 'No error details'}`;
          reject(new Error(errorMsg));
        });
        response.on('error', reject);
        return;
      }

      const totalSize = parseInt(response.headers['content-length'] || '0', 10);
      let downloadedSize = 0;

      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        if (totalSize > 0 && onProgress) {
          onProgress(Math.round((downloadedSize / totalSize) * 100));
        }
      });

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });

      file.on('error', (err) => {
        file.close();
        reject(err);
      });
    });

    request.on('error', (err) => {
      file.close();
      reject(err);
    });

    request.setTimeout(TIMEOUTS.downloadTimeout, () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
}

/**
 * Download with proxy fallback for GitHub资源
 */
export async function downloadFileWithFallback(
  url: string,
  destPath: string,
  onProgress?: (percent: number) => void,
  proxyBase?: string | null
): Promise<void> {
  try {
    await downloadFile(url, destPath, onProgress);
    return;
  } catch (primaryError) {
    const proxiedUrl = buildProxiedUrl(url, proxyBase);
    if (!proxiedUrl) throw primaryError;

    try {
      await downloadFile(proxiedUrl, destPath, onProgress);
      return;
    } catch (proxyError) {
      throw new Error(
        `下载更新失败：直连 ${formatError(primaryError)}；代理 ${formatError(proxyError)}。` +
        '请检查网络或配置 AUTO_CLAUDE_GITHUB_PROXY 后重试。'
      );
    }
  }
}
