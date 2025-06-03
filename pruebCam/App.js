import React, { useState, useEffect, useRef } from 'react';
import { Image, StyleSheet, Text, View, Alert } from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from './Button'; // Tu botón personalizado

export default function App() {
  const [cameraPermissions, setCameraPermissions] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
      setCameraPermissions(cameraStatus === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        setImage(photo.uri);
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  };

  const saveImage = async () => {
    try {
      await MediaLibrary.createAssetAsync(image);
      Alert.alert('Éxito', 'Imagen guardada en la galería');
      setImage(null);
    } catch (error) {
      console.error('Error al guardar la imagen:', error);
    }
  };

  const retake = () => {
    setImage(null);
  };

  const toggleCameraType = () => {
    setType((prevType) =>
      prevType === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const toggleFlash = () => {
    setFlash((prevFlash) =>
      prevFlash === FlashMode.off ? FlashMode.on : FlashMode.off
    );
  };

  if (cameraPermissions === false) {
    return <Text>No se tiene acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      {image ? (
        <Image source={{ uri: image }} style={styles.camera} />
      ) : (
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}
        />
      )}

      <View style={styles.controls}>
        {image ? (
          <>
            <Button title="Repetir" icon="retweet" onPress={retake} />
            <Button title="Guardar" icon="save" onPress={saveImage} />
          </>
        ) : (
          <>
            <View style={styles.topButtons}>
              <Button icon="cycle" onPress={toggleCameraType} />
              <Button
                icon="flash"
                color={flash === FlashMode.on ? 'yellow' : 'white'}
                onPress={toggleFlash}
              />
            </View>
            <Button title="Tomar Foto" icon="camera" onPress={takePicture} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 15,
  },
});
