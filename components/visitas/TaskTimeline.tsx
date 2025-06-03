import { View, Text, StyleSheet } from 'react-native';
import { CircleCheck as CheckCircle2, Circle } from 'lucide-react-native';

export default function TaskTimeline({ tasks, currentTaskIndex }) {
  return (
    <View style={styles.container}>
      {tasks.map((task, index) => (
        <View key={task.id} style={styles.taskItem}>
          <View style={styles.iconContainer}>
            {index < currentTaskIndex ? (
              <CheckCircle2 size={24} color="#27AE60" />
            ) : index === currentTaskIndex ? (
              <Circle size={24} color="#F15A29" />
            ) : (
              <Circle size={24} color="#666" />
            )}
            {index < tasks.length - 1 && <View style={styles.line} />}
          </View>
          
          <View style={styles.taskContent}>
            <Text style={[
              styles.taskTitle,
              index === currentTaskIndex && styles.activeTask
            ]}>
              {task.title}
            </Text>
            <Text style={styles.taskDuration}>{task.duration}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  taskItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#EEEEEE',
    marginTop: 8,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  activeTask: {
    color: '#F15A29',
    fontWeight: '700',
  },
  taskDuration: {
    color: '#666',
  },
});