// frontend/app/(tabs)/explore.tsx
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';

// ⚠️ Ensure this is your exact IP address!
const BACKEND_URL = 'http://192.168.137.17:5000';

export default function AddMedicationTab() {
  const [patientName, setPatientName] = useState('');
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  const submitMedication = async () => {
    // Basic validation
    if (!patientName || !medName || !dosage || !time) {
      Alert.alert("Missing Info", "Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/medications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: patientName,
          medicationName: medName,
          dosage: dosage,
          timeToTake: time
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success!", "Medication saved to the database.");
        // Clear the form
        setPatientName('');
        setMedName('');
        setDosage('');
        setTime('');
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  /*return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <Text style={styles.header}>Add Medication</Text>
      
      <View style={styles.formCard}>
        <Text style={styles.label}>Patient Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g., Grandpa Joe" 
          value={patientName}
          onChangeText={setPatientName}
        />

        <Text style={styles.label}>Medication Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g., Aspirin" 
          value={medName}
          onChangeText={setMedName}
        />

        <Text style={styles.label}>Dosage</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g., 2 Pills" 
          value={dosage}
          onChangeText={setDosage}
        />

        <Text style={styles.label}>Time to Take</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g., 08:00 AM" 
          value={time}
          onChangeText={setTime}
        />

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={submitMedication}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitText}>Save to Database</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );*/
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', padding: 20, justifyContent: 'center' },
  header: { fontSize: 32, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 20, textAlign: 'center' },
  formCard: { backgroundColor: 'white', padding: 25, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  label: { fontSize: 18, fontWeight: '600', color: '#3A3A3C', marginBottom: 8 },
  input: { backgroundColor: '#F2F2F7', borderRadius: 12, padding: 15, fontSize: 18, marginBottom: 20, borderWidth: 1, borderColor: '#E5E5EA' },
  submitButton: { backgroundColor: '#007AFF', paddingVertical: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  submitText: { color: 'white', fontSize: 20, fontWeight: 'bold' }
});