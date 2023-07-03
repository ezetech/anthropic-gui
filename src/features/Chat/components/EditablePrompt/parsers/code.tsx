import { memo } from 'react';

import { languages as PrismLanguages, tokenize } from 'prismjs';
import { languages } from 'prismjs/components';
import { BaseEditor, Text } from 'slate';
import { RenderLeafProps } from 'slate-react';

import { CustomRange, PrismToken, CustomText } from '../typings';

import styles from '../Prompts.module.scss';

export const pushString = (
  token: string,
  path: number[],
  start: number,
  ranges: CustomRange[],
  tokenType = 'text',
): number => {
  ranges.push({
    prismToken: tokenType,
    anchor: { path, offset: start },
    focus: { path, offset: start + token.length },
  });
  start += token.length;
  return start;
};

export const recurseTokenize = (
  token: PrismToken,
  path: number[],
  ranges: CustomRange[],
  start: number,
  parentTag?: string,
): number | undefined => {
  if (typeof token === 'string') {
    return pushString(token, path, start, ranges, parentTag);
  }
  if ('content' in token) {
    for (const subToken of token.content) {
      start = recurseTokenize(subToken, path, ranges, start, token.type) ?? 0;
    }
    return start;
  }
};

export const decorateCodeFunc = (
  _: BaseEditor,
  [node, path]: [CustomText, number[]],
  lang: string,
): CustomRange[] => {
  const ranges: CustomRange[] = [];
  console.log(node);

  if (!Text.isText(node) || !node || !node.text) {
    return ranges;
  }

  let language = lang ?? 'clike';

  const lang_aliases: Record<string, string> = {
    html: 'markup',
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
  };

  if (language in lang_aliases) {
    language = lang_aliases[language];
  }

  if (!(language in languages)) {
    return ranges;
  }

  if (language === 'cpp') {
    require('prismjs/components/prism-c');
  }

  require(`prismjs/components/prism-${language}`);

  const tokens: PrismToken[] = tokenize(
    node.text,
    PrismLanguages[language],
  ) as PrismToken[];

  let start = 0;
  for (const token of tokens) {
    start = recurseTokenize(token, path, ranges, start) ?? 0;
  }
  return ranges;
};

export const CodeLeaf = memo(
  ({ attributes, children, leaf }: RenderLeafProps) => {
    const customLeaf = leaf as CustomText;

    if (customLeaf.inlineCode) {
      return (
        <strong {...attributes} className={styles.inlineCode}>
          {children}
        </strong>
      );
    }

    if (customLeaf.prismToken) {
      return (
        <span
          {...attributes}
          className={`token ${(leaf as CustomText).prismToken}`}
        >
          {children}
        </span>
      );
    }

    return <span {...attributes}>{children}</span>;
  },
);

CodeLeaf.displayName = 'CodeLeaf';