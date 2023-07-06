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

function isTextObject(node: NodeType): node is { text?: string } {
  return typeof node === 'object' && node !== null && 'text' in node;
}

export const transformResultParse = (
  node: NodeType | NodeType[],
): NodeType[] => {
  if (Array.isArray(node)) {
    return node.flatMap(transformResultParse);
  } else if (typeof node === 'object' && node !== null) {
    if ('children' in node && node.children) {
      const newChildren: NodeType[] = [];

      if (
        'children' in node &&
        Array.isArray(node.children) &&
        node.children.length === 0
      ) {
        return [];
      }
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
        } else if (
          typeof child === 'object' &&
          child &&
          child.type === 'break'
        ) {
          const prevIndex = newChildren.length - 1;
          if (
            prevIndex >= 0 &&
            newChildren[prevIndex] &&
            isTextObject(newChildren[prevIndex])
          ) {
            const elem = newChildren[prevIndex] as { text: string };
            elem.text = (elem.text || '') + '\n';
          }
        } else {
          newChildren.push(...transformResultParse(child));
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
