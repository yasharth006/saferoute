import React, { useState } from 'react';
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
