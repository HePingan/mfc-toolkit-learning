export function buildHttpRequest(method: string, url: string, body: string, headersText = 'Content-Type: application/json') {
  const target = new URL(url || 'https://example.com/api/device');
  const base = [`${method} ${target.pathname || '/'} HTTP/1.1`, `Host: ${target.host}`, ...headersText.split(/\r?\n/).filter(Boolean)];
  return method === 'POST' ? `${base.join('\n')}\n\n${body}` : base.join('\n');
}
