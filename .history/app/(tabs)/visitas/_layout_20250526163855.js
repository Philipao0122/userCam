import { Stack } from 'expo-router';

export default function VisitasLayout() {
  return (
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
        name="reporte" 
        options={{
          title: 'Reporte',
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: false
        }}
      />
    </Stack>
  );
}