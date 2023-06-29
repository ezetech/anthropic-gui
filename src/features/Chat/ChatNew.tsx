import React, { useContext, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

import { NavigationContext } from '@/app/App';
import { ROUTES } from '@/app/router/constants/routes';
import { saveChat } from '@/redux/conversations/conversationsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectThemeMode } from '@/redux/theme/theme.selectors';
import { PromptType } from '@/typings/common';
import { ButtonComponent } from '@/ui/ButtonComponent';
import { IconComponent } from '@/ui/IconComponent';

import { EditablePrompt } from './components/EditablePrompt';

import styles from './Chat.module.scss';

interface ChatPrompt {
  type: PromptType;
  text: string;
}

if (typeof window !== 'undefined') {
  injectStyle();
}

type ExtendedChatPrompt = ChatPrompt & { id: string };

export const ChatNew: React.FC = () => {
  const [prompts, setPrompts] = useState<ExtendedChatPrompt[]>([
    { type: 'Human', text: '', id: uuidv4() },
  ]);
  useState<AbortController | null>(null);
  const { setDidNewChatNavigate } = useContext(NavigationContext);
  const theme = useAppSelector(selectThemeMode);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const addPromptRow =
    (promptType = '') =>
    () => {
      const newPromptType =
        promptType ||
        (prompts[prompts?.length - 1]?.type === 'Human'
          ? 'Assistant'
          : 'Human');

      const newPrompt: ExtendedChatPrompt = {
        type: newPromptType as 'Human' | 'Assistant',
        text: '',
        id: uuidv4(),
      };

      setPrompts(prevPrompt => [...prevPrompt, newPrompt]);
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
    if (!prompts.some(prompt => prompt.text)) {
      toast.dark(
        <div className={styles.toasterDiv}>
          <span className={styles.toasterSpan}>Add content please</span>
          <IconComponent type="heart" className={styles.iconHeart} />
        </div>,
      );

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

  const handlePromptBlur = (id: string, text: string) => {
    updatePromptByKey(id, text);
  };

  return (
    <div className={styles.chatMainContainer}>
      <div className={styles.chatGeneralContainer}>
        {prompts.map(({ text, type, id }) => (
          <div className={styles.chatPromptContainer} key={id}>
            <EditablePrompt
              id={id}
              text={text}
              deletePromptRow={deletePromptRow}
              type={type}
              handlePromptBlur={handlePromptBlur}
            />
          </div>
        ))}
        <div className={styles.chatBgContainer}>
          <div className={styles.titleAiContainer}>
            {theme === 'dark' ? (
              <IconComponent
                type="backgroundChatDark"
                className={styles.bgImg}
              />
            ) : (
              <IconComponent
                type="backgroundChatLight"
                className={styles.bgImg}
              />
            )}
          </div>
          <div className={styles.titleAiContainer}>
            {theme === 'dark' ? (
              <IconComponent type="logoDark" className={styles.iconTitle} />
            ) : (
              <IconComponent type="logoLight" className={styles.iconTitle} />
            )}
          </div>
        </div>
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
      <ToastContainer
        style={{
          width: '100%',
          position: 'absolute',
        }}
        position="bottom-center"
      />
    </div>
  );
};
