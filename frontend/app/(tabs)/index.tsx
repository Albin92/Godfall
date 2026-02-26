import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

const BACKEND_URL = 'http://192.168.137.17:5000'; // Change to your current IP if needed

export default function Index() {
  const [serverMessage, setServerMessage] = useState("Waiting for server...");

  const pingServer = async () => {
    setServerMessage("Pinging...");
    try {
      const response = await fetch(`${BACKEND_URL}/api/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setServerMessage(data.message); 
      
    } catch (error) {
      console.error("Fetch error:", error);
      setServerMessage("Cannot connect to backend");
    }
  };

  useEffect(() => {
    pingServer();
  }, []);

  // --- SOS Trigger Logic ---
  const handleSOSTrigger = () => {
    Alert.alert(
      "Emergency SOS",
      "Are you sure you want to trigger the SOS alert?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "SEND SOS", 
          style: "destructive",
          onPress: sendSOSRequest 
        }
      ]
    );
  };

  const sendSOSRequest = async () => {
    try {
      // ⚠️ REPLACE +91YOUR_REAL_NUMBER with the one you verified in Twilio!
      const response = await fetch(`${BACKEND_URL}/api/sos/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: "user_123",
          userName: "Abdul Basith K A", 
          location: { latitude: 13.0827, longitude: 80.2707 },
          contactNumber: "+91YOUR_REAL_NUMBER" 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert("SOS Sent!", "Emergency contacts are being called.");
      } else {
        Alert.alert("Error", "Could not send SOS.");
      }
    } catch (error) {
      console.error("SOS Fetch Error:", error);
      Alert.alert("Network Error", "Could not reach the server.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Server Sync</Text>
      
      <View style={styles.card}>
        <Text style={styles.subtitle}>Backend Connection:</Text>
        <Text style={styles.statusText}>{serverMessage}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={pingServer}>
        <Text style={styles.buttonText}>Ping Server Again</Text>
      </TouchableOpacity>

      {/* --- Big Red SOS Button --- */}
      <TouchableOpacity style={styles.sosButton} onPress={handleSOSTrigger}>
        <Text style={styles.sosButtonText}>SOS EMERGENCY</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F7' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 5, marginBottom: 30, width: '80%', alignItems: 'center' },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 10 },
  statusText: { fontSize: 18, fontWeight: '800', color: '#007AFF', textAlign: 'center' },
  button: { backgroundColor: '#34C759', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10, elevation: 3, marginBottom: 40 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  
  sosButton: {
    backgroundColor: '#E63946',
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderWidth: 5,
    borderColor: '#FCA5A5'
  },
  sosButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});