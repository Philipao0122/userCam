import { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera as CameraIcon, X } from 'lucide-react-native';
import { CameraView } from 'expo-camera';

export default function PhotoCapture({ onCapture, onClose }) {
  const [camera, setCamera] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text>Se requiere permiso para usar la cámara</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Dar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      onCapture(photo);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={ref => setCamera(ref)}
        style={styles.camera}
      >
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <X size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.captureButton}
            onPress={takePicture}
          >
            <CameraIcon size={32} color="#FFF" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
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
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 8,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F15A29',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButton: {
    backgroundColor: '#F15A29',
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});