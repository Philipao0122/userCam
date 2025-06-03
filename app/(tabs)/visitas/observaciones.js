import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Check, ChevronLeft } from 'lucide-react-native';

export default function ObservacionesScreen() {
  const router = useRouter();
  const [observations, setObservations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get visit data from navigation params
  const { visitData } = useLocalSearchParams();
  const visit = visitData ? JSON.parse(visitData) : {};

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically send the data to your backend
      console.log('Submitting observations:', {
        ...visit,
        observaciones: observations,
        fechaFin: new Date().toISOString(),
        estado: 'completada'
      });
      
      // Show success message and navigate back
      Alert.alert(
        '¡Visita Completada!',
        'La información de la visita ha sido guardada exitosamente.',
        [
          {
            text: 'Aceptar',
            onPress: () => router.replace('/(tabs)/visitas')
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting observations:', error);
      Alert.alert('Error', 'No se pudo guardar la información. Por favor, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          disabled={isSubmitting}
        >
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Observaciones</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>Escribe tus observaciones sobre la visita:</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe aquí tus observaciones..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          value={observations}
          onChangeText={setObservations}
          editable={!isSubmitting}
        />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting || !observations.trim()}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Enviando...' : 'Finalizar Visita'}
          </Text>
          {!isSubmitting && <Check size={20} color="white" style={styles.icon} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  icon: {
    marginLeft: 4,
  },
});
