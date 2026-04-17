import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ReportDataProvider } from './context/ReportDataContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReportDataProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReportDataProvider>
  </React.StrictMode>
);
