export function Terminal({ lines }: { lines: string[] }) {
  return <div className="terminal">{lines.map((line, index) => <div key={`${line}-${index}`}><span>$</span> {line}</div>)}</div>;
}
