import { apiClient } from './client';
import { RoutePredictionRequest, RoutePredictionResponse, IncidentReport } from './types';

export const getRoutePredictions = (payload: RoutePredictionRequest): Promise<RoutePredictionResponse> => {
  return apiClient.post('/routes/predict', payload);
};

export const reportIncident = (payload: IncidentReport): Promise<{ success: boolean; id: string }> => {
  return apiClient.post('/incidents', payload);
};

export const fetchActiveIncidents = (): Promise<IncidentReport[]> => {
  return apiClient.get('/incidents/active');
};
