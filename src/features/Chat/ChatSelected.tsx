import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { submitPrompt } from '@/api/prompt.api';
import { NavigationContext } from '@/app/App';
import { ROUTES } from '@/app/router/constants/routes';
import {
  selectApiKey,
  selectApiMaxTokens,
  selectApiModel,
  selectApiTemperature,
  selectApiTopK,
  selectApiTopP,
} from '@/redux/apiSettings/apiSettings.selectors';
import { selectChatById } from '@/redux/conversations/conversations.selectors';
import {
  addPromptToChat,
  updateChatContents,
  updateContentById,
  renameChatTreeItem,
} from '@/redux/conversations/conversationsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Chat, ChatContent } from '@/typings/common';
import { ButtonComponent } from '@/ui/ButtonComponent';
import { IconComponent } from '@/ui/IconComponent';
import { TextFieldComponent } from '@/ui/TextFieldComponent';

import { EditablePrompt } from './components/EditablePrompt';

import styles from './Chat.module.scss';

const findLastAssistantContent = (chat?: Chat): ChatContent | null => {
  if (!chat || !chat?.content) {
    return null;
  }

  for (let i = chat.content.length - 1; i >= 0; i--) {
    const content = chat.content[i];
    if (content.type === 'Assistant' && content.text.replace(/\n/g, '')) {
      return content;
    }
  }
  return null;
};

export const ChatSelected: React.FC = () => {
  const { id: chatId = '' } = useParams();

  const chat = useAppSelector(selectChatById(chatId));

  const navigate = useNavigate();

  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const { didNewChatNavigate, setDidNewChatNavigate } =
    useContext(NavigationContext);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [conversationName, setConversationName] = useState(chat?.name ?? '');

  const [updatingAiPromptId, setUpdatingAiPromptId] = useState('');

  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = useSelector(selectApiKey);
  const model = useSelector(selectApiModel);
  const temperature = useSelector(selectApiTemperature);
  const maxTokens = useSelector(selectApiMaxTokens);
  const topK = useSelector(selectApiTopK);
  const topP = useSelector(selectApiTopP);

  const dispatch = useAppDispatch();

  const lastAssistantPrompt = useMemo(
    () => findLastAssistantContent(chat),
    [chat],
  );

  useEffect(() => {
    if (!chat) {
      return navigate(ROUTES.Home);
    }
  }, [chat, navigate]);

  useEffect(() => {
    if (chat?.name) {
      setConversationName(chat.name);
    }
  }, [chatId, chat?.name]);

  const addPromptRow = useCallback(
    (promptType = '') =>
      () => {
        const newPromptType =
          promptType ||
          (chat?.content?.[chat.content.length - 1]?.type === 'Human'
            ? 'Assistant'
            : 'Human');

        const newPrompt: ChatContent = {
          type: newPromptType as 'Human' | 'Assistant',
          text: '',
          id: uuidv4(),
        };

        dispatch(
          addPromptToChat({ chatId: chat?.id || '', content: newPrompt }),
        );
      },
    [chat?.content, chat?.id, dispatch],
  );

  const deletePromptRow = useCallback(
    (id: string) => () => {
      if (chat?.content?.length === 1) {
        return;
      }

      if (chat?.content) {
        const index = chat?.content?.findIndex(prompt => prompt.id === id);

        if (index !== -1) {
          const newPrompts = [...chat.content];
          newPrompts.splice(index, 1);

          dispatch(
            updateChatContents({
              chatId: chat?.id || '',
              contents: newPrompts,
            }),
          );
        }
      }
    },
    [chat?.content, chat?.id, dispatch],
  );

  const generateResponse = useCallback(
    async (isRegenerate?: boolean) => {
      setIsLoading(true);
      const newAbortController = new AbortController();
      const signal = newAbortController.signal;
      setAbortController(newAbortController);

      const chatContent = isRegenerate
        ? chat?.content?.filter(
            content => content.id !== lastAssistantPrompt?.id,
          )
        : chat?.content;

      let promptTexts = (
        chatContent?.map(prompt => {
          const type = prompt.type;
          const promptText = prompt.text;

          return `\n\n${type}: ${promptText}`;
        }) || []
      ).join('');

      if (
        chatContent &&
        chatContent[chatContent?.length - 1].type === 'Human'
      ) {
        promptTexts += '\n\nAssistant:';
      }

      const requestBody = {
        model,
        temperature,
        topK,
        topP,
        apiKey,
        maxTokens,
        prompt: promptTexts,
        signal,
      };

      try {
        const response = await submitPrompt(requestBody);
        if (response?.ok) {
          setIsStreaming(true);
          const reader = response?.body?.getReader();
          const decoder = new TextDecoder('utf-8');

          let newPrompt: ChatContent | undefined;

          if (!isRegenerate) {
            newPrompt = {
              type: 'Assistant',
              text: '',
              id: uuidv4(),
            };
            dispatch(
              addPromptToChat({ chatId: chat?.id || '', content: newPrompt }),
            );
          }

          while (true) {
            const res = await reader?.read();
            console.log(res);

            if (res?.done) {
              setIsStreaming(false);
              break;
            }
            let lastLine: any = '';
            const lastLineData = decoder.decode(res?.value);

            const lastLineArray = lastLineData.split('data: ');

            lastLine = lastLineArray[lastLineArray.length - 1].includes(
              '"exception": null}',
            )
              ? lastLineArray[lastLineArray.length - 1]
              : lastLineArray[lastLineArray.length - 2];

            console.log(lastLine);

            if (lastLine?.startsWith('{"completion":')) {
              try {
                const eventData = JSON.parse(lastLine);

                if (eventData.completion) {
                  if (isRegenerate) {
                    setUpdatingAiPromptId(lastAssistantPrompt?.id || '');
                  } else {
                    setUpdatingAiPromptId(newPrompt?.id || '');
                  }
                  dispatch(
                    updateContentById({
                      chatId: chat?.id ?? '',
                      contentId:
                        (isRegenerate
                          ? lastAssistantPrompt?.id
                          : newPrompt?.id) || '',
                      text: eventData.completion,
                    }),
                  );
                } else if (eventData.error) {
                  alert('Error: ' + eventData.error.message);
                }
              } catch (error) {
                console.log(error);
              }
            }
          }
          if (!isRegenerate) {
            addPromptRow('Human')();
          }
        } else {
          console.error('Error: ' + response?.statusText);
        }
      } catch (error) {
        console.error('error', error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      addPromptRow,
      apiKey,
      chat?.id,
      dispatch,
      maxTokens,
      model,
      temperature,
      topK,
      topP,
      chat?.content,
      lastAssistantPrompt?.id,
    ],
  );

  const handleRegenerate = useCallback(async () => {
    if (lastAssistantPrompt) {
      deletePromptRow(lastAssistantPrompt.id);

      await generateResponse(true);
    }
  }, [generateResponse, deletePromptRow, lastAssistantPrompt]);

  const handlePromptSubmit = useCallback(async () => {
    await generateResponse();
    setHasSubmitted(true);
  }, [generateResponse]);

  useEffect(() => {
    if (didNewChatNavigate && !hasSubmitted) {
      handlePromptSubmit();
      setDidNewChatNavigate(false);
    }
  }, [
    didNewChatNavigate,
    handlePromptSubmit,
    setDidNewChatNavigate,
    hasSubmitted,
  ]);

  const handlePromptBlur = (id: string, text: string) => {
    dispatch(
      updateContentById({
        chatId: chat?.id || '',
        contentId: id,
        text,
      }),
    );
  };

  const stopStream = useCallback(() => {
    setIsStreaming(false);
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  }, [abortController]);

  useEffect(() => {
    stopStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const onSuccessGhangeChatName = useCallback(() => {
    if (conversationName) {
      dispatch(
        renameChatTreeItem({
          chatTreeId: chat?.id || '',
          chatTreeName: conversationName,
        }),
      );
    }
  }, [dispatch, conversationName, chat?.id]);

  const onCancelGhangeChatName = useCallback(() => {
    setConversationName(chat?.name || '');
  }, [setConversationName, chat?.name]);

  const onGhangeConversationName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setConversationName(event.target.value);
    },
    [setConversationName],
  );

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const containerElement = containerRef.current;

    const handleScroll = () => {
      if (!containerElement) return;

      const { scrollTop, scrollHeight, clientHeight } = containerElement;
      const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
      setIsScrolledToBottom(isAtBottom);
    };

    if (containerElement) {
      containerElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (containerElement) {
        containerElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const scrollToBottom = () => {
        container.scrollTop = container.scrollHeight;
      };

      observerRef.current = new MutationObserver(() => {
        if (isScrolledToBottom) {
          scrollToBottom();
        }
      });

      observerRef.current.observe(container, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => observerRef.current?.disconnect();
  }, [isScrolledToBottom]);

  const deleteDisabled = useMemo(
    () => chat?.content?.length === 1,
    [chat?.content],
  );

  return (
    <div className={styles.chatGeneralContainer} ref={containerRef}>
      <Box paddingLeft="60px" display="block" width="100%" mb={4}>
        <TextFieldComponent
          value={conversationName}
          onChange={onGhangeConversationName}
          fullWidth
          InputProps={{
            endAdornment: (
              <div
                className={classNames(styles.confirmationRename, {
                  [styles.edited]: chat?.name !== conversationName,
                })}
              >
                <InputAdornment
                  position="end"
                  onClick={onSuccessGhangeChatName}
                >
                  <IconComponent type="confirm" />
                </InputAdornment>
                <InputAdornment position="end" onClick={onCancelGhangeChatName}>
                  <IconComponent type="cancel" />
                </InputAdornment>
              </div>
            ),
          }}
        />
      </Box>
      {chat?.content?.map(({ text, type, id }) => {
        console.log(text, 'text');

        return (
          <div className={styles.chatPromptContainer} key={id}>
            <EditablePrompt
              id={id}
              text={text}
              deletePromptRow={deletePromptRow}
              type={type}
              handlePromptBlur={handlePromptBlur}
              readOnly={updatingAiPromptId === id && isStreaming}
              deleteDisabled={deleteDisabled}
            />
          </div>
        );
      })}
      <div className={styles.chatButtonsContainer}>
        <div>
          <div className={styles.buttonsColumn}>
            <button
              onClick={addPromptRow()}
              className={styles.buttonAddChat}
              disabled={isStreaming || isLoading}
            >
              <IconComponent type="plus" className={styles.iconPlus} />
            </button>
            {!isStreaming ? (
              <ButtonComponent
                type="submit"
                variant="contained"
                onClick={handlePromptSubmit}
                disabled={isLoading}
              >
                <span>Submit</span>
                <IconComponent type="submit" />
              </ButtonComponent>
            ) : (
              <ButtonComponent variant="outlined" onClick={stopStream}>
                <span>Stop</span>
                <IconComponent className={styles.iconRegenerate} type="stop" />
              </ButtonComponent>
            )}
          </div>
          <div className={styles.buttonsColumn}>
            <ButtonComponent
              type="submit"
              variant="outlined"
              onClick={handleRegenerate}
              disabled={isStreaming || !lastAssistantPrompt || isLoading}
            >
              <span>Regenerate</span>
              <IconComponent
                className={styles.iconRegenerate}
                type="regenerate"
              />
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
};
