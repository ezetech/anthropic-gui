import { Stack } from '@mui/material';

import { ApiSettings } from '@/components/ApiSettings';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export const HomePage = () => (
  <Stack spacing={2} padding={4}>
    <div>Home Page</div>
    <Stack alignItems="center" flexDirection="column">
      <div style={{ width: 400, marginBottom: 20 }}>
        <ThemeSwitcher />
      </div>
      <div style={{ width: 400, marginBottom: 20 }}>
        <ApiSettings />
      </div>
    </Stack>
  </Stack>
);
