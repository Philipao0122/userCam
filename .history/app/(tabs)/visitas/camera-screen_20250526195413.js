import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';


export default function CameraScreen() {
  const router = useRouter();
  const [cameraType, setCameraType] = useState('back');
  const [flash, setFlash] = useState('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = React.useRef(null);

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    })();
  }, []);

  const toggleCameraFacing = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  };

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const handleTakePhoto = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photoResult = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true
        });
        setPhoto(photoResult);
      } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert('Error', 'No se pudo tomar la foto. Inténtalo de nuevo.');
      }
    }
  };
  
  const handleAcceptPhoto = () => {
    if (photo) {
      // Navegar de vuelta con la foto como parámetro
      navigation.navigate('visita-activa', {
        photo: {
          uri: photo.uri,
          base64: photo.base64 || ''
        }
      });
    }
  };
  
  const handleCancel = () => {
    navigation.goBack();
  };
  
  const handleRetake = () => {
    setPhoto(null);
  };
  
  const handleRetakePhoto = () => {
    setPhoto(null); // Limpiar la foto para volver a la vista de cámara
  };

  // Vista de carga de permisos
  if (!permission) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Cargando permisos...</Text>
      </View>
    );
  }
  
  // Vista de previsualización de foto


  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.permissionText}>
          Necesitamos permiso para acceder a la cámara
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        flashMode={flash}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
            <MaterialIcons 
              name={flash === 'on' ? 'flash-on' : 'flash-off'} 
              size={28} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.captureButton}
            onPress={handleTakePhoto}
            disabled={!isCameraReady}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 30,
    width: 150,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
  },
  acceptButton: {
    backgroundColor: 'rgba(52, 199, 89, 0.8)',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
marginBottom: 220,
    
    
    borderRadius: 35,
    borderWidth: 5,
    borderColor: 'white',
   
    backgroundColor: 'transparent',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
