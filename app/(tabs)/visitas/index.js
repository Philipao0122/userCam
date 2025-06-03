import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import VisitaCard from '../../../components/visitas/VisitaCard';

export default function VisitasScreen() {
  const router = useRouter();

  const visitasPendientes = [
    {
      id: '1',
      clientName: 'Cliente ABC',
      address: 'Calle Principal 123',
      time: '10:00 AM',
      tasks: [
        { title: 'Revisión inicial', duration: '15min' },
        { title: 'Inspección equipos', duration: '30min' },
        { title: 'Reporte final', duration: '15min' }
      ]
    },
    {
      id: '2',
      clientName: 'Cliente XYZ',
      address: 'Avenida Central 456',
      time: '2:00 PM',
      tasks: [
        { title: 'Mantenimiento', duration: '45min' },
        { title: 'Pruebas', duration: '20min' }
      ]
    }
  ];

  const handleVisitaPress = (visitaId) => {
    router.push(`/visitas/visita-activa?id=${visitaId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Visitas Pendientes</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {visitasPendientes.map((visita) => (
          <VisitaCard
            key={visita.id}
            visita={visita}
            onPress={() => handleVisitaPress(visita.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});