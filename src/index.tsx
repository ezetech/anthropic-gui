import { createRoot } from 'react-dom/client';

import { App } from './app/App';

import './assets/styles/index.scss';

const rootIdSelector = 'root';
const container = document.getElementById(rootIdSelector);
if (!container) {
  throw new Error(`Root element with id '${rootIdSelector}' not found`);
}

const root = createRoot(container);
root.render(<App />);
