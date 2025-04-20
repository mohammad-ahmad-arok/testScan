import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { useAppContext } from './contexts/AppContext';
import Intro from './components/Intro';
import Camera from './components/Camera';
import TextAnalyzer from './components/TextAnalyzer';
import Results from './components/Results';
import ErrorDisplay from './components/ErrorDisplay';

const AppContent: React.FC = () => {
  const { status } = useAppContext();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Text Prominence Detector
        </h1>
      </header>
      
      <main>
        <Intro />
        {['accessing-camera', 'camera-ready'].includes(status) && <Camera />}
        <TextAnalyzer />
        <Results />
        <ErrorDisplay />
      </main>
      
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>© 2025 Text Prominence Detector</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;