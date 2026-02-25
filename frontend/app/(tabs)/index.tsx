import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Index() {
  // State to hold the message from your backend
  const [serverMessage, setServerMessage] = useState('Waiting for connection...');

  // Function to ping your backend
  const pingServer = async () => {
    setServerMessage('Pinging...');
    try {
      // TODO: Replace with your actual backend URL once it's running
      // Example: const response = await fetch('http://10.0.2.2:5000/api/status');
      // const data = await response.json();
      // setServerMessage(data.message);
      
      // Temporary fake success message until you connect your backend:
      setTimeout(() => setServerMessage('Server is online!'), 1000);
    } catch (error) {
      setServerMessage('Failed to connect.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Server Sync</Text>
      
      <View style={styles.card}>
        <Text style={styles.subtitle}>Backend Status:</Text>
        <Text style={styles.statusText}>{serverMessage}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={pingServer}>
        <Text style={styles.buttonText}>Ping Server Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});