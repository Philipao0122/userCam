import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';

const CameraComponent = ({ onPhotoTaken, onClose }) => {
  // Usar CameraType.back para la cámara trasera por defecto
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [flash, setFlash] = useState('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [photo, setPhoto] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null);

  // Solicitar permisos al montar el componente
  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
      if (!mediaPermission?.granted) {
        await requestMediaPermission();
      }
    })();
  }, []);

  const toggleCameraFacing = () => {
    setCameraType(current => 
      current === CameraType.back ? CameraType.front : CameraType.back
    );
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
        const options = {
          quality: 0.8,
          base64: true,
          exif: false,
          skipProcessing: false,
        };
        
        const photoResult = await cameraRef.current.takePictureAsync(options);
        setPhoto(photoResult);
        
        // Si se proporcionó el callback, llamarlo con la foto
        if (onPhotoTaken) {
          onPhotoTaken(photoResult);
        }
      } catch (error) {
        console.error('Error al tomar la foto:', error);
      }
    }
  };

  const handleSavePhoto = async () => {
    if (photo && mediaPermission?.granted) {
      try {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        // Opcional: Mostrar algún mensaje de éxito
      } catch (error) {
        console.error('Error al guardar la foto:', error);
      }
    }
  };

  const handleRetakePhoto = () => {
    setPhoto(null);
  };

  // Si no hay permisos o están cargando
  if (!permission) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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

  // Si hay una foto tomada, mostrar la vista previa
  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo.uri }} style={styles.preview} />
        <View style={styles.previewButtons}>
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetakePhoto}>
            <Ionicons name="arrow-undo" size={24} color="white" />
            <Text style={styles.buttonText}>Volver a tomar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton} onPress={onClose}>
            <Ionicons name="checkmark" size={24} color="white" />
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Vista de la cámara
  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={cameraType}
        flash={flash}
        ref={cameraRef}
        onCameraReady={handleCameraReady}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
            <MaterialIcons 
              name={flash === 'on' ? 'flash-on' : flash === 'off' ? 'flash-off' : 'flash-auto'} 
              size={28} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.captureButton} 
            onPress={handleTakePhoto}
            disabled={!isCameraReady}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.flipButton} 
            onPress={toggleCameraFacing}
            disabled={!isCameraReady}
          >
            <Ionicons name="camera-reverse" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  flipButton: {
    position: 'absolute',
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
  },
  previewButtons: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white',
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34C759',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraComponent;