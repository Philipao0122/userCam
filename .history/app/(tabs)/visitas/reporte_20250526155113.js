import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function ReporteScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    // Here you would submit the report to your backend
    router.push('/visitas');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Reporte de Visita</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notas</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            placeholder="Ingrese sus observaciones..."
          />
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Enviar Reporte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  submitButton: {
    backgroundColor: '#27AE60',
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});