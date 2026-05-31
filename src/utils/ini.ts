export type IniResult = { data: Record<string, Record<string, string>>; errors: string[] };
export function parseIniDetailed(text: string): IniResult {
  const data: Record<string, Record<string, string>> = {};
  const errors: string[] = [];
  let section = 'default';
  for (const [index, raw] of text.split(/\r?\n/).entries()) {
    const line = raw.trim();
    if (!line || line.startsWith(';') || line.startsWith('#')) continue;
    const match = line.match(/^\[(.+)]$/);
    if (match) { section = match[1]; data[section] ??= {}; continue; }
    const eq = line.indexOf('=');
    if (eq <= 0) { errors.push(`第 ${index + 1} 行缺少 Key=Value：${line}`); continue; }
    data[section] ??= {}; data[section][line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
  return { data, errors };
}
export function parseIni(text: string): Record<string, Record<string, string>> { return parseIniDetailed(text).data; }
