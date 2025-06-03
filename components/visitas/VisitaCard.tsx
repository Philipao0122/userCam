import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, MapPin } from 'lucide-react-native';

export default function VisitaCard({ visita, onPress }) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.clientName}>{visita.clientName}</Text>
        <View style={styles.timeContainer}>
          <Clock size={16} color="#666" />
          <Text style={styles.time}>{visita.time}</Text>
        </View>
      </View>

      <View style={styles.addressContainer}>
        <MapPin size={16} color="#666" />
        <Text style={styles.address}>{visita.address}</Text>
      </View>

      <View style={styles.tasksContainer}>
        {visita.tasks.map((task, index) => (
          <View key={index} style={styles.task}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskDuration}>{task.duration}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    marginLeft: 4,
    color: '#666',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  address: {
    marginLeft: 4,
    color: '#666',
  },
  tasksContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
  },
  task: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskTitle: {
    color: '#333',
  },
  taskDuration: {
    color: '#666',
  },
});