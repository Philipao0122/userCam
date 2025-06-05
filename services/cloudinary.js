import * as FileSystem from 'expo-file-system';

const CLOUDINARY_CLOUD_NAME = 'diqfa2lfz';
const CLOUDINARY_UPLOAD_PRESET = 'user_uploads';

export const uploadToCloudinary = async (base64Image) => {
  console.log('🚀 Iniciando subida a Cloudinary...');
  console.log('📝 Longitud del base64:', base64Image?.length || 'No definido');
  
  try {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    console.log('🌐 URL de Cloudinary:', uploadUrl);
    
    const formData = new FormData();
    const fileData = `data:image/jpg;base64,${base64Image}`;
    formData.append('file', fileData);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    console.log('📤 Datos del formulario preparados');
    console.log('📎 Tamaño del archivo (bytes):', fileData.length);
    console.log('🔑 Usando preset:', CLOUDINARY_UPLOAD_PRESET);

    console.log('⏳ Enviando solicitud a Cloudinary...');
    const startTime = Date.now();
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const responseTime = Date.now() - startTime;
    console.log(`✅ Respuesta recibida en ${responseTime}ms`);
    console.log('📥 Estado de la respuesta:', response.status, response.statusText);
    
    const responseData = await response.json();
    console.log('📦 Datos de la respuesta:', JSON.stringify({
      status: response.status,
      statusText: response.statusText,
      data: {
        ...responseData,
        secure_url: responseData.secure_url ? 'URL_RECIBIDA' : 'NO_DISPONIBLE',
        public_id: responseData.public_id || 'NO_DISPONIBLE',
        bytes: responseData.bytes || 'NO_DISPONIBLE'
      }
    }, null, 2));
    
    if (response.ok) {
      console.log('🎉 ¡Imagen subida exitosamente!');
      console.log('🔗 URL de la imagen:', responseData.secure_url);
      console.log('🆔 ID Público:', responseData.public_id);
      console.log('📏 Tamaño (bytes):', responseData.bytes);
      
      return {
        success: true,
        url: responseData.secure_url,
        publicId: responseData.public_id,
        bytes: responseData.bytes,
        format: responseData.format,
        width: responseData.width,
        height: responseData.height
      };
    } else {
      console.error('❌ Error en la respuesta de Cloudinary:', {
        status: response.status,
        statusText: response.statusText,
        error: responseData.error || 'Error desconocido',
        headers: Object.fromEntries(response.headers.entries())
      });
      
      const errorMessage = responseData.error?.message || 'Error al subir la imagen';
      console.error('💥 Mensaje de error:', errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        status: response.status,
        responseData
      };
    }
  } catch (error) {
    console.error('🔥 Error crítico en uploadToCloudinary:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
      type: typeof error
    });
    
    if (error.response) {
      console.error('📡 Detalles de la respuesta del error:', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      });
    }
    
    return {
      success: false,
      error: error.message || 'Error al procesar la imagen',
      errorDetails: {
        name: error.name,
        code: error.code,
        stack: error.stack?.split('\n').slice(0, 3).join('\n') + '...'
      }
    };
  }
};
