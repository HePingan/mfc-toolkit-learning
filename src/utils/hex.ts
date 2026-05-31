export function asciiToHex(input: string): string {
  return Array.from(input)
    .map((char) => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'))
    .join(' ');
}

export function hexToAscii(input: string): string {
  const compact = input.replace(/\s+/g, '');
  if (/[^0-9a-fA-F]/.test(compact)) return 'HEX 包含非法字符，只允许 0-9 A-F';
  if (compact.length % 2 !== 0) return 'HEX 长度必须为偶数';
  return (
    compact
      .match(/.{1,2}/g)
      ?.map((hex) => String.fromCharCode(parseInt(hex, 16)))
      .join('') ?? ''
  );
}
