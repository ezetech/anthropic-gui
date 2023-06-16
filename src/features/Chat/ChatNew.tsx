import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { submitPrompt } from '@/api/prompt.api';
import {
  selectApiKey,
  selectApiMaxTokens,
  selectApiModel,
  selectApiTemperature,
  selectApiTopK,
  selectApiTopP,
} from '@/redux/apiSettings/apiSettings.selectors';
import { useAppSelector } from '@/redux/hooks';
import { selectThemeMode } from '@/redux/theme/theme.selectors';
import { ButtonComponent } from '@/ui/ButtonComponent';
import { IconComponent } from '@/ui/IconComponent';

import styles from './Chat.module.scss';

interface ChatPrompt {
  type: 'human' | 'assistant';
  text: string;
}

type ExtendedChatPrompt = ChatPrompt & { key: string };

export const ChatNew: React.FC = () => {
  const [prompts, setPrompts] = useState<ExtendedChatPrompt[]>([
    { type: 'human', text: '', key: uuidv4() },
  ]);
  const [focusPrompt, setFocusPrompt] = useState<
    (EventTarget & HTMLDivElement) | null
  >(null);
  const [promptsContext, setPromptsContext] = useState<string>('');
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [isVisibleBg, setIsVisibleBg] = useState<boolean>(true);
  const [activePromptIndex, setActivePromptIndex] = useState<number>(0);
  const apiKey = useSelector(selectApiKey);
  const model = useSelector(selectApiModel);
  const temperature = useSelector(selectApiTemperature);
  const maxTokens = useSelector(selectApiMaxTokens);
  const topK = useSelector(selectApiTopK);
  const topP = useSelector(selectApiTopP);
  const theme = useAppSelector(selectThemeMode);

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
        key: uuidv4(),
      };
      setFocusPrompt(null);
      setPrompts(prevPrompt => [...prevPrompt, newPrompt]);
      setIsVisibleBg(false);
    };

  const deletePromptRow = (key: string) => {
    const index = prompts.findIndex(prompt => prompt.key === key);
    if (index !== -1) {
      const newPrompts = [...prompts];
      newPrompts.splice(index, 1);
      setFocusPrompt(null);
      setPrompts(newPrompts);
    }
  };

  const updatePromptByKey = (key: string, text: string) => {
    setPrompts(prevPrompts => {
      const newPrompts = prevPrompts.map(obj => {
        if (obj.key === key) {
          return { ...obj, text };
        }
        return obj;
      });
      return newPrompts;
    });
  };

  const escapeHtml = (unsafe: string) =>
    unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const generateResponse = async (
    key: string | null | undefined,
    text: string | null | undefined,
  ) => {
    const newAbortController = new AbortController();
    const signal = newAbortController.signal;
    setAbortController(newAbortController);

    const requestBody = {
      model,
      temperature,
      topK,
      topP,
      apiKey,
      maxTokens,
      prompt: text
        ? promptsContext +
          `\n\n${'human'}: ${text
            .trim()
            .replace(/<br>/g, '\n')
            .replace(/<div>/g, '\n')
            .replace(/<\/div>/g, '')}`
        : promptsContext,
      signal,
    };

    try {
      const response = await submitPrompt(requestBody);
      if (response?.ok) {
        const reader = response?.body?.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
          const res = await reader?.read();
          if (res?.done) break;
          let lastLine: any = '';
          const lastLineData = decoder.decode(res?.value);
          if (lastLine.indexOf('\n') != -1) {
            lastLine = lastLineData.split('\n').pop();
          } else {
            lastLine = lastLineData;
          }

          if (
            lastLine.startsWith('data:') &&
            lastLine.indexOf('[DONE]') == -1
          ) {
            try {
              const eventData = JSON.parse(lastLine.slice(5));
              if (eventData.completion) {
                const sanitizedCompletion = escapeHtml(
                  eventData.completion,
                ).replace(/\t/g, '    ');
                if (key) {
                  updatePromptByKey(
                    key,
                    sanitizedCompletion
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/\n/g, '<br>')
                      .replace(/  /g, '&nbsp; '),
                  );
                } else {
                  setPrompts([
                    ...prompts,
                    {
                      type: 'assistant',
                      text: sanitizedCompletion
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/\n/g, '<br>')
                        .replace(/  /g, '&nbsp; '),
                      key: uuidv4(),
                    },
                  ]);
                }
              } else if (eventData.error) {
                alert('Error: ' + eventData.error.message);
              }
            } catch {}
          }
        }
        if (!key) {
          addPromptRow('human');
        }
      } else {
        console.error('Error: ' + response?.statusText);
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const handleRegenerate = async () => {
    setIsVisibleBg(false);
    if (focusPrompt) {
      let key = null;
      const lastAssistant = prompts?.filter(item => item.type === 'assistant');
      if (lastAssistant?.length > 0) {
        key = lastAssistant[lastAssistant?.length - 1].key;
      }
      const text = focusPrompt?.innerHTML;
      if (text) {
        setFocusPrompt(null);
        await generateResponse(key, text);
      }
    }
  };

  const handlePromptSubmit = async () => {
    setIsVisibleBg(false);
    await generateResponse(null, null);
  };

  const handlePromptFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const key = target.dataset?.key;
    if (key) {
      const index = prompts.findIndex(prompt => prompt.key === key);
      setActivePromptIndex(index);
    }
    setFocusPrompt(target);
  };

  const handlePromptBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const key = target.dataset?.key;
    const text = target.innerHTML;
    if (key) {
      updatePromptByKey(key, text);
    }
  };

  const stopStream = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  };

  useEffect(() => {
    const promptTexts = prompts?.map(prompt => {
      const type = prompt.type;
      const text = prompt.text
        ?.trim()
        .replace(/<br>/g, '\n')
        .replace(/<div>/g, '\n')
        .replace(/<\/div>/g, '');

      return `\n\n${type}: ${text}`;
    });
    setPromptsContext(promptTexts.join(''));
  }, [prompts]);

  return (
    <div className={styles.chatGeneralContainer}>
      {prompts.map(({ text, type, key }, index) => (
        <div className={styles.chatPromptContainer} key={key}>
          {type === 'human' ? (
            <div>
              <IconComponent type="human" />
            </div>
          ) : (
            <div>
              <IconComponent type="ai" />
            </div>
          )}
          <div className={styles.promptContainer}>
            <div className={styles.promptContainerHeader}>
              {type === 'human' ? (
                <div className={styles.placeholderText}>You</div>
              ) : (
                <div className={styles.placeholderText}>AI</div>
              )}
              <div
                className={styles.iconDelete}
                onClick={() => deletePromptRow(key)}
              >
                <IconComponent type="remove" />
              </div>
            </div>
            <div
              data-key={key}
              contentEditable
              className={`${styles.promptText} ${
                activePromptIndex === index ? styles.activePrompt : ''
              }`}
              onFocus={handlePromptFocus}
              onBlur={handlePromptBlur}
              dangerouslySetInnerHTML={{
                __html: text,
              }}
            ></div>
          </div>
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
        <div className={styles.buttonAddContainer}>
          <ButtonComponent
            className={styles.buttonAddChat}
            onClick={addPromptRow()}
          >
            <IconComponent type="plus" className={styles.iconPlus} />
          </ButtonComponent>
        </div>
        <div className={styles.chatActionsButtonsContainer}>
          <ButtonComponent
            type="submit"
            variant="contained"
            className={styles.buttonSubmitChat}
            onClick={handlePromptSubmit}
          >
            <span className={styles.submitText}>Submit</span>
            <IconComponent type="submit" />
          </ButtonComponent>
          <ButtonComponent
            variant="contained"
            className={styles.buttonStopChat}
            onClick={stopStream}
          >
            <span className={styles.stopText}>Stop</span>
          </ButtonComponent>
          <ButtonComponent
            type="submit"
            variant="outlined"
            className={styles.buttonRegenerateChat}
            onClick={handleRegenerate}
          >
            <span className={styles.regenerateText}>Regenerate</span>
            <IconComponent
              className={styles.iconRegenerate}
              type="regenerate"
            />
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};
