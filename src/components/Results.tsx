import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { RefreshCw, Award, List, Maximize2 } from 'lucide-react';

const Results: React.FC = () => {
  const { status, capturedImage, analysisResult, resetApp } = useAppContext();

  if (status !== 'completed' || !analysisResult) return null;

  const { mostProminent, topCandidates, ocrConfidence } = analysisResult;

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {Math.round(ocrConfidence)}% confidence
            </span>
          </div>

          {capturedImage && (
            <div className="mb-6 rounded-lg overflow-hidden shadow-sm relative group">
              <img 
                src={capturedImage} 
                alt="Captured image" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          )}

          {mostProminent ? (
            <div className="mb-6 animate-fadeIn">
              <div className="flex items-center mb-2">
                <Award className="w-5 h-5 text-amber-500 mr-2" />
                <h3 className="font-medium text-gray-700">Most Prominent Text</h3>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-xl font-bold text-blue-800 break-words">
                  {mostProminent.text}
                </p>
                <div className="mt-2 flex items-center">
                  <div className="flex-grow h-1.5 bg-blue-200 rounded-full">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${mostProminent.confidence}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm text-blue-600 font-medium">
                    {Math.round(mostProminent.confidence)}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 animate-fadeIn">
              <div className="flex items-center mb-2">
                <List className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="font-medium text-gray-700">Top Candidates</h3>
              </div>
              <div className="space-y-3">
                {topCandidates.map((candidate, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${
                      index === 0 
                        ? 'bg-blue-50 border-blue-100' 
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <p className={`${
                      index === 0 ? 'text-lg font-semibold text-blue-800' : 'text-base text-gray-700'
                    } break-words`}>
                      {candidate.text}
                    </p>
                    <div className="flex items-center mt-2">
                      <div className="flex-grow h-1.5 bg-gray-200 rounded-full">
                        <div 
                          className={`h-full rounded-full ${
                            index === 0 ? 'bg-blue-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${candidate.confidence}%` }}
                        />
                      </div>
                      <span className={`ml-2 text-sm font-medium ${
                        index === 0 ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {candidate.confidence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={resetApp}
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-sm transition duration-200 flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Analyze Another Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;