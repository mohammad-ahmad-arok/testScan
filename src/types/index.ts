export type AppStatus = 
  | 'idle' 
  | 'accessing-camera' 
  | 'camera-ready' 
  | 'processing' 
  | 'completed' 
  | 'error';

export type ProminentText = {
  text: string;
  confidence: number;
  fontSize?: number;
  boldness?: number;
  prominence?: number;
};

export type OcrResult = {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
  line: {
    text: string;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  };
};

export type AnalysisResult = {
  mostProminent?: ProminentText;
  topCandidates: ProminentText[];
  allText: string;
  ocrConfidence: number;
};