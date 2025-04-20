import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppStatus, AnalysisResult } from '../types';

interface AppContextType {
  status: AppStatus;
  setStatus: (status: AppStatus) => void;
  capturedImage: string | null;
  setCapturedImage: (image: string | null) => void;
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetApp = () => {
    setStatus('idle');
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <AppContext.Provider
      value={{
        status,
        setStatus,
        capturedImage,
        setCapturedImage,
        analysisResult,
        setAnalysisResult,
        error,
        setError,
        resetApp
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};