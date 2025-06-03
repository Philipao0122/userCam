import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ name, date, avatar }) {
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image source={avatar} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Hola, {name}</Text>
          <Text style={styles.date}>Hoy es {date}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.notificationButton}>
        <Ionicons name="notifications-outline" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});