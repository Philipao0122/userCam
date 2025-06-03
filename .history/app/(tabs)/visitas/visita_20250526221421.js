import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Alert, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera as CameraIcon, X, Info, Share2, Trash2 } from 'lucide-react-native';
import TaskTimeline from '@/components/visitas/TaskTimeline';
import Timer from '@/components/visitas/Timer';
import { usePhoto } from '@/contexts/PhotoContext';

const { width: screenWidth } = Dimensions.get('window');

export default function VisitaActiva() {
  const router = useRouter();
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const { photos, removePhoto } = usePhoto();
  const [debugInfo, setDebugInfo] = useState('');
  const [isDebugVisible, setIsDebugVisible] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Mock data - In production, fetch from API
  const visita = {
    id: '123',
    cliente: 'Cliente Ejemplo',
    direccion: 'Calle Falsa 123',
    tareas: [
      { id: '1', descripcion: 'Toma de medidas', completada: false },
      { id: '2', descripcion: 'Fotos del área', completada: false },
      { id: '3', descripcion: 'Revisión de instalaciones', completada: false },
    ],
  };

  const handleTaskComplete = (taskId) => {
    // Update task completion status
    console.log('Task completed:', taskId);
  };

  const handleNextTask = () => {
    if (currentTaskIndex < visita.tareas.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  const handlePrevTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
  };

  const handleOpenCamera = () => {
    router.push('./cameraScreen');
  };

  const handleDebugPhoto = (photo) => {
    console.log('Debugging photo:', photo);
    setDebugInfo(JSON.stringify({
      id: photo.id,
      timestamp: photo.timestamp,
      base64Length: photo.base64 ? photo.base64.length : 0
    }, null, 2));
    setIsDebugVisible(true);
  };

  const handleSharePhoto = async (photo) => {
    try {
      setIsSharing(true);
      // In a real app, you might want to save to a temporary file first
      Alert.alert('Compartir', 'La funcionalidad de compartir se implementará aquí');
    } catch (error) {
      console.error('Error sharing photo:', error);
      Alert.alert('Error', 'No se pudo compartir la foto');
    } finally {
      setIsSharing(false);
    }
  };

  const handleDeletePhoto = (photoId) => {
    Alert.alert(
      'Eliminar foto',
      '¿Estás seguro de que quieres eliminar esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => removePhoto(photoId), style: 'destructive' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{visita.cliente}</Text>
          <Text style={styles.subtitle}>{visita.direccion}</Text>
          
          <View style={styles.timerContainer}>
            <Timer isActive={timerActive} />
            <TouchableOpacity 
              style={[styles.button, timerActive ? styles.stopButton : styles.startButton]}
              onPress={() => setTimerActive(!timerActive)}
              >
              <Text style={styles.buttonText}>
                {timerActive ? 'Detener' : 'Iniciar'} Tiempo
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.taskContainer}>
          <Text style={styles.sectionTitle}>Tareas</Text>
          <TaskTimeline 
            tasks={visita.tareas} 
            currentTaskIndex={currentTaskIndex}
            onTaskComplete={handleTaskComplete}
          />
          
          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              style={[styles.navButton, currentTaskIndex === 0 && styles.disabledButton]}
              onPress={handlePrevTask}
              disabled={currentTaskIndex === 0}
            >
              <Text style={styles.navButtonText}>Anterior</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.navButton, currentTaskIndex >= visita.tareas.length - 1 && styles.disabledButton]}
              onPress={handleNextTask}
              disabled={currentTaskIndex >= visita.tareas.length - 1}
            >
              <Text style={styles.navButtonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.photosSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fotos</Text>
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={handleOpenCamera}
            >
              <CameraIcon size={24} color="white" />
              <Text style={styles.cameraButtonText}>Tomar Foto</Text>
            </TouchableOpacity>
          </View>
          
          {photos.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No hay fotos tomadas</Text>
              <Text style={styles.emptyStateSubtext}>Toma una foto para comenzar</Text>
            </View>
          ) : (
            <View style={styles.photosGrid}>
              {photos.map((photo) => (
                <View key={photo.id} style={styles.photoContainer}>
                  <Image 
                    source={{ uri: `data:image/jpg;base64,${photo.base64}` }} 
                    style={styles.photo} 
                  />
                  <View style={styles.photoActions}>
                    <TouchableOpacity 
                      style={[styles.photoActionButton, styles.infoButton]}
                      onPress={() => handleDebugPhoto(photo)}
                      disabled={isSharing}
                    >
                      <Info size={16} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.photoActionButton, styles.shareButton]}
                      onPress={() => handleSharePhoto(photo)}
                      disabled={isSharing}
                    >
                      <Share2 size={16} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.photoActionButton, styles.deleteButton]}
                      onPress={() => handleDeletePhoto(photo.id)}
                      disabled={isSharing}
                    >
                      <Trash2 size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.photoId}>
                    ID: {photo.id.substring(0, 8)}...
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isDebugVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDebugVisible(false)}
      >
        <View style={styles.debugModal}>
          <View style={styles.debugContent}>
            <View style={styles.debugHeader}>
              <Text style={styles.debugTitle}>Debug Info</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsDebugVisible(false)}
              >
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.debugInfoContainer}>
              <Text style={styles.debugInfo}>{debugInfo}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  taskContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  navButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  navButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  photosSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  cameraButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoContainer: {
    width: (screenWidth - 72) / 2,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    aspectRatio: 3/4,
    backgroundColor: '#e0e0e0',
  },
  photoActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
  },
  photoActionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  infoButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  shareButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.8)',
  },
  deleteButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
  },
  photoId: {
    fontSize: 10,
    color: '#666',
    padding: 4,
    textAlign: 'center',
  },
  debugModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  debugContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  debugHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  debugTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  debugInfoContainer: {
    maxHeight: '80%',
  },
  debugInfo: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
});
