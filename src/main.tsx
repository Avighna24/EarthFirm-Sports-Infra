import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './LanguageContext';

// Cleanly intercept and filter sandbox-specific environment warnings and errors
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  const originalError = console.error;

  // 1. Silent Vite WebSocket Mock to completely prevent network errors in sandbox console
  const OriginalWebSocket = window.WebSocket;
  
  class DummyWebSocket {
    url: string;
    readyState: number = 3; // CLOSED
    onopen: any = null;
    onclose: any = null;
    onerror: any = null;
    onmessage: any = null;
    constructor(url: string, protocols?: string | string[]) {
      this.url = url;
      // Emit a silent closed state asynchronously
      setTimeout(() => {
        if (this.onclose) {
          try {
            this.onclose({ code: 1006, reason: "Sandbox HMR disabled", wasClean: false });
          } catch (e) {}
        }
      }, 100);
    }
    close() {}
    send() {}
    addEventListener(type: string, listener: any) {
      if (type === 'close') {
        setTimeout(() => {
          try {
            listener({ code: 1006, reason: "Sandbox HMR disabled", wasClean: false });
          } catch (e) {}
        }, 150);
      }
    }
    removeEventListener() {}
  }

  // Intercept WebSocket creation safely to completely prevent "getter only" crashes
  try {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'WebSocket');
    if (descriptor && (descriptor.writable || descriptor.configurable)) {
      // @ts-ignore
      window.WebSocket = function (url: string, protocols?: string | string[]) {
        const urlStr = String(url || '').toLowerCase();
        if (
          urlStr.includes('vite') ||
          urlStr.includes('hmr') ||
          urlStr.includes('102206107054') ||
          urlStr.includes('asia-southeast1.run.app') ||
          urlStr.includes('3000') ||
          urlStr.includes('localhost')
        ) {
          return new DummyWebSocket(url, protocols);
        }
        return new OriginalWebSocket(url, protocols);
      };
      
      // Bind standard properties/statical values
      // @ts-ignore
      window.WebSocket.prototype = OriginalWebSocket.prototype;
      // @ts-ignore
      window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
      // @ts-ignore
      window.WebSocket.OPEN = OriginalWebSocket.OPEN;
      // @ts-ignore
      window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
      // @ts-ignore
      window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
    }
  } catch (err) {
    // If window.WebSocket cannot be reassigned due to a read-only getter, fallback silently.
    // Our robust console filters and unhandled rejection event listeners below will handle it natively.
  }

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

