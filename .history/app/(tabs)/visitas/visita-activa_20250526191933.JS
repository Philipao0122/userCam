import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Clock, CircleCheck as CheckCircle2, Camera as CameraIcon } from 'lucide-react-native';
import TaskTimeline from '@/components/visitas/TaskTimeline';
import Timer from '@/components/visitas/Timer';
import CameraComponent from '@/components/visitas/CameraComponent';


export default function VisitaActivaScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);

  // Mock data - In production, fetch from API
  const visita = {
    id,
    clientName: 'Cliente ABC',
    address: 'Calle Principal 123',
    tasks: [
      { id: '1', title: 'Revisión inicial', duration: '15min', status: 'pending' },
      { id: '2', title: 'Inspección equipos', duration: '30min', status: 'pending' },
      { id: '3', title: 'Reporte final', duration: '15min', status: 'pending' }
    ]
  };

  const handleStartTask = () => {
    setTimerActive(true);
  };

  const handleCompleteTask = () => {
    if (currentTaskIndex < visita.tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setTimerActive(false);
      setCapturedPhotos([]);
    } else {
      router.push('/visitas/reporte');
    }
  };

  const handlePhotoTaken = (photoUri) => {
    setCapturedPhotos([...capturedPhotos, photoUri]);
  };

  const currentTask = visita.tasks[currentTaskIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.clientName}>{visita.clientName}</Text>
        <Text style={styles.address}>{visita.address}</Text>
      </View>

      <ScrollView style={styles.content}>
        <TaskTimeline 
          tasks={visita.tasks} 
          currentTaskIndex={currentTaskIndex} 
        />
        
        {timerActive && (
          <View style={styles.cameraSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Evidencia Fotográfica</Text>
              <TouchableOpacity 
                style={styles.addPhotoButton}
                onPress={() => setShowCamera(true)}
              >
                <CameraIcon size={20} color="#007AFF" />
                <Text style={styles.addPhotoText}>Tomar Foto</Text>
              </TouchableOpacity>
            </View>
            
            {capturedPhotos.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
                {capturedPhotos.map((photo, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                    <Text style={styles.photoLabel}>Foto {index + 1}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Timer 
          isActive={timerActive}
          duration={parseInt(visita.tasks[currentTaskIndex].duration)} 
        />
        
        <View style={styles.footerButtons}>
          {timerActive && (
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={() => setShowCamera(true)}
            >
              <CameraIcon size={24} color="#007AFF" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.button, timerActive ? styles.completeButton : styles.startButton]}
            onPress={timerActive ? handleCompleteTask : handleStartTask}
          >
            <Text style={styles.buttonText}>
              {timerActive ? 'Completar Tarea' : 'Iniciar Tarea'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <CameraComponent 
        isVisible={showCamera}
        onClose={() => setShowCamera(false)}
        onPhotoTaken={handlePhotoTaken}
      />
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
  clientName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  address: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#007AFF',
  },
  completeButton: {
    backgroundColor: '#34C759',
  },
  cameraSection: {
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F0F7FF',
    borderRadius: 6,
  },
  addPhotoText: {
    color: '#007AFF',
    marginLeft: 6,
    fontWeight: '500',
  },
  photosContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  photoContainer: {
    marginRight: 12,
    alignItems: 'center',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  photoLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});