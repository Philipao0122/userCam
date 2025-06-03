import React, { createContext, useContext, useState } from 'react';

const PhotoContext = createContext();

export const PhotoProvider = ({ children }) => {
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);

  const addPhoto = (photoBase64) => {
    const newPhoto = {
      id: Date.now().toString(),
      base64: photoBase64,
      timestamp: new Date().toISOString()
    };
    
    setPhotos(prev => [...prev, newPhoto]);
    setCurrentPhoto(newPhoto);
    return newPhoto;
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    if (currentPhoto?.id === photoId) {
      setCurrentPhoto(null);
    }
  };

  const clearPhotos = () => {
    setPhotos([]);
    setCurrentPhoto(null);
  };

  return (
    <PhotoContext.Provider 
      value={{
        photos,
        currentPhoto,
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
