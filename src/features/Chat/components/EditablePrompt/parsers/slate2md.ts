import { Element, Node, Text } from 'slate';

import { CustomElement, CustomText } from '../typings';

const isCustomText = (node: Node): node is CustomText => Text.isText(node);

const isCustomElement = (node: Node): node is CustomElement =>
  Element.isElement(node);

const serializeEach = (
  node: Node | CustomText | CustomElement,
  parentStart = 1,
  insideOrderedList = false,
): string => {
  if (isCustomText(node)) {
    const escaped = node.text;
    if (node.bold) return `**${escaped}**`;
    if (node.italic) return `*${escaped}*`;
    if (node.strikethrough) return `**${escaped}**`;
    if (node.deleted) return `~~${escaped}~~`;
    if (node.inserted) return `__${escaped}__`;
    if (node.underline) return `__${escaped}__`;
    if (node.inlineCode) return `\`${escaped}\``;
    return escaped;
  }

  if (isCustomElement(node)) {
    const children = node.children
      .map(n => serializeEach(n, parentStart))
      .join('');

    switch (node.type) {
      case 'link':
        return `\n${children}\n`;
      case 'blockQuote':
        return `> ${children}\n`;
      case 'list':
        if (node.ordered) {
          const startNumber = node.start || 1;
          return (
            node.children
              .map(
                (n, i) =>
                  `${startNumber + i}. ${serializeEach(n, startNumber, true)}`,
              )
              .join('\n') + '\n'
          );
        } else {
          return children;
        }
      case 'listItem':
        if (insideOrderedList) {
          return `${children.trim()}\n`;
        } else {
          return `* ${children.trim()}\n`;
        }
      case 'headingOne':
        return `# ${children}\n`;
      case 'headingTwo':
        return `## ${children}\n`;
      case 'headingThree':
        return `### ${children}\n`;
      case 'headingFour':
        return `#### ${children}\n`;
      case 'headingFive':
        return `##### ${children}\n`;
      case 'headingSix':
        return `###### ${children}\n`;
      case 'horizontalRule':
        return `---`;
      case 'code':
        const code = node.children
          .map(n => (isCustomText(n) ? n.text : ''))
          .join('\n');
        return `\n\`\`\`${node.lang}\n${code}\n\`\`\`\n`;
      case 'image':
        const title = node?.type;
        const src = node?.url;
        const alt = 'alt default';
        return `![${title}](${src} "${alt}")`;
      case 'paragraph':
        return `\n${children}\n`;
      case 'html':
        return `\n${children}\n`;
      default:
        return children;
    }
  }

  return '';
};

export const serialize = (data: (Node | CustomText | CustomElement)[] = []) =>
  data.map(node => serializeEach(node)).join('');
