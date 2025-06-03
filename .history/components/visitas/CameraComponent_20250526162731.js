import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Modal, Image } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Camera as CameraIcon, X, CheckCircle, RotateCw } from 'lucide-react-native';

export default function CameraComponent({ isVisible, onClose, onPhotoTaken }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(ExpoCamera.Constants.Type.back);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      if (mediaStatus.status !== 'granted') {
        alert('Se necesita permiso para guardar imágenes en la galería');
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
          exif: true
        });
        setCapturedImage(photo.uri);
      } catch (error) {
        console.error('Error al tomar la foto:', error);
      }
    }
  };

  const savePhoto = async () => {
    if (capturedImage) {
      try {
        const asset = await MediaLibrary.createAssetAsync(capturedImage);
        onPhotoTaken(capturedImage);
        setCapturedImage(null);
        onClose();
      } catch (error) {
        console.error('Error al guardar la foto:', error);
      }
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No se tiene acceso a la cámara</Text>;
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
                style={[styles.button, styles.saveButton]} 
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
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeButton: {
    padding: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },
});
