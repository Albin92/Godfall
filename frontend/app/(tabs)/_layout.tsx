// frontend/app/index.js  <-- Make sure it's in this exact file!
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const BACKEND_URL = 'http://192.168.137.17:5000';

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
      setServerMessage("OOOOOOMMMMFFFFFFIIIIII MOONEEEEEEYYYYY");
    }
  };

  useEffect(() => {
    pingServer();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>  server Sync</Text>
      
      <View style={styles.card}>
        <Text style={styles.subtitle}>Backend hehe:</Text>
        <Text style={styles.statusText}>{serverMessage}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={pingServer}>
        <Text style={styles.buttonText}>Ping Server Again</Text>
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
  button: { backgroundColor: '#34C759', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10, elevation: 3 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});