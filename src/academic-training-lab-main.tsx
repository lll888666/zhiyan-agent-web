import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AcademicTrainingLabPage from './AcademicTrainingLabPage';
import { ReportDataProvider } from './context/ReportDataContext';
import './styles.css';
import './academic-training-lab.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReportDataProvider>
      <BrowserRouter>
        <AcademicTrainingLabPage />
      </BrowserRouter>
    </ReportDataProvider>
  </React.StrictMode>
);
