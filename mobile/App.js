import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.brand}>SafeRoute</Text>
        <Text style={styles.tagline}>Safer journeys start here.</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Where do you want to go?</Text>

        <Text style={styles.description}>
          Find routes using safety insights, reported incidents, and live risk
          information.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => alert("Route planning will be added next.")}
        >
          <Text style={styles.primaryButtonText}>Plan a safe route</Text>
        </TouchableOpacity>

        <Text style={styles.statusText}>
          Mobile application setup complete
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>SafeRoute • Travel with confidence</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#081A2D",
  },

  header: {
    backgroundColor: "#0E3A5C",
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  brand: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  tagline: {
    color: "#B9DDF5",
    fontSize: 16,
    marginTop: 8,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 38,
  },

  description: {
    color: "#B7C7D8",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
  },

  primaryButton: {
    alignItems: "center",
    backgroundColor: "#16A36A",
    borderRadius: 12,
    marginTop: 32,
    paddingVertical: 16,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  statusText: {
    color: "#7F9BB3",
    fontSize: 13,
    marginTop: 24,
    textAlign: "center",
  },

  footer: {
    alignItems: "center",
    paddingBottom: 34,
    paddingHorizontal: 24,
  },

  footerText: {
    color: "#6F8AA1",
    fontSize: 13,
  },
});