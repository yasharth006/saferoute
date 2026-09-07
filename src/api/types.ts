export interface LocationPoint {
  latitude: number;
  longitude: number;
}

export interface RoutePredictionRequest {
  origin: LocationPoint;
  destination: LocationPoint;
  timeOfDay?: string;
}

export interface RoutePredictionResponse {
  routeId: string;
  safetyScore: number;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  explanation: string[];
  waypoints: LocationPoint[];
}

export interface IncidentReport {
  id?: string;
  type: string;
  description: string;
  location: LocationPoint;
  timestamp: string;
}
