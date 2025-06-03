import { View, StyleSheet } from 'react-native';
import HomeScreen from '@/components/screens/HomeScreen';

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});