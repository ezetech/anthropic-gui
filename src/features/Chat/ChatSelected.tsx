import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
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
  renameChat,
  updateChatContents,
  updateContentById,
} from '@/redux/conversations/conversationsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ChatContent } from '@/typings/common';
import { ButtonComponent } from '@/ui/ButtonComponent';
import { IconComponent } from '@/ui/IconComponent';
import { TextFieldComponent } from '@/ui/TextFieldComponent';

import { AiPrompt, EditablePrompt } from './components/Prompts';

import styles from './Chat.module.scss';

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

  const apiKey = useSelector(selectApiKey);
  const model = useSelector(selectApiModel);
  const temperature = useSelector(selectApiTemperature);
  const maxTokens = useSelector(selectApiMaxTokens);
  const topK = useSelector(selectApiTopK);
  const topP = useSelector(selectApiTopP);

  const dispatch = useAppDispatch();

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
          (chat?.content?.[chat.content.length - 1]?.type === 'human'
            ? 'assistant'
            : 'human');

        const newPrompt: ChatContent = {
          type: newPromptType as 'human' | 'assistant',
          text: '',
          id: uuidv4(),
        };

        dispatch(
          addPromptToChat({ chatId: chat?.id || '', content: newPrompt }),
        );
      },
    [chat?.content, chat?.id, dispatch],
  );

  const deletePromptRow = (id: string) => () => {
    if (chat?.content) {
      const index = chat?.content?.findIndex(prompt => prompt.id === id);

      if (index !== -1) {
        const newPrompts = [...chat.content];
        newPrompts.splice(index, 1);

        dispatch(
          updateChatContents({ chatId: chat?.id || '', contents: newPrompts }),
        );
      }
    }
  };

  const generateResponse = useCallback(
    async (isRegenerate?: boolean) => {
      const newAbortController = new AbortController();
      const signal = newAbortController.signal;
      setAbortController(newAbortController);
      let lastAssistantId = '';

      if (isRegenerate) {
        const lastAssistant =
          chat?.content?.filter(item => item.type === 'assistant') ?? [];
        if (lastAssistant?.length > 0) {
          lastAssistantId = lastAssistant[lastAssistant?.length - 1].id;
        }
      }

      const chatContent = lastAssistantId
        ? chat?.content?.filter(content => content.id !== lastAssistantId)
        : chat?.content;

      const promptTexts =
        chatContent?.map(prompt => {
          const type = prompt.type;
          const promptText = prompt.text;

          return `\n\n${type}: ${promptText}`;
        }) || [];

      const requestBody = {
        model,
        temperature,
        topK,
        topP,
        apiKey,
        maxTokens,
        prompt: promptTexts.join(''),
        signal,
      };

      try {
        const response = await submitPrompt(requestBody);
        if (response?.ok) {
          const reader = response?.body?.getReader();
          const decoder = new TextDecoder('utf-8');

          let newPrompt: ChatContent | undefined;

          if (!isRegenerate) {
            newPrompt = {
              type: 'assistant',
              text: '',
              id: uuidv4(),
            };
            dispatch(
              addPromptToChat({ chatId: chat?.id || '', content: newPrompt }),
            );
          }

          while (true) {
            const res = await reader?.read();
            if (res?.done) break;
            let lastLine: any = '';
            const lastLineData = decoder.decode(res?.value);

            const lastLineArray = lastLineData.split('data: ');

            lastLine = lastLineArray[lastLineArray.length - 1].includes(
              '"exception": null}',
            )
              ? lastLineArray[lastLineArray.length - 1]
              : lastLineArray[lastLineArray.length - 2];

            if (lastLine.startsWith('{"completion":')) {
              try {
                const eventData = JSON.parse(lastLine);

                if (eventData.completion) {
                  dispatch(
                    updateContentById({
                      chatId: chat?.id ?? '',
                      contentId: lastAssistantId || newPrompt?.id || '',
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
            addPromptRow('human')();
          }
        } else {
          console.error('Error: ' + response?.statusText);
        }
      } catch (error) {
        console.error('error', error);
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
    ],
  );

  const handleRegenerate = async () => {
    if (chat?.content) {
      if (!chat.content[chat.content.length - 1].text) {
        deletePromptRow(chat.content[chat.content.length - 1].id);
      }
      await generateResponse(true);
    }
  };

  const handlePromptSubmit = useCallback(async () => {
    await generateResponse();
    setHasSubmitted(true);
  }, [chat?.content, generateResponse]);

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

  const handlePromptBlur =
    (id: string) => (event: React.FocusEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;

      dispatch(
        updateContentById({
          chatId: chat?.id || '',
          contentId: id,
          text: value,
        }),
      );
    };

  const stopStream = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  };

  const onSuccessGhangeChatName = useCallback(() => {
    if (conversationName) {
      dispatch(
        renameChat({
          conversationId: chat?.id || '',
          name: conversationName,
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

  return (
    <div className={styles.chatGeneralContainer}>
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
      {chat?.content?.map(({ text, type, id }) => (
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
        <div className={styles.buttonsColumn}>
          <ButtonComponent variant="outlined" onClick={stopStream}>
            <span>Stop</span>
          </ButtonComponent>
          <ButtonComponent
            type="submit"
            variant="outlined"
            onClick={handleRegenerate}
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
  );
};
