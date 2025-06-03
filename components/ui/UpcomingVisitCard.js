import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

export default function UpcomingVisitCard({ 
  clientName, 
  meetingType, 
  date, 
  value, 
  iconBg, 
  icon, 
  iconColor,
  onPress 
}) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.contentContainer}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <FontAwesome name={icon} size={22} color={iconColor} />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.clientName}>{clientName}</Text>
          <Text style={styles.meetingType}>{meetingType}</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#666" style={styles.detailIcon} />
            <Text style={styles.dateText}>{date}</Text>
          </View>
          <Text style={styles.value}>{value}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    padding: 16,
  },
  contentContainer: {
    flexDirection: 'row',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  meetingType: {
    fontSize: 14,
    color: '#666',
  },
  detailsContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});