import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text, 
  Image, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Camera as CameraIcon, X, CheckCircle, RotateCw } from 'lucide-react-native';

const NewCameraComponent = ({ isVisible, onClose, onPhotoTaken }) => {
  // Estados para permisos
  const [cameraPermissions, setCameraPermissions] = useState(null);
  const [mediaLibraryPermissions, setMediaLibraryPermissions] = useState(null);
  
  // Estados para la cámara
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Referencia a la cámara
  const cameraRef = useRef(null);

  // Función para alternar el flash
  const toggleFlash = () => {
    setFlash(current => 
      current === FlashMode.off ? FlashMode.on : FlashMode.off
    );
  };
  
  // Función para alternar entre cámaras
  const toggleCameraType = () => {
    setType(current => 
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  // Efecto para inicializar la cámara y solicitar permisos
  useEffect(() => {
    let isMounted = true;
    
    const initializeCamera = async () => {
      try {
        // Verificar si la cámara está disponible
        const isAvailable = await Camera.isAvailableAsync();
        if (!isAvailable) {
          console.warn('La cámara no está disponible en este dispositivo');
          return;
        }
        
        // Solicitar permisos
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
        
        if (isMounted) {
          setCameraPermissions(cameraStatus === 'granted');
          setMediaLibraryPermissions(mediaStatus === 'granted');
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error al inicializar la cámara:', error);
        if (isMounted) {
          setCameraPermissions(false);
          setMediaLibraryPermissions(false);
        }
      }
    };
    
    initializeCamera();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Función para tomar una foto
  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: true,
        skipProcessing: true
      });
      
      setCapturedImage(photo.uri);
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  };

  // Función para guardar la foto
  const savePhoto = async () => {
    if (!capturedImage) return;
    
    try {
      // Si tenemos permiso para guardar en la galería, lo hacemos
      if (mediaLibraryPermissions) {
        const asset = await MediaLibrary.createAssetAsync(capturedImage);
        console.log('Foto guardada en la galería:', asset.uri);
      }
      
      // Llamamos a la función de retorno con la URI de la imagen
      onPhotoTaken(capturedImage);
      
      // Cerramos la cámara
      setCapturedImage(null);
      onClose();
    } catch (error) {
      console.error('Error al guardar la foto:', error);
    }
  };

  // Función para volver a tomar la foto
  const retakePicture = () => {
    setCapturedImage(null);
  };

  // Si el componente no está visible, no renderizar nada
  if (!isVisible) return null;
  
  // Mostrar indicador de carga mientras se inicializa la cámara
  if (!isInitialized || cameraPermissions === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Inicializando cámara...</Text>
      </View>
    );
  }
  
  // Mostrar mensaje si no se otorgaron los permisos
  if (cameraPermissions === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          No se han otorgado los permisos necesarios para acceder a la cámara.
          Por favor, activa los permisos de cámara en la configuración de tu dispositivo.
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => {
            setCameraPermissions(null);
            // Volver a intentar solicitar permisos
            Camera.requestCameraPermissionsAsync()
              .then(({ status }) => setCameraPermissions(status === 'granted'));
          }}
        >
          <Text style={styles.permissionButtonText}>Intentar de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Si tenemos una imagen capturada, mostrar la vista de previsualización
  if (capturedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedImage }} style={styles.preview} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.retakeButton]}
            onPress={retakePicture}
          >
            <RotateCw size={24} color="#fff" />
            <Text style={styles.buttonText}>Volver a tomar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]}
            onPress={savePhoto}
          >
            <CheckCircle size={24} color="#fff" />
            <Text style={styles.buttonText}>Usar foto</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Vista principal de la cámara
  return (
    <View style={styles.container}>
      <Camera 
        ref={cameraRef}
        style={styles.camera}
        type={type}
        flashMode={flash}
        ratio="16:9"
        onCameraReady={() => setCameraReady(true)}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.flashButton}
            onPress={toggleFlash}
          >
            <Text style={styles.flashText}>
              {flash === FlashMode.on ? 'Flash: ON' : 'Flash: OFF'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.captureButton}
            onPress={takePicture}
            disabled={!cameraReady}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.flipButton}
            onPress={toggleCameraType}
            disabled={!cameraReady}
          >
            <CameraIcon size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
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
    borderColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 40,
  },
  preview: {
    flex: 1,
    width: '100%',
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  retakeButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NewCameraComponent;
