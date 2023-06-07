import { Stack } from '@mui/material';

import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export const HomePage = () => (
  <Stack spacing={2} padding={4}>
    <div>Home Page</div>
    <Stack justifyContent="center" flexDirection="row">
      <div style={{ width: 400 }}>
        <ThemeSwitcher />
      </div>
    </Stack>
  </Stack>
);
