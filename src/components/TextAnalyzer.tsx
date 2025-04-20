import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { extractTextFromImage, analyzeTextProminence } from '../utils/textProcessing';

const TextAnalyzer: React.FC = () => {
  const { status, capturedImage, setStatus, setAnalysisResult, setError } = useAppContext();

  useEffect(() => {
    const processImage = async () => {
      if (status !== 'processing' || !capturedImage) return;
      
      try {
        // Extract text using OCR
        const ocrResults = await extractTextFromImage(capturedImage);
        
        if (ocrResults.length === 0) {
          setError('No text was detected in the image. Please try again with clearer text.');
          setStatus('error');
          return;
        }
        
        // Analyze text prominence
        const result = analyzeTextProminence(ocrResults);
        setAnalysisResult(result);
        setStatus('completed');
      } catch (error) {
        console.error('Error during text analysis:', error);
        setError('An error occurred during text analysis. Please try again.');
        setStatus('error');
      }
    };

    processImage();
  }, [status, capturedImage]);

  if (status !== 'processing') return null;

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Text</h2>
      <p className="text-gray-600 text-center">
        Extracting and analyzing text from your image to identify the most prominent content...
      </p>
    </div>
  );
};

export default TextAnalyzer;