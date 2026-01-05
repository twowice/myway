/**
 * 문자열 내에서 http/https로 시작하는 URL만 추출하여 반환합니다.
 *
 * @param url - 원본 URL 문자열
 * @returns 추출된 URL 또는 null
 */
export function parseHomepageUrl(url?: string | null): string | null {
  if (!url) return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  // 문자열 안에서 http 또는 https로 시작하는 URL 추출
  const match = trimmed.match(/https?:\/\/[^\s]+/i);
  if (!match) return null;

  try {
    const parsed = new URL(match[0]);

    // http / https만 허용
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }

    return parsed.toString();
  } catch {
    // 깨진 URL 차단
    return null;
  }
}
