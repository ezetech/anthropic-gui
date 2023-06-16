import { Suspense } from 'react';

import { Route, Routes } from 'react-router-dom';

import { ROUTES } from '@/app/router/constants/routes';
import { AuthPage } from '@/pages/AuthPage';
import { ChatLayoutPage } from '@/pages/ChatLayoutPage';

import { PrivateRoute } from './PrivateRoute';

export const RouterComponent = () => (
  <Suspense fallback="Loading ...">
    <Routes>
      <Route path={ROUTES.Auth} element={<AuthPage />} />
      <Route
        path={ROUTES.Home}
        element={
          <PrivateRoute>
            <ChatLayoutPage>
              <div style={{ textAlign: 'center', padding: '25px' }}>Chat</div>
            </ChatLayoutPage>
          </PrivateRoute>
        }
      />
      <Route
        path={`${ROUTES.Chat}/:id`}
        element={
          // TODO insert chat/id page to ChatLayoutPage children}
          <PrivateRoute>
            <ChatLayoutPage>
              <div style={{ textAlign: 'center', padding: '25px' }}>Chat</div>
            </ChatLayoutPage>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<ChatLayoutPage />} />
    </Routes>
  </Suspense>
);
