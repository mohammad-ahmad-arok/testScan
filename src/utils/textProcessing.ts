import { createWorker } from 'tesseract.js';
import { OcrResult, ProminentText, AnalysisResult } from '../types';

const MIN_CONFIDENCE = 65;
const MIN_TEXT_LENGTH = 2;

export const extractTextFromImage = async (imageDataUrl: string): Promise<OcrResult[]> => {
  try {
    const worker = await createWorker('eng');
    const result = await worker.recognize(imageDataUrl);
    
    // Get detailed word and line data
    const words = result.data.words
      .filter(word => word.text.length >= MIN_TEXT_LENGTH)
      .map(word => ({
        text: word.text,
        confidence: word.confidence,
        bbox: word.bbox,
        line: {
          text: word.line.text,
          bbox: word.line.bbox
        }
      }));
    
    await worker.terminate();
    return words.filter(word => word.confidence > MIN_CONFIDENCE);
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error('Failed to extract text from image');
  }
};

export const analyzeTextProminence = (ocrResults: OcrResult[]): AnalysisResult => {
  if (!ocrResults.length) {
    return {
      topCandidates: [],
      allText: '',
      ocrConfidence: 0
    };
  }
  
  const allText = ocrResults.map(r => r.text).join(' ');
  const avgConfidence = ocrResults.reduce((sum, r) => sum + r.confidence, 0) / ocrResults.length;
  
  // Group words that are likely part of the same visual element
  const groupedTexts = groupRelatedText(ocrResults);
  
  // Calculate prominence scores for each text group
  const textItems: ProminentText[] = groupedTexts.map(group => {
    // Calculate average position and size for the group
    const bbox = calculateGroupBBox(group);
    const fontSize = bbox.y1 - bbox.y0;
    const width = bbox.x1 - bbox.x0;
    
    // Calculate visual metrics
    const area = width * fontSize;
    const aspectRatio = width / fontSize;
    const density = group.reduce((sum, r) => sum + r.text.length, 0) / area;
    
    // Normalize metrics
    const normalizedArea = normalizeValue(area, 0, 10000);
    const normalizedAspectRatio = normalizeValue(aspectRatio, 0.5, 4);
    const normalizedDensity = normalizeValue(density, 0.001, 0.1);
    
    // Calculate prominence score using multiple factors
    const prominence = (
      normalizedArea * 0.4 +                    // Size importance
      normalizedAspectRatio * 0.2 +            // Shape factor
      normalizedDensity * 0.2 +                // Text density
      (group[0].confidence / 100) * 0.2        // OCR confidence
    ) * 100;
    
    return {
      text: group.map(r => r.text).join(' '),
      confidence: group.reduce((sum, r) => sum + r.confidence, 0) / group.length,
      fontSize,
      prominence
    };
  });
  
  // Sort by prominence score
  const sortedItems = [...textItems].sort((a, b) => 
    (b.prominence || 0) - (a.prominence || 0)
  );
  
  // Get top candidates
  const topCandidates = sortedItems.slice(0, 3).map(item => ({
    ...item,
    confidence: Math.round(item.confidence)
  }));
  
  // Determine if we have a clear winner
  const mostProminent = sortedItems[0];
  const hasDefinitiveResult = sortedItems.length > 1 && 
    (mostProminent.prominence || 0) > (sortedItems[1].prominence || 0) * 1.3;
  
  return {
    mostProminent: hasDefinitiveResult ? mostProminent : undefined,
    topCandidates,
    allText,
    ocrConfidence: avgConfidence
  };
};

// Helper functions
const groupRelatedText = (results: OcrResult[]): OcrResult[][] => {
  const groups: OcrResult[][] = [];
  const processed = new Set<number>();
  
  results.forEach((result, idx) => {
    if (processed.has(idx)) return;
    
    const group = [result];
    processed.add(idx);
    
    // Find related text elements
    results.forEach((other, otherIdx) => {
      if (processed.has(otherIdx)) return;
      
      if (areTextElementsRelated(result, other)) {
        group.push(other);
        processed.add(otherIdx);
      }
    });
    
    groups.push(group);
  });
  
  return groups;
};

const areTextElementsRelated = (a: OcrResult, b: OcrResult): boolean => {
  const verticalOverlap = Math.min(a.bbox.y1, b.bbox.y1) - Math.max(a.bbox.y0, b.bbox.y0);
  const avgHeight = ((a.bbox.y1 - a.bbox.y0) + (b.bbox.y1 - b.bbox.y0)) / 2;
  
  return (
    verticalOverlap > avgHeight * 0.5 &&                    // Significant vertical overlap
    Math.abs(a.bbox.x1 - b.bbox.x0) < avgHeight * 2        // Reasonable horizontal distance
  );
};

const calculateGroupBBox = (group: OcrResult[]) => ({
  x0: Math.min(...group.map(r => r.bbox.x0)),
  y0: Math.min(...group.map(r => r.bbox.y0)),
  x1: Math.max(...group.map(r => r.bbox.x1)),
  y1: Math.max(...group.map(r => r.bbox.y1))
});

const normalizeValue = (value: number, min: number, max: number): number => {
  const normalized = (value - min) / (max - min);
  return Math.max(0, Math.min(1, normalized));
};