type NodeType =
  | {
      children?: NodeType[];
      type?: string;
      text?: string;
    }
  | string
  | null;

const isSiblingText = (children: NodeType[]): boolean =>
  children.some(
    child => typeof child === 'object' && child !== null && 'text' in child,
  );

export const transformHtmlToText = (
  node: NodeType | NodeType[],
): NodeType[] => {
  if (Array.isArray(node)) {
    return node.flatMap(transformHtmlToText);
  } else if (typeof node === 'object' && node !== null) {
    if ('children' in node && node.children) {
      const newChildren: NodeType[] = [];
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (
          typeof child === 'object' &&
          child &&
          child.type === 'html' &&
          isSiblingText(node.children)
        ) {
          if (
            child &&
            child.children?.[0] &&
            typeof child.children[0] === 'object'
          ) {
            newChildren.push({ text: child.children?.[0].text });
          }
        } else {
          newChildren.push(...transformHtmlToText(child));
        }
      }
      return [
        {
          ...node,
          children: newChildren,
        },
      ];
    }
    return [node];
  } else {
    return [node];
  }
};
