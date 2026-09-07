const fs = require('fs');
const path = require('path');

const files = {
  // Theme
  'src/theme/colors.ts': `export const Colors = {
  primary: '#0066FF',
  background: '#F8F9FA',
  cardBg: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  riskLow: '#10B981',
  riskMedium: '#F59E0B',
  riskHigh: '#EF4444',
  disabled: '#9CA3AF',
  errorBg: '#FEE2E2',
};
`,

  // API Types
  'src/api/types.ts': `export interface LocationPoint {
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
`,

  // API Client
  'src/api/client.ts': `import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);
`,

  // API Endpoints
  'src/api/endpoints.ts': `import { apiClient } from './client';
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
`,

  // Home Screen
  'src/screens/HomeScreen.tsx': `import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '../theme/colors';
import { getRoutePredictions } from '../api/endpoints';
import { RoutePredictionResponse } from '../api/types';

export const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<RoutePredictionResponse | null>(null);

  const handleFetchRoute = async () => {
    setLoading(true);
    try {
      const data = await getRoutePredictions({
        origin: { latitude: 12.9716, longitude: 77.5946 },
        destination: { latitude: 12.9352, longitude: 77.6245 },
      });
      setPrediction(data);
    } catch (error: any) {
      Alert.alert('Error Fetching Route', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (category?: string) => {
    switch (category) {
      case 'LOW': return Colors.riskLow;
      case 'MEDIUM': return Colors.riskMedium;
      case 'HIGH': return Colors.riskHigh;
      default: return Colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safety Route Finder</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleFetchRoute} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Find Safe Route</Text>}
      </TouchableOpacity>

      {prediction && (
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <Text style={styles.cardTitle}>Route Analysis</Text>
            <View style={[styles.badge, { backgroundColor: getRiskColor(prediction.riskCategory) }]}>
              <Text style={styles.badgeText}>{prediction.riskCategory} RISK</Text>
            </View>
          </View>
          <Text style={styles.scoreText}>Safety Score: {prediction.safetyScore}/100</Text>
          {prediction.explanation.map((item, idx) => (
            <Text key={idx} style={styles.reasonText}>• {item}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: Colors.background, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 20, textAlign: 'center' },
  button: { backgroundColor: Colors.primary, padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: Colors.cardBg, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  scoreText: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: Colors.textPrimary },
  reasonText: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
});
`
};

Object.entries(files).forEach(([filePath, content]) => {
  const absolutePath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content, 'utf8');
  console.log(`Created: ${filePath}`);
});

console.log('\n✅ All files and folders successfully generated!');