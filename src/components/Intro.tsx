import React from 'react';
import { CameraIcon, ScanText, Award, Upload } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const Intro: React.FC = () => {
  const { status, setStatus, setCapturedImage, setError } = useAppContext();

  if (status !== 'idle') return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      setStatus('error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setCapturedImage(e.target.result);
        setStatus('processing');
      }
    };
    reader.onerror = () => {
      setError('Failed to read the image file. Please try again.');
      setStatus('error');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <ScanText className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Text Prominence Detector
          </h1>
          
          <p className="text-gray-600 text-center mb-6">
            Capture or upload an image of a paper with text, and we'll identify the most prominent content.
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <CameraIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Capture or Upload</h3>
                <p className="text-sm text-gray-600">Take a photo or choose an image from your device</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <ScanText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Process</h3>
                <p className="text-sm text-gray-600">Our OCR technology extracts all text</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Identify</h3>
                <p className="text-sm text-gray-600">We'll determine the most prominent text</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => setStatus('accessing-camera')}
              className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-sm transition duration-200 flex items-center justify-center"
            >
              <CameraIcon className="w-5 h-5 mr-2" />
              Open Camera
            </button>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload image"
              />
              <button
                className="w-full py-3 px-4 bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-medium rounded-lg shadow-sm transition duration-200 flex items-center justify-center"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;