import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RevisionViewerPage from './RevisionViewerPage';
import { ReportDataProvider } from './context/ReportDataContext';
import './styles.css';
import './revision-viewer.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReportDataProvider>
      <BrowserRouter>
        <RevisionViewerPage />
      </BrowserRouter>
    </ReportDataProvider>
  </React.StrictMode>
);
