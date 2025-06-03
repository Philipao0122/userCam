import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text, 
  Modal, 
  Image, 
  ActivityIndicator
} from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';
import { Camera as CameraIcon, X, CheckCircle, RotateCw } from 'lucide-react-native';

export default function CameraComponent({ isVisible, onClose, onPhotoTaken }) {
  // Estados para permisos y configuración de la cámara
  const [cameraPermissions, setCameraPermissions] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(ExpoCamera.Constants.Type.back);
  const [flash, setFlash] = useState(ExpoCamera.Constants.FlashMode.off);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const toggleFlash = () => {
    setFlash(current => 
      current === ExpoCamera.Constants.FlashMode.off 
        ? ExpoCamera.Constants.FlashMode.on 
        : ExpoCamera.Constants.FlashMode.off
    );
  };
  // Referencia a la cámara
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!isClient) return;
    
    let isMounted = true;
    
    const requestPermissions = async () => {
      try {
        const { status } = await ExpoCamera.requestCameraPermissionsAsync();
        if (isMounted) {
          setCameraPermissions(status === 'granted');
        }
      } catch (error) {
        console.error('Error al solicitar permisos de cámara:', error);
        if (isMounted) {
          setCameraPermissions(false);
        }
      }
    };
    
    requestPermissions();
    
    return () => {
      isMounted = false;
    };
  }, [isClient]);

  if (!isVisible) return null;

  // Si no estamos en el cliente, mostrar un indicador de carga
  if (!isClient) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (cameraPermissions === null) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" /></View>;
  }

  if (cameraPermissions === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text>No se ha otorgado permiso para acceder a la cámara</Text>
      </View>
    );
  }

  const takePicture = async () => {
    if (!isClient || !cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: true,
        skipProcessing: Platform.OS === 'android'
      });
      setCapturedImage(photo.uri);
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  };

  const savePhoto = async () => {
    if (!isClient || !capturedImage) return;
    
    try {
      // En el navegador, simplemente devolvemos la URI de la imagen
      // En una aplicación nativa, podrías querer guardar en la galería
      onPhotoTaken(capturedImage);
      setCapturedImage(null);
      onClose();
    } catch (error) {
      console.error('Error al procesar la foto:', error);
    }
  };

  const retakePicture = () => {
    if (isClient) {
      setCapturedImage(null);
    }
  };

  if (cameraPermissions === null) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" /></View>;
  }

  if (cameraPermissions === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text>No se ha otorgado permiso para acceder a la cámara</Text>
      </View>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {capturedImage ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: capturedImage }} style={styles.preview} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={retakePicture}>
                <RotateCw size={24} color="#fff" />
                <Text style={styles.buttonText}>Volver a tomar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, {backgroundColor: '#4CAF50'}]} 
                onPress={savePhoto}
              >
                <CheckCircle size={24} color="#fff" />
                <Text style={styles.buttonText}>Usar foto</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <ExpoCamera 
            ref={cameraRef}
            style={styles.camera} 
            type={type}
            flashMode={flash}
            ratio="16:9"
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.captureButton}
                onPress={takePicture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.flipButton}
                onPress={() => {
                  setType(
                    type === ExpoCamera.Constants.Type.back
                      ? ExpoCamera.Constants.Type.front
                      : ExpoCamera.Constants.Type.back
                  );
                }}
              >
                <CameraIcon size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </ExpoCamera>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  flipButton: {
    position: 'absolute',
    right: 20,
    padding: 10,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
});
