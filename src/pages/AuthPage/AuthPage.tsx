import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/app/router/constants/routes';
import { setApiKey as dispatchApiKey } from '@/redux/apiSettings/apiSettings.slice';
import { useAppDispatch } from '@/redux/hooks';
import { ButtonComponent } from '@/ui/ButtonComponent';
import { TextFieldComponent } from '@/ui/TextFieldComponent';

import styles from './AuthPage.module.scss';

export const AuthPage = () => {
  const [apiKey, setApiKey] = useState('');

  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement | null>(null);

  const dispatch = useAppDispatch();

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  }, []);

  const onSubmit = useCallback(
    (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      if (apiKey) {
        dispatch(dispatchApiKey(apiKey));
        navigate(ROUTES.Home, { replace: true });
      }
    },
    [dispatch, apiKey, navigate],
  );

  const onEnter = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.code === 'NumpadEnter') {
        onSubmit();
      }
    },
    [onSubmit],
  );

  useEffect(() => {
    document.addEventListener('keydown', onEnter);

    return () => document.removeEventListener('keydown', onEnter);
  }, [onEnter]);

  return (
    <div className={styles.wrapper}>
      <form onSubmit={onSubmit} ref={formRef}>
        <Stack spacing={2}>
          <TextFieldComponent
            placeholder="Api Key"
            value={apiKey}
            required
            onChange={onChange}
            autoFocus
          />
          <ButtonComponent type="submit" variant="contained" disabled={!apiKey}>
            Enter
          </ButtonComponent>
        </Stack>
      </form>
    </div>
  );
};
