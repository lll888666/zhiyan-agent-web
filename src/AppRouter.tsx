import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import App from './App';
import RevisionViewerPage from './RevisionViewerPage';
import RiskRadarPage from './RiskRadarPage';
import AcademicTrainingLabPage from './AcademicTrainingLabPage';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/report" element={<App />} />
      <Route path="/revision-viewer" element={<RevisionViewerPage />} />
      <Route path="/risk-radar" element={<RiskRadarPage />} />
      <Route path="/training-lab" element={<AcademicTrainingLabPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
