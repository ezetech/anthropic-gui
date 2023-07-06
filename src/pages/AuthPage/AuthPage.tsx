import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react';

import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { submitPrompt } from '@/api/prompt.api';
import { ROUTES } from '@/app/router/constants/routes';
import { selectApiModel } from '@/redux/apiSettings/apiSettings.selectors';
import { setApiKey as dispatchApiKey } from '@/redux/apiSettings/apiSettings.slice';
import { useAppDispatch } from '@/redux/hooks';
import { ButtonAuthComponent } from '@/ui/ButtonAuthComponent';
import { IconComponent } from '@/ui/IconComponent';
import { TextFieldAuthComponent } from '@/ui/TextFieldAuthComponent';

import styles from './AuthPage.module.scss';

export const AuthPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [invalidKey, setInvalidKey] = useState(false);
  const model = useSelector(selectApiModel);

  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement | null>(null);

  const dispatch = useAppDispatch();

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.includes(' ')) {
      event.target.value = value.replace(/ /g, '');
    }
    setApiKey(event.target.value);
    setInvalidKey(false);
  }, []);

  const validateApiKey = useCallback(
    async (keyApi: string): Promise<boolean> => {
      try {
        const response = await submitPrompt({
          model: model,
          temperature: 0,
          topK: 0,
          topP: 0,
          apiKey: keyApi,
          maxTokens: 1,
          prompt: `\n\nHuman: ' '\n\nAssistant:`,
        });
        if (response?.ok) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },
    [model],
  );

  const onSubmit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      if (apiKey.length > 10) {
        const isValidKey = await validateApiKey(apiKey);
        if (isValidKey) {
          dispatch(dispatchApiKey(apiKey));
          navigate(ROUTES.Home, { replace: true });
        } else {
          setInvalidKey(true);
        }
      } else {
        setInvalidKey(true);
      }
    },
    [apiKey, validateApiKey, dispatch, navigate],
  );

  const onEnter = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' || event.code === 'NumpadEnter') {
        onSubmit();
      }
    },
    [onSubmit],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.backgroundWrapper}></div>
      <div className={styles.logoWrapper}>
        <IconComponent type="logoLight" className={styles.logoAuth} />
      </div>
      <div className={styles.formWrapper}>
        <form onSubmit={onSubmit} ref={formRef} className={styles.form}>
          <Stack spacing={1}>
            <div className={styles.errorContainer}>
              <p className={styles.textApiKey}>API Key</p>
              {apiKey.length > 0 && invalidKey && (
                <div>
                  <IconComponent type="warning" />
                  <span className={styles.textInvalidKey}>Invalid key</span>
                </div>
              )}
            </div>
            <TextFieldAuthComponent
              className={`${styles.textField} ${
                invalidKey ? styles.invalid : ''
              }`}
              placeholder="Enter key"
              value={apiKey}
              onChange={onChange}
              onKeyDown={onEnter}
              autoComplete="off"
              error={invalidKey && apiKey !== ''}
            />

            <ButtonAuthComponent
              type="submit"
              variant="contained"
              disabled={invalidKey || apiKey === ''}
            >
              Enter
            </ButtonAuthComponent>
          </Stack>
        </form>
      </div>
    </div>
  );
};
