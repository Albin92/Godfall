import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function MedsScreen() {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [pillCount, setPillCount] = useState("1");
  const [dose, setDose] = useState("500");
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChangeTime = (event: any, selectedDate: any) => {
    setShowPicker(false);
    if (selectedDate) setTime(selectedDate);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} />
        <Text style={styles.headerTitle}>New Medicine</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Medicine Name */}
      <Text style={styles.label}>What is the medicine called?</Text>
      <TextInput
        placeholder="Example: Aspirin"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      {/* Frequency */}
      <Text style={styles.label}>How often do you take it?</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.optionCard,
            frequency === "daily" && styles.selectedCard,
          ]}
          onPress={() => setFrequency("daily")}
        >
          <Ionicons name="calendar-outline" size={22} />
          <Text
            style={[
              styles.optionText,
              frequency === "daily" && styles.selectedText,
            ]}
          >
            Daily
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionCard,
            frequency === "weekly" && styles.selectedCard,
          ]}
          onPress={() => setFrequency("weekly")}
        >
          <Ionicons name="calendar" size={22} />
          <Text
            style={[
              styles.optionText,
              frequency === "weekly" && styles.selectedText,
            ]}
          >
            Weekly
          </Text>
        </TouchableOpacity>
      </View>

      {/* Time Picker */}
      <Text style={styles.label}>At what time?</Text>

      <TouchableOpacity
        style={styles.timeCard}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.timeText}>{formatTime(time)}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}

      {/* Dose */}
      <View style={styles.row}>
  <View style={styles.doseCard}>
    <TextInput
      value={pillCount}
      onChangeText={setPillCount}
      keyboardType="numeric"
      style={styles.doseInput}
      placeholder="1"
    />
    <Text style={styles.doseLabel}>Pill</Text>
  </View>

  <View style={styles.doseCard}>
    <TextInput
      value={dose}
      onChangeText={setDose}
      keyboardType="numeric"
      style={styles.doseInput}
      placeholder="500"
    />
    <Text style={styles.doseLabel}>mg</Text>
  </View>
</View>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => {
          console.log({
            name,
            frequency,
            time,
            pillCount,
            dose,
          });
        }}
      >
        <Text style={styles.saveText}>Save Medicine</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  label: {
    fontSize: 14,
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  optionCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: "#2F6FD6",
  },

  optionText: {
    marginTop: 6,
    color: "#444",
  },

  selectedText: {
    color: "#2F6FD6",
    fontWeight: "600",
  },

  timeCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
  },

  timeText: {
    fontSize: 28,
    fontWeight: "700",
  },

  doseCard: {
  flex: 1,
  backgroundColor: "#fff",
  borderRadius: 14,
  padding: 16,
  alignItems: "center",
  justifyContent: "center",
},

 doseInput: {
  fontSize: 22,
  fontWeight: "700",
  textAlign: "center",
  width: "100%",
},

  doseLabel: {
    marginTop: 4,
    color: "#666",
  },

  saveButton: {
    backgroundColor: "#2F6FD6",
    padding: 18,
    borderRadius: 16,
    marginTop: 30,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});