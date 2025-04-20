import React, { useEffect, useRef, useState } from "react";
import { CameraIcon, X, RefreshCw, AlertTriangle } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";

const Camera: React.FC = () => {
  const { status, setStatus, setCapturedImage, setError } = useAppContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraSupported, setIsCameraSupported] = useState(true);

  const startCamera = async () => {
    setStatus("accessing-camera");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsCameraSupported(false);
      setError("Camera access is not supported in your browser.");
      setStatus("error");
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        })
        .catch(async () => {
          return await navigator.mediaDevices.getUserMedia({
            video: true,
          });
        });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };

        setStream(mediaStream);
        setStatus("camera-ready");
      }

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setStatus("camera-ready");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          setError("Camera access was denied. Please check permissions.");
        } else if (error.name === "NotFoundError") {
          setError("No camera found on your device.");
        } else {
          setError("Failed to access camera. Check if camera is in use.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
      setStatus("error");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureAndProcessImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          const imageDataUrl = canvas.toDataURL("image/png");
          setCapturedImage(imageDataUrl);
          setStatus("processing");
          stopCamera();
        } catch (error) {
          console.error("Error capturing image:", error);
          setError("Failed to capture image. Please try again.");
          setStatus("error");
        }
      }
    }
  };

  useEffect(() => {
    if (status === "accessing-camera") {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [status]);

  if (!isCameraSupported) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-red-800 font-medium">Camera Not Supported</h3>
            <p className="text-red-600 mt-1">
              Your browser doesn't support camera access. Please try uploading
              an image instead.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="rounded-lg overflow-hidden bg-black shadow-lg relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-[400px] object-cover ${
            status !== "camera-ready" ? "opacity-50" : "opacity-100"
          }`}
        />

        <canvas ref={canvasRef} className="hidden" />

        {status === "accessing-camera" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="w-12 h-12 text-white animate-spin" />
          </div>
        )}

        {status === "camera-ready" && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <button
              onClick={captureAndProcessImage}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-blue-500 focus:outline-none transform hover:scale-105 transition-transform"
              aria-label="Capture image"
            >
              <CameraIcon className="w-8 h-8 text-blue-500" />
            </button>
          </div>
        )}

        <div className="absolute top-4 right-4">
          <button
            onClick={() => {
              stopCamera();
              setStatus("idle");
            }}
            className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            aria-label="Close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-gray-600">
        {status === "accessing-camera" && "Accessing camera..."}
        {status === "camera-ready" &&
          "Position the paper with text in the frame and tap the button to capture"}
      </p>
    </div>
  );
};

export default Camera;
