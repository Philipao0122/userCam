import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';

export default function Timer({ isActive, duration }) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    let interval;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(current => current - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Clock size={24} color={isActive ? '#F15A29' : '#666'} />
      <Text style={[
        styles.time,
        isActive && styles.activeTime
      ]}>
        {formatTime(timeLeft)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  time: {
    marginLeft: 8,
    fontSize: 24,
    fontWeight: '700',
    color: '#666',
  },
  activeTime: {
    color: '#F15A29',
  },
});