import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera as CameraIcon, X } from 'lucide-react-native';
import TaskTimeline from '@/components/visitas/TaskTimeline';
import Timer from '@/components/visitas/Timer';
import { getPhotoUri } from '@/app/(tabs)/visitas/utils/photoStorage';

const { width: screenWidth } = Dimensions.get('window');

export default function VisitaActivaScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
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
      // Última tarea, ir al reporte
      router.push('/visitas/reporte');
    }
  };

  const removePhoto = (id) => {
    setCapturedPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const handleOpenCamera = () => {
    router.push({
      pathname: '/visitas/camera-screen',
      params: {
        onPhotoTaken: `(photoData) => {
          const newPhoto = {
            id: Date.now().toString(),
            uri: photoData.uri,
            base64: photoData.base64
          };
          const updatedPhotos = [...${JSON.stringify(capturedPhotos)}, newPhoto];
          return updatedPhotos;
        }`
      }
    });
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
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Evidencia Fotográfica</Text>
              <TouchableOpacity 
                style={styles.addPhotoButton}
                onPress={handleOpenCamera}
              >
                <CameraIcon size={20} color="#007AFF" />
                <Text style={styles.addPhotoText}>Tomar Foto</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.photosGrid}>
              {capturedPhotos.map((photo) => (
                <View key={photo.id} style={styles.photoContainer}>
                  <Image 
                    source={{ uri: photo.uri || `data:image/jpeg;base64,${photo.base64}` }} 
                    style={styles.photo} 
                  />
                  <TouchableOpacity 
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(photo.id)}
                  >
                    <X size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              
              {capturedPhotos.length === 0 && (
                <View style={styles.emptyState}>
                  <CameraIcon size={40} color="#CCCCCC" />
                  <Text style={styles.emptyStateText}>Toma una foto para agregar evidencia</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Timer 
          isActive={timerActive}
          duration={parseInt(visita.tasks[currentTaskIndex].duration)} 
        />
        
        <View style={styles.footerButtons}>
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -4,
  },
  photoContainer: {
    width: (screenWidth - 72) / 3, // 3 columnas con margen
    height: (screenWidth - 72) / 3,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
    marginTop: 8,
  },
  emptyStateText: {
    marginTop: 8,
    color: '#999',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addPhotoText: {
    marginLeft: 6,
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 14,
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