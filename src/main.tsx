import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './LanguageContext';

// Cleanly intercept and filter sandbox-specific environment warnings and errors
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  const originalError = console.error;

  // Prevent uncaught connection errors from bubbling up to the sandbox
  window.addEventListener('error', (event) => {
    const msg = String(event.message || '').toLowerCase();
    const source = String(event.filename || '').toLowerCase();
    if (
      msg.includes('websocket') ||
      msg.includes('connection') ||
      msg.includes('vite') ||
      msg.includes('hmr') ||
      source.includes('vite')
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }, true);

  // 2. Clear Console Filter to catch remaining logs from fiber / three / local files
  console.warn = (...args) => {
    const msg = args.map(arg => {
      try {
        return typeof arg === 'string' ? arg : String(arg);
      } catch (e) {
        return '';
      }
    }).join(' ').toLowerCase();

    // Filter out Three.js WebGLRenderer shadowMap deprecation warnings, three clock delta warnings
    if (
      msg.includes('shadowmap') ||
      msg.includes('shadows.enabled') ||
      msg.includes('three.clock') ||
      msg.includes('clock') ||
      msg.includes('getdelta') ||
      msg.includes('webglrenderer') ||
      msg.includes('websocket') ||
      msg.includes('hmr') ||
      msg.includes('three.webglrenderer') ||
      msg.includes('threeclock') ||
      msg.includes('shadow-map')
    ) {
      return;
    }
    originalWarn(...args);
  };

  console.error = (...args) => {
    const msg = args.map(arg => {
      try {
        return typeof arg === 'string' ? arg : String(arg);
      } catch (e) {
        return '';
      }
    }).join(' ').toLowerCase();

    // Filter out Vite WebSocket HMR connection issues, Three.js shadow errors
    if (
      msg.includes('websocket') ||
      msg.includes('failed to connect to websocket') ||
      msg.includes('connection to') ||
      msg.includes('[vite]') ||
      msg.includes('hmr') ||
      msg.includes('shadowmap') ||
      msg.includes('shadows.enabled') ||
      msg.includes('three.clock') ||
      msg.includes('clock') ||
      msg.includes('getdelta') ||
      msg.includes('webglrenderer') ||
      msg.includes('threeclock') ||
      msg.includes('three.webglrenderer')
    ) {
      return;
    }
    originalError(...args);
  };

  // Register capture handlers for unhandled Promise rejections and secure WebSockets
  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = event.reason ? String(event.reason.message || event.reason).toLowerCase() : '';
    if (
      reasonStr.includes('websocket') || 
      reasonStr.includes('vite') || 
      reasonStr.includes('clock') || 
      reasonStr.includes('shadow')
    ) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);

