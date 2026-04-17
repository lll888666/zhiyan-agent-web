import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { type ReportData } from '../report-data';

type ReportDataContextValue = {
  reportData: ReportData | null;
  setReportData: (data: ReportData | null) => void;
};

const ReportDataContext = createContext<ReportDataContextValue | undefined>(undefined);

function ReportDataProvider({ children }: { children: ReactNode }) {
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const value = useMemo(
    () => ({
      reportData,
      setReportData,
    }),
    [reportData]
  );

  return <ReportDataContext.Provider value={value}>{children}</ReportDataContext.Provider>;
}

function useReportData() {
  const context = useContext(ReportDataContext);
  if (!context) {
    throw new Error('useReportData must be used within ReportDataProvider');
  }
  return context;
}

export { ReportDataProvider, useReportData };
