import { Stack } from 'expo-router';
import { PhotoProvider } from '@/contexts/PhotoContext';

export default function VisitasLayout() {
  return (
    <PhotoProvider>
      <Stack>
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="visita-activa" 
        options={{
          title: 'Visita Activa',
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="cameraScreen" 
        options={{
          title: 'Tomar Foto',
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="reporte" 
        options={{
          title: 'Reporte',
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: false
        }}
      />
      </Stack>
    </PhotoProvider>
  );
}