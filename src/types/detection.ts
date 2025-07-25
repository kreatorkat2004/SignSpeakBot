export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface DetectionResult {
  sign: string;
  confidence: number;
  landmarks: HandLandmark[];
  timestamp: number;
}

export interface SignDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
}