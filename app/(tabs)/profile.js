import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Perfil</Text>
      <Text style={styles.subText}>Funcionalidad en desarrollo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
});