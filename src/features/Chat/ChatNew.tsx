import React, { useState, useContext } from 'react';

import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { NavigationContext } from '@/app/App';
import { ROUTES } from '@/app/router/constants/routes';
import { saveChat } from '@/redux/conversations/conversationsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectThemeMode } from '@/redux/theme/theme.selectors';
import { ButtonComponent } from '@/ui/ButtonComponent';
import { IconComponent } from '@/ui/IconComponent';

import { AiPrompt, EditablePrompt } from './components/Prompts';

import styles from './Chat.module.scss';

interface ChatPrompt {
  type: 'human' | 'assistant';
  text: string;
}

type ExtendedChatPrompt = ChatPrompt & { id: string };

export const ChatNew: React.FC = () => {
  const [prompts, setPrompts] = useState<ExtendedChatPrompt[]>([
    { type: 'human', text: '', id: uuidv4() },
  ]);

  useState<AbortController | null>(null);
  const [isVisibleBg, setIsVisibleBg] = useState<boolean>(true);
  const { setDidNewChatNavigate } = useContext(NavigationContext);

  const theme = useAppSelector(selectThemeMode);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const addPromptRow =
    (promptType = '') =>
    () => {
      const newPromptType =
        promptType ||
        (prompts[prompts?.length - 1]?.type === 'human'
          ? 'assistant'
          : 'human');

      const newPrompt: ExtendedChatPrompt = {
        type: newPromptType as 'human' | 'assistant',
        text: '',
        id: uuidv4(),
      };

      setPrompts(prevPrompt => [...prevPrompt, newPrompt]);
      setIsVisibleBg(false);
    };

  const deletePromptRow = (id: string) => () => {
    if (prompts.length === 1) {
      return;
    }
    const index = prompts.findIndex(prompt => prompt.id === id);
    if (index !== -1) {
      const newPrompts = [...prompts];
      newPrompts.splice(index, 1);
      setPrompts(newPrompts);
    }
  };

  const updatePromptByKey = (id: string, text: string) => {
    setPrompts(prevPrompts => {
      const newPrompts = prevPrompts.map(obj => {
        if (obj.id === id) {
          return { ...obj, text };
        }
        return obj;
      });
      return newPrompts;
    });
  };

  const handlePromptSubmit = async () => {
    // TODO show error if no content
    if (!prompts.some(prompt => prompt.text)) {
      return;
    }

    const newChat = {
      id: uuidv4(),
      name: 'New Chat',
      content: prompts,
    };

    dispatch(saveChat(newChat));
    setDidNewChatNavigate(true);
    navigate(`${ROUTES.Chat}/${newChat.id}`);
  };

  const handlePromptBlur =
    (id: string) => (event: React.FocusEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;
      updatePromptByKey(id, value);
    };

  return (
    <div className={styles.chatGeneralContainer}>
      {prompts.map(({ text, type, id }) => (
        <div className={styles.chatPromptContainer} key={id}>
          {type === 'human' ? (
            <EditablePrompt
              id={id}
              deletePromptRow={deletePromptRow}
              handlePromptBlur={handlePromptBlur}
              type={type}
              text={text}
            />
          ) : (
            <AiPrompt
              id={id}
              text={text}
              deletePromptRow={deletePromptRow}
              handlePromptBlur={handlePromptBlur}
              type={type}
            />
          )}
        </div>
      ))}
      {isVisibleBg && (
        <div className={styles.chatBgContainer}>
          <div className={styles.titleAiContainer}>
            <IconComponent
              type="backgroundDefaultChat"
              className={styles.bgImg}
            />
          </div>
          <div className={styles.titleAiContainer}>
            {theme === 'dark' ? (
              <IconComponent type="logoDark" className={styles.iconTitle} />
            ) : (
              <IconComponent type="logoLight" className={styles.iconTitle} />
            )}
          </div>
        </div>
      )}
      <div className={styles.chatButtonsContainer}>
        <div className={styles.buttonsColumn}>
          <button onClick={addPromptRow()} className={styles.buttonAddChat}>
            <IconComponent type="plus" className={styles.iconPlus} />
          </button>
          <ButtonComponent
            type="submit"
            variant="contained"
            onClick={handlePromptSubmit}
          >
            <span>Submit</span>
            <IconComponent type="submit" />
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};
