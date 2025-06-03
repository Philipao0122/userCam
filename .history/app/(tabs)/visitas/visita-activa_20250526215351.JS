import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Alert, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera as CameraIcon, X, Info, Share2, Trash2, ChevronLeft, ChevronRight, Clock, MapPin, Calendar, CheckCircle2, Circle } from 'lucide-react-native';
import TaskTimeline from '@/components/visitas/TaskTimeline';
import Timer from '@/components/visitas/Timer';
import { usePhoto } from '@/contexts/PhotoContext';

const { width: screenWidth } = Dimensions.get('window');

export default function VisitaActivaV2() {
  const router = useRouter();
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const { photos, removePhoto } = usePhoto();
  const [debugInfo, setDebugInfo] = useState('');
  const [isDebugVisible, setIsDebugVisible] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // State for tasks with deadline-based timers
  const [tasks, setTasks] = useState([
    { 
      id: '1', 
      descripcion: 'Toma de medidas', 
      completada: false,
      tiempoEstimado: 15, // in minutes
      tiempoInicio: null,
      tiempoFin: null,
      tiempoRestante: null,
      temporizador: null
    },
    { 
      id: '2', 
      descripcion: 'Fotos del área', 
      completada: false,
      tiempoEstimado: 10,
      tiempoInicio: null,
      tiempoFin: null,
      tiempoRestante: null,
      temporizador: null
    },
    { 
      id: '3', 
      descripcion: 'Revisión de instalaciones', 
      completada: false,
      tiempoEstimado: 20,
      tiempoInicio: null,
      tiempoFin: null,
      tiempoRestante: null,
      temporizador: null
    },
  ]);
  
  // State for the active deadline timer
  const [activeDeadline, setActiveDeadline] = useState(null);
  
  // Effect to handle the active deadline timer
  useEffect(() => {
    if (!activeDeadline) return;
    
    const timer = setInterval(() => {
      setTasks(currentTasks => 
        currentTasks.map(task => {
          if (task.id === activeDeadline.taskId && task.tiempoRestante > 0) {
            const newTimeRemaining = task.tiempoRestante - 1;
            
            // If time's up, mark as completed
            if (newTimeRemaining <= 0) {
              clearInterval(timer);
              return {
                ...task,
                completada: true,
                tiempoRestante: 0,
                tiempoFin: new Date(),
                temporizador: null
              };
            }
            
            return {
              ...task,
              tiempoRestante: newTimeRemaining
            };
          }
          return task;
        })
      );
    }, 1000);
    
    return () => clearInterval(timer);
  }, [activeDeadline]);

  // Mock data - In production, fetch from API
  const visita = {
    id: '123',
    cliente: 'Cliente Ejemplo',
    direccion: 'Calle Falsa 123, Santiago',
    fecha: '26 Mayo 2025',
    hora: '14:30 - 15:30',
  };

  // Toggle task completion and manage deadline timer
  const toggleTaskCompletion = (taskId) => {
    setTasks(currentTasks => {
      return currentTasks.map(task => {
        if (task.id === taskId) {
          const now = new Date();
          const isCompleting = !task.completada;
          
          // If starting a new task, set up the deadline timer
          if (isCompleting && !task.completada) {
            const tiempoRestante = task.tiempoEstimado * 60; // Convert to seconds
            
            // Clear any existing timer for this task
            if (task.temporizador) {
              clearInterval(task.temporizador);
            }
            
            // Set the active deadline
            setActiveDeadline({
              taskId: task.id,
              endsAt: new Date(now.getTime() + tiempoRestante * 1000)
            });
            
            return {
              ...task,
              tiempoInicio: now,
              tiempoRestante: tiempoRestante,
              completada: false
            };
          } 
          // If manually completing a task
          else if (!isCompleting && task.completada) {
            // Clear the timer if it exists
            if (task.temporizador) {
              clearInterval(task.temporizador);
            }
            
            return {
              ...task,
              completada: false,
              tiempoRestante: null,
              tiempoFin: null,
              temporizador: null
            };
          }
        }
        // If another task is being started, cancel any existing timers
        else if (task.tiempoInicio && !task.completada) {
          if (task.temporizador) {
            clearInterval(task.temporizador);
          }
          return {
            ...task,
            tiempoRestante: null,
            temporizador: null
          };
        }
        return task;
      });
    });
  };

  // Format time in seconds to MM:SS or HH:MM:SS if more than an hour
  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '--:--';
    
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate time remaining for display
  const getTimeRemainingDisplay = (task) => {
    if (task.completada) return 'Completada';
    if (!task.tiempoRestante) return `${task.tiempoEstimado} min`;
    
    const mins = Math.floor(task.tiempoRestante / 60);
    const secs = task.tiempoRestante % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
    router.push('/(tabs)/visitas/cameraScreen');
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visita Técnica</Text>
        <View style={styles.headerIcon}>
          <CheckCircle2 size={24} color="#4CAF50" />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Client Info */}
        <View style={styles.clientCard}>
          <Text style={styles.clientName}>{visita.cliente}</Text>
          
          <View style={styles.infoRow}>
            <MapPin size={16} color="#666" />
            <Text style={styles.infoText}>{visita.direccion}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Calendar size={16} color="#666" />
            <Text style={styles.infoText}>{visita.fecha}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Clock size={16} color="#666" />
            <Text style={styles.infoText}>{visita.hora}</Text>
          </View>
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tareas</Text>
            <View style={styles.timeHeader}>
              <Text style={styles.timeHeaderText}>Tiempo</Text>
            </View>
          </View>
          
          <View style={styles.taskList}>
            {tasks.map((tarea) => (
              <TouchableOpacity 
                key={tarea.id} 
                style={[styles.taskItem, tarea.completada && styles.taskCompleted]}
                onPress={() => toggleTaskCompletion(tarea.id)}
                activeOpacity={0.7}
              >
                <View style={styles.taskContent}>
                  <View style={styles.taskInfo}>
                    <View style={[styles.taskIndicator, tarea.completada && styles.taskIndicatorCompleted]}>
                      {tarea.completada ? (
                        <CheckCircle2 size={20} color="#4CAF50" />
                      ) : (
                        <Circle size={20} color="#E0E0E0" />
                      )}
                    </View>
                    <Text style={[styles.taskText, tarea.completada && styles.taskTextCompleted]}>
                      {tarea.descripcion}
                    </Text>
                  </View>
                  
                  <View style={styles.taskTime}>
                    <Text 
                      style={[
                        styles.timeText,
                        tarea.completada && styles.timeTextCompleted,
                        tarea.tiempoRestante && tarea.tiempoRestante < 60 && styles.timeWarning
                      ]}
                    >
                      {getTimeRemainingDisplay(tarea)}
                    </Text>
                    {tarea.tiempoRestante !== null && !tarea.completada && (
                      <Text style={styles.timeLabel}>
                        {tarea.tiempoRestante > 0 ? 'Restante' : 'Tiempo agotado'}
                      </Text>
                    )}
                  </View>
                </View>
                
                {!tarea.completada && tarea.tiempoInicio && (
                  <View style={styles.timerActive}>
                    <View style={styles.timerDot} />
                    <Text style={styles.timerText}>En progreso</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Photos Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fotos</Text>
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={handleOpenCamera}
            >
              <CameraIcon size={20} color="white" />
              <Text style={styles.cameraButtonText}>Tomar Foto</Text>
            </TouchableOpacity>
          </View>
          
          {photos.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No hay fotos tomadas</Text>
              <Text style={styles.emptyStateSubtext}>Toma una foto para comenzar</Text>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosScroll}
            >
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
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
       
        </View>
        <TouchableOpacity 
          style={[styles.footerButton, timerActive ? styles.stopButton : styles.startButton]}
          onPress={() => setTimerActive(!timerActive)}
        >
          <Text style={styles.footerButtonText}>
            {timerActive ? 'Detener' : 'Iniciar'} Tiempo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Debug Modal */}
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
  headerIcon: {
    width: 40,
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  clientCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clientName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeHeader: {
    marginRight: 16,
  },
  timeHeaderText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  taskList: {
    marginTop: 8,
  },
  taskItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  taskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIndicator: {
    marginRight: 12,
  },
  taskIndicatorCompleted: {
    opacity: 0.8,
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  taskTextCompleted: {
    color: '#999',
  },
  taskTime: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  timeTextCompleted: {
    color: '#4CAF50',
  },
  timeWarning: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  timeLabel: {
    fontSize: 10,
    color: '#4CAF50',
    marginTop: 2,
  },
  timerActive: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  timerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFC107',
    marginRight: 6,
  },
  timerText: {
    fontSize: 12,
    color: '#FFA000',
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
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#999',
  },
  photosScroll: {
    paddingVertical: 8,
  },
  photoContainer: {
    width: 150,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  photo: {
    width: '100%',
    aspectRatio: 3/4,
    backgroundColor: '#E0E0E0',
  },
  photoActions: {
    position: 'absolute',
    bottom: 8,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  footerButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
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
    borderBottomColor: '#E0E0E0',
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
