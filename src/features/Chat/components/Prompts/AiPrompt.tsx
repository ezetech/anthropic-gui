import { FocusEvent, useState } from 'react';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { IconComponent } from '@/ui/IconComponent';

import { EditablePrompt } from './EditablePrompt';

import styles from './Prompts.module.scss';

interface AiPromptProps {
  deletePromptRow: (id: string) => () => void;
  id: string;
  text: string;
  handlePromptBlur: (
    id: string,
  ) => (event: FocusEvent<HTMLTextAreaElement>) => void;
  type: 'human' | 'assistant';
}

export const AiPrompt = ({
  deletePromptRow,
  text,
  id,
  handlePromptBlur,
  type,
}: AiPromptProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const onPromptClick = () => {
    setIsEditing(true);
  };

  const onCloseEditing = () => {
    setIsEditing(false);
  };

  return isEditing ? (
    <EditablePrompt
      deletePromptRow={deletePromptRow}
      closeEditing={onCloseEditing}
      id={id}
      type={type}
      handlePromptBlur={handlePromptBlur}
      text={text}
    />
  ) : (
    <div className={styles.promptContainer} onClick={onPromptClick}>
      <div>
        <IconComponent type="ai" />
      </div>
      <div className={styles.promptAiField}>
        <div className={styles.promptContainerHeader}>
          <div className={styles.placeholderText}>AI</div>
          <div onClick={deletePromptRow(id)}>
            <IconComponent type="deleteIcon" className={styles.iconDelete} />
          </div>
        </div>
        <ReactMarkdown
          className={styles.markdown}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  {...props}
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code {...props} className={className}>
                  {children}
                </code>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
};