import { memo, useCallback, useEffect, useMemo, useRef } from 'react';

import classNames from 'classnames';
import 'prismjs/themes/prism-funky.min.css';
import markdown from 'remark-parse';
import { remarkToSlate } from 'remark-slate-transformer';
import {
  Descendant,
  Editor,
  Node,
  Path,
  Point,
  Range,
  Text,
  Transforms,
  createEditor,
} from 'slate';
import { withHistory } from 'slate-history';
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from 'slate-react';
import { unified } from 'unified';

import { IconComponent } from '@/ui/IconComponent';

import { CodeLeaf, decorateCodeFunc } from './parsers/code';
import { transformHtmlToText } from './parsers/html';
import { serialize } from './parsers/slate2md';
import { CustomElement, CustomRange, IEditablePrompt } from './typings';

import styles from './Prompts.module.scss';

export const EditablePrompt = memo(
  ({
    text = '',
    deletePromptRow,
    id,
    type,
    handlePromptBlur,
    readOnly,
    deleteDisabled,
  }: IEditablePrompt) => {
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    const valueRef = useRef<Descendant[]>([
      {
        type: 'paragraph',
        children: [{ text: '' }],
      } as CustomElement,
    ]);

    useEffect(() => {
      console.log(valueRef.current);
    }, [valueRef.current]);

    const onCopyClick = (textToCopy: string) => (event: React.MouseEvent) => {
      event.stopPropagation();
      navigator.clipboard.writeText(textToCopy);
    };

    const renderLeaf = useCallback(
      (props: RenderLeafProps) => <CodeLeaf {...props} />,
      [],
    );

    const decorate = useCallback(
      ([node, path]: [Node, number[]]) => {
        const customNode = node as CustomElement;
        if (customNode.type === 'code' && customNode.lang) {
          let allRanges: CustomRange[] = [];
          for (const [child, childPath] of Node.children(editor, path)) {
            if (Text.isText(child)) {
              allRanges = allRanges.concat(
                decorateCodeFunc(editor, [child, childPath], customNode.lang),
              );
            }
          }
          return allRanges;
        }
        return [];
      },
      [editor],
    );

    const renderElement = useCallback((props: RenderElementProps) => {
      const { element, children, attributes } = props;

      const customElement = element as CustomElement;

      switch (customElement.type) {
        case 'code':
          const language = customElement.lang;

          if (!language || language === 'null') {
            return <p {...attributes}>{children}</p>;
          }

          return (
            <div className={styles.codeWrapper}>
              <div className={styles.codeHeader} contentEditable={false}>
                <span>{language}</span>
                <IconComponent
                  type="copy"
                  onClick={onCopyClick(
                    element.children
                      .map(child => (child as { text: string }).text)
                      .join('\n'),
                  )}
                  className={styles.copyIcon}
                />
              </div>
              <pre {...attributes}>
                <code>{children}</code>
              </pre>
            </div>
          );
        case 'blockQuote':
          return <blockquote {...attributes}>{children}</blockquote>;
        case 'headingOne':
          return <h1 {...attributes}>{children}</h1>;
        case 'headingTwo':
          return <h2 {...attributes}>{children}</h2>;
        case 'headingThree':
          return <h3 {...attributes}>{children}</h3>;
        case 'headingFour':
          return <h4 {...attributes}>{children}</h4>;
        case 'headingFive':
          return <h5 {...attributes}>{children}</h5>;
        case 'headingSix':
          return <h6 {...attributes}>{children}</h6>;
        case 'listItem':
          return <li {...attributes}>{children}</li>;
        case 'list':
          return customElement.ordered ? (
            <ol start={customElement.start} {...attributes}>
              {children}
            </ol>
          ) : (
            <ul {...attributes}>{children}</ul>
          );
        case 'html':
          return <div {...attributes}>{children}</div>;
        case 'link':
          return (
            <a
              {...attributes}
              href={customElement.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        default:
          return <p {...attributes}>{children}</p>;
      }
    }, []);

    useEffect(() => {
      const processor = unified().use(markdown).use(remarkToSlate);

      const result = processor.processSync(text).result;

      const transformedResult = transformHtmlToText(result).flat();

      if (transformedResult.length) {
        Transforms.delete(editor, {
          at: {
            anchor: Editor.start(editor, []),
            focus: Editor.end(editor, []),
          },
        });

        Transforms.removeNodes(editor, {
          at: [0],
        });

        Transforms.insertNodes(editor, transformedResult as Descendant[]);
      }
    }, [text, editor]);

    const onBlur = useCallback(() => {
      if (valueRef.current === null) {
        return;
      }

      const markdownText = serialize(valueRef.current);

      handlePromptBlur(id, markdownText);
    }, [handlePromptBlur, id]);

    useEffect(
      () => () => {
        if (valueRef.current) {
          const markdownText = serialize(valueRef.current);
          handlePromptBlur(id, markdownText);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    const onChange = (newValue: Descendant[]) => {
      valueRef.current = newValue;
    };

    const CustomEditor = useMemo(
      () => ({
        isCodeBlock: (editorArg: Editor) => {
          const [match] = Editor.nodes(editorArg, {
            match: (n: Node) => 'type' in n && n.type === 'code',
          });
          return !!match;
        },
        isListItem: (editorArg: Editor) => {
          const [match] = Editor.nodes(editorArg, {
            match: (n: Node) => 'type' in n && n.type === 'listItem',
          });
          return !!match;
        },
      }),
      [],
    );

    const onKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Tab' && CustomEditor.isCodeBlock(editor)) {
          event.preventDefault();
          Transforms.insertText(editor, '  ');
          return;
        }
        if (event.key === 'Backspace' || event.key === 'Delete') {
          const { selection } = editor;
          if (selection && Range.isCollapsed(selection)) {
            const [match] = Editor.nodes(editor, {
              match: (n: Node) => 'type' in n && n.type === 'code',
            });
            if (match) {
              const [node, path] = match;
              const start = Editor.start(editor, path);
              const isAtStart = Point.equals(selection.anchor, start);

              const nodeText = Node.string(node);

              if (nodeText.length === 0 && isAtStart) {
                event.preventDefault();
                Transforms.setNodes(
                  editor,
                  { type: 'paragraph', children: [{ text: '' }] },
                  { at: path },
                );
                return;
              }
            }
          }
        }
        if (event.key === 'Enter') {
          if (CustomEditor.isCodeBlock(editor)) {
            event.preventDefault();
            if (event.shiftKey === false) {
              Transforms.insertText(editor, '\n');
              return;
            }

            if (editor.selection) {
              Transforms.insertNodes(editor, {
                type: 'paragraph',
                children: [{ text: '' }],
              } as CustomElement);

              const point = Editor.end(editor, editor.selection.focus.path);
              const newPath = [
                ...point.path.slice(0, -1),
                point.path[point.path.length - 1] + 1,
              ];

              if (Editor.hasPath(editor, newPath)) {
                Transforms.select(editor, Editor.start(editor, newPath));
              }
            }

            return;
          }

          if (CustomEditor.isListItem(editor) && editor.selection) {
            event.preventDefault();

            if (event.shiftKey === false) {
              const [, currentListItemPath] = Editor.node(
                editor,
                editor.selection.focus.path,
              );

              const [, parentParagraphPath] = Editor.parent(
                editor,
                currentListItemPath,
              );
              const [, parentListPath] = Editor.parent(
                editor,
                parentParagraphPath,
              );

              const newPath = Path.next(parentListPath);

              const newItem = {
                type: 'listItem',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ text: '' }],
                  } as CustomElement,
                ],
              } as CustomElement;

              Transforms.insertNodes(editor, newItem, { at: newPath });
              Transforms.select(editor, Editor.start(editor, newPath));

              return;
            }

            if (event.shiftKey === true) {
              event.preventDefault();

              const [, currentListItemPath] = Editor.node(
                editor,
                editor.selection.focus.path,
              );

              const [, parentParagraphPath] = Editor.parent(
                editor,
                currentListItemPath,
              );

              const [, parentListPath] = Editor.parent(
                editor,
                parentParagraphPath,
              );

              const [, grandParentListPath] = Editor.parent(
                editor,
                parentListPath,
              );

              const newPath = Path.next(
                grandParentListPath.length
                  ? grandParentListPath
                  : parentListPath,
              );

              const paragraph = { type: 'paragraph', children: [{ text: '' }] };

              Transforms.insertNodes(editor, paragraph, { at: newPath });

              Transforms.select(editor, Editor.start(editor, newPath));

              return;
            }
          }
          const { selection } = editor;

          if (selection && !Range.isCollapsed(selection)) return;

          const [match] = Editor.nodes(editor, {
            match: n => (n as CustomElement).type === 'paragraph',
          });

          if (!match) return;

          const [, path] = match;

          const prevText = Node.string(match[0]);
          const codeRegex = /^```(\w+)?$/;

          const codeMatch = prevText.match(codeRegex);

          if (codeMatch) {
            Transforms.insertNodes(
              editor,
              {
                type: 'code',
                lang: codeMatch[1] || 'clike',
                children: [{ text: '' }],
              } as CustomElement,
              { at: path },
            );

            const codeBlockPath = path
              .slice(0, path.length - 1)
              .concat(path[path.length - 1] + 1);
            Transforms.select(editor, Editor.end(editor, codeBlockPath));

            event.preventDefault();

            const nextPath = Path.next(path);

            if (Editor.hasPath(editor, nextPath)) {
              Transforms.delete(editor, { at: nextPath });
            }
            return;
          }
        }
      },
      [editor, CustomEditor],
    );

    const handlePaste = useCallback(
      (event: React.ClipboardEvent<HTMLDivElement>) => {
        if (CustomEditor.isCodeBlock(editor)) {
          event.preventDefault();
          const pastedText = event.clipboardData.getData('text/plain');
          const lines = pastedText.split('\n');

          Transforms.insertText(editor, lines[0]);

          for (let i = 1; i < lines.length; i++) {
            Transforms.insertText(editor, '\n' + lines[i]);
          }
        }
      },
      [editor, CustomEditor],
    );

    return (
      <div className={styles.promptContainer}>
        {type === 'Human' ? (
          <div>
            <IconComponent type="human" />
          </div>
        ) : (
          <div>
            <IconComponent type="ai" />
          </div>
        )}
        <div className={styles.fieldContainer}>
          <div className={styles.promptContainerHeader}>
            {type === 'Human' ? (
              <div className={styles.placeholderText}>You</div>
            ) : (
              <div className={styles.placeholderText}>AI</div>
            )}
            <div
              className={classNames(styles.iconDelete, {
                [styles.iconDeleteDisabled]: readOnly || deleteDisabled,
              })}
              onClick={
                readOnly || deleteDisabled ? undefined : deletePromptRow(id)
              }
            >
              <IconComponent type="deleteIcon" />
            </div>
          </div>
          {valueRef.current ? (
            <Slate
              editor={editor}
              initialValue={valueRef.current}
              onChange={onChange}
            >
              <Editable
                spellCheck={false}
                renderElement={renderElement}
                className={styles.promptField}
                onBlur={onBlur}
                renderLeaf={renderLeaf}
                decorate={decorate}
                onKeyDown={onKeyDown}
                readOnly={readOnly}
                onPaste={handlePaste}
              />
            </Slate>
          ) : null}
        </div>
      </div>
    );
  },
);

EditablePrompt.displayName = 'EditablePrompt';
