import { PropsWithChildren } from 'react';

import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { ROUTES } from '@/app/router/constants/routes';
import { selectApiKey } from '@/redux/apiSettings/apiSettings.selectors';

export const PrivateRoute = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const apiKey = useSelector(selectApiKey);

  if (!apiKey) {
    return (
      <Navigate to={{ pathname: ROUTES.Auth }} state={{ from: location }} />
    );
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
};
