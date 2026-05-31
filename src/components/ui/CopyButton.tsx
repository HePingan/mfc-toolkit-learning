import { useEffect, useState } from 'react';
import { Button } from './Button';

type CopyButtonProps = {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
};

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export function CopyButton({
  text,
  label = '复制结果',
  copiedLabel = '已复制',
  className = 'button-ghost',
}: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    if (status === 'idle') return undefined;
    const timer = window.setTimeout(() => setStatus('idle'), 1600);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <Button
      className={className}
      type="button"
      onClick={async () => {
        try {
          await copyText(text);
          setStatus('copied');
        } catch {
          setStatus('failed');
        }
      }}
      aria-label={status === 'copied' ? copiedLabel : label}
    >
      {status === 'copied' ? copiedLabel : status === 'failed' ? '复制失败' : label}
    </Button>
  );
}
