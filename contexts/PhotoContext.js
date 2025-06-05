import React, { createContext, useContext, useState } from 'react';
import { uploadToCloudinary } from '@/services/cloudinary';

const PhotoContext = createContext();

export const PhotoProvider = ({ children }) => {
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const addPhoto = async (photoBase64) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Subir a Cloudinary
      const uploadResult = await uploadToCloudinary(photoBase64);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Error al subir la imagen');
      }
      
      const newPhoto = {
        id: Date.now().toString(),
        base64: photoBase64,
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        timestamp: new Date().toISOString()
      };
      
      setPhotos(prev => [...prev, newPhoto]);
      setCurrentPhoto(newPhoto);
      return newPhoto;
    } catch (error) {
      console.error('Error adding photo:', error);
      setUploadError(error.message);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = async (photoId) => {
    // Aquí podrías agregar lógica para eliminar la imagen de Cloudinary si es necesario
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    if (currentPhoto?.id === photoId) {
      setCurrentPhoto(null);
    }
  };

  const clearPhotos = () => {
    setPhotos([]);
    setCurrentPhoto(null);
    setUploadError(null);
  };

  return (
    <PhotoContext.Provider 
      value={{
        photos,
        currentPhoto,
        isUploading,
        uploadError,
        addPhoto,
        removePhoto,
        clearPhotos,
        setCurrentPhoto
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhoto = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhoto must be used within a PhotoProvider');
  }
  return context;
};
