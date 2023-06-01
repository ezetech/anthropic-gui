import { Suspense } from 'react';

import { Route, Routes } from 'react-router-dom';

import { ROUTES } from '@/app/router/constants/routes';
import { AuthPage } from '@/pages/AuthPage';
import { HomePage } from '@/pages/HomePage';

import { PrivateRoute } from './PrivateRoute';

export const RouterComponent = () => (
  <Suspense fallback="Loading ...">
    <Routes>
      <Route path={ROUTES.Auth} element={<AuthPage />} />
      <Route
        path={ROUTES.Home}
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<HomePage />} />
    </Routes>
  </Suspense>
);
