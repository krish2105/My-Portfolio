import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './lib/theme.tsx';
import { SoundProvider } from './lib/sound.tsx';
import { ViewModeProvider } from './lib/viewMode.tsx';
import { initErrorReporting } from './lib/errorReporting.ts';
import './index.css';

// Prevent the browser from restoring a mid-page scroll position on reload/back-nav
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

initErrorReporting();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <SoundProvider>
        <ViewModeProvider>
          <App />
        </ViewModeProvider>
      </SoundProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
