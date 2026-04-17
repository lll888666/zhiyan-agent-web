import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import AppRouter from './AppRouter';
import { ReportDataProvider } from './context/ReportDataContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReportDataProvider>
      <HashRouter>
        <AppRouter />
      </HashRouter>
    </ReportDataProvider>
  </React.StrictMode>
);
