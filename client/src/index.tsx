import React from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import RoutesComponent from './app.tsx';
import './index.css';
import { Toaster } from '@client/src/components/ui/sonner';

const CLIENT_BASE_PATH = process.env.CLIENT_BASE_PATH || '/';

const MainApp = () => {
  return (
    <BrowserRouter basename={CLIENT_BASE_PATH}>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h1 style={{ fontSize: 20, marginBottom: 8 }}>页面出错了</h1>
            <p style={{ color: '#666', marginBottom: 16 }}>{(error as Error)?.message || '发生未知错误'}</p>
            <button
              onClick={resetErrorBoundary}
              style={{
                padding: '8px 24px',
                borderRadius: 8,
                border: '1px solid #ccc',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              重试
            </button>
          </div>
        )}
      >
        <RoutesComponent />
        {createPortal(<Toaster />, document.body)}
      </ErrorBoundary>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')!).render(<MainApp />);
