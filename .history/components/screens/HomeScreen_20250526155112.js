import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Header from '../ui/Header';
import StatCard from '../ui/StatCard';
import QuickActionButton from '../ui/QuickActionButton';
import UpcomingVisitCard from '../ui/UpcomingVisitCard';
import { getCurrentDate } from '@/utils/dateUtils';

export default function HomeScreen() {
  // Static data for MVP
  const userData = {
    name: 'Juan',
    avatar: require('@/assets/images/avatar').default
  };

  const stats = [
    { title: 'Pendientes', value: '32', icon: 'coffee', bgColor: '#FFF5EC', iconColor: '#E67E22' },
    { title: 'Completadas', value: '145', icon: 'flag-checkered', bgColor: '#F8F9FA', iconColor: '#2C3E50' }
  ];

  const quickActions = [
    { title: 'Visitas', icon: 'fire', bgColor: '#FFEDE9', iconColor: '#E74C3C' },
    { title: 'Clientes', icon: 'user-plus', bgColor: '#EBF5FF', iconColor: '#3498DB' },
    { title: 'Ubicaciones', icon: 'map-marker', bgColor: '#F3EBFF', iconColor: '#9B59B6' },
    { title: 'Notas', icon: 'bell', bgColor: '#FFF5EB', iconColor: '#F39C12' }
  ];

  const upcomingVisits = [
    {
      id: '1',
      clientName: 'Cliente ABC',
      meetingType: 'Reunión inicial',
      date: '26/04/2024',
      value: '$50.000',
      iconBg: '#E8F5E9',
      icon: 'video',
      iconColor: '#27AE60'
    },
    {
      id: '2',
      clientName: 'Cliente XYZ',
      meetingType: 'Seguimiento',
      date: '27/04/2024',
      value: '$25.000',
      iconBg: '#E3F2FD',
      icon: 'video-camera',
      iconColor: '#2980B9'
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Header name={userData.name} date={getCurrentDate()} avatar={userData.avatar} />
        
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              bgColor={stat.bgColor}
              iconColor={stat.iconColor}
            />
          ))}
        </View>
        
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <QuickActionButton
              key={index}
              title={action.title}
              icon={action.icon}
              bgColor={action.bgColor}
              iconColor={action.iconColor}
            />
          ))}
        </View>
        
        <View style={styles.upcomingVisitsContainer}>
          <Text style={styles.sectionTitle}>Próximas Visitas</Text>
          {upcomingVisits.map((visit) => (
            <UpcomingVisitCard
              key={visit.id}
              clientName={visit.clientName}
              meetingType={visit.meetingType}
              date={visit.date}
              value={visit.value}
              iconBg={visit.iconBg}
              icon={visit.icon}
              iconColor={visit.iconColor}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  upcomingVisitsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
});