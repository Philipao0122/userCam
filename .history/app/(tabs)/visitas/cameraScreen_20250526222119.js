import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePhoto } from '@/contexts/PhotoContext';

const { width: screenWidth } = Dimensions.get('window');

export default function CameraScreen() {
  const router = useRouter();
  const { addPhoto } = usePhoto();
  const [cameraType, setCameraType] = useState('back');
  const [flash, setFlash] = useState('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const cameraRef = useRef(null);

  const handleTakePhoto = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photoResult = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
          exif: false
        });
        setPhoto(photoResult);
      } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert('Error', 'No se pudo tomar la foto. Inténtalo de nuevo.');
      }
    }
  };
  
  const handleAcceptPhoto = async () => {
    if (!photo) return;
    
    setIsSaving(true);
    
    try {
      // Save photo to context
      await addPhoto(photo.base64);
      
      // Go back to previous screen
      router.back();
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Error', 'No se pudo guardar la foto. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  const handleRetake = () => {
    setPhoto(null);
  };

  // Request camera permission on mount
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

  if (!permission) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.permissionText}>
          Necesitamos permiso para usar la cámara
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Otorgar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo.uri }} style={styles.preview} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleRetake}>
            <Ionicons name="camera-reverse" size={24} color="white" />
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.acceptButton, isSaving && styles.disabledButton]} 
            onPress={handleAcceptPhoto}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="checkmark" size={24} color="white" />
                <Text style={[styles.buttonText, styles.acceptButtonText]}>Accept</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Photo preview view
  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo.uri }} style={styles.preview} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.retakeButton]}
            onPress={handleRetake}
            disabled={isSaving}
          >
            <Ionicons name="camera-reverse" size={24} color="white" />
            <Text style={styles.actionButtonText}>Volver a tomar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton, isSaving && styles.disabledButton]} 
            onPress={handleAcceptPhoto}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="checkmark" size={24} color="white" />
                <Text style={styles.actionButtonText}>Aceptar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Camera view
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={cameraType}
        flash={flash}
        ref={cameraRef}
        onCameraReady={handleCameraReady}
      >
        <View style={styles.overlay}>
          <View style={styles.topControls}>
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={toggleFlash}
            >
              <MaterialIcons 
                name={flash === 'on' ? 'flash-on' : flash === 'off' ? 'flash-off' : 'flash-auto'}
                size={32} 
                color="white" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={toggleCameraFacing}
            >
              <MaterialIcons 
                name="flip-camera-ios" 
                size={32} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.bottomControls}>
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={handleTakePhoto}
              disabled={!isCameraReady}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
      
      <TouchableOpacity 
        style={styles.cancelButton} 
        onPress={handleCancel}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
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
   
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
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
  },
  camera: {
    flex: 1,
  },
  header: {
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 30, // Space above the navigation
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30, // Space below the capture button
    backgroundColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  cancelButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#000',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
  },
  retakeButton: {
    backgroundColor: '#666',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
