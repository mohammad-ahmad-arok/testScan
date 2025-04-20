import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorDisplay: React.FC = () => {
  const { status, error, resetApp } = useAppContext();

  if (status !== 'error' || !error) return null;

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4 text-red-500">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-bold">Error Occurred</h2>
          </div>
          
          <p className="text-gray-700 mb-6">{error}</p>
          
          <button
            onClick={resetApp}
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-sm transition duration-200 flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;