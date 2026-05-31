export function crc16Modbus(bytes: number[]): number {
  let crc = 0xffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = crc & 1 ? (crc >> 1) ^ 0xa001 : crc >> 1;
  }
  return crc;
}

export function buildReadHoldingFrame(slave: number, start: number, count: number): string {
  const frame = [slave, 0x03, (start >> 8) & 0xff, start & 0xff, (count >> 8) & 0xff, count & 0xff];
  const crc = crc16Modbus(frame);
  return [...frame, crc & 0xff, (crc >> 8) & 0xff]
    .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
    .join(' ');
}
