export const escapeHtml = (unsafe: string) =>
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const unEscapeHtml = (safe: string) =>
  safe
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");

interface TextFragment {
  type: 'text';
  content: string;
}

interface CodeFragment {
  type: 'code';
  lang: string;
  content: string;
}

type Fragment = TextFragment | CodeFragment;

export const splitTextAndCode = (inputText: string): Fragment[] => {
  const regex = /(```(\S*?)[\s\S]*?```)/g;

  let match;
  let lastIndex = 0;
  const fragments: Fragment[] = [];

  while ((match = regex.exec(inputText)) !== null) {
    if (lastIndex !== match.index) {
      fragments.push({
        type: 'text',
        content: inputText.slice(lastIndex, match.index).trim(),
      });
    }

    fragments.push({
      type: 'code',
      lang: match[2],
      content: match[0].slice(3 + match[2].length, -3).trim(),
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex !== inputText.length) {
    fragments.push({
      type: 'text',
      content: inputText.slice(lastIndex).trim(),
    });
  }

  return fragments;
};
