export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadTextFile(filename: string, content: string, type = 'text/plain;charset=utf-8') {
  downloadBlob(filename, new Blob([content], { type }));
}

export function downloadMarkdown(filename: string, content: string) {
  downloadTextFile(filename, content, 'text/markdown;charset=utf-8');
}

export function downloadJson(filename: string, data: unknown) {
  const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  downloadTextFile(filename, content, 'application/json;charset=utf-8');
}
