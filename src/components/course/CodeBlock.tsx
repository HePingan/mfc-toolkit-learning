export function CodeBlock({ code, language = 'cpp' }: { code: string; language?: string }) {
  return <pre className="code-block"><span>{language}</span><code>{code}</code></pre>;
}
