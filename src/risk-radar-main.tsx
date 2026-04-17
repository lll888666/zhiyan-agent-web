import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RiskRadarPage from './RiskRadarPage';
import { ReportDataProvider } from './context/ReportDataContext';
import './styles.css';
import './risk-radar.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReportDataProvider>
      <BrowserRouter>
        <RiskRadarPage />
      </BrowserRouter>
    </ReportDataProvider>
  </React.StrictMode>
);
