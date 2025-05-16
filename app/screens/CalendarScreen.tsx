import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

const CalendarScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Top Calendar */}
      <View style={styles.calendarHeader}>
        <AntDesign name="left" size={20} color="#000" />
        <Text style={styles.dateTitle}>17 MAR 2025</Text>
        <Ionicons name="ellipsis-vertical" size={20} color="#000" />
      </View>

      <View style={styles.calendarGrid}>
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, idx) => (
          <Text key={idx} style={styles.weekdayText}>{day}</Text>
        ))}
        {Array.from({ length: 31 }, (_, i) => (
          <View key={i} style={styles.dayContainer}>
            <Text
              style={[
                styles.dayText,
                i + 1 === 17 && styles.selectedDay
              ]}
            >
              {i + 1}
            </Text>
          </View>
        ))}
      </View>

      {/* Event List */}
      <View style={styles.todayHeader}>
        <Text style={styles.todayText}>Today</Text>
        <Text style={styles.eventsCount}>5 events</Text>
      </View>

      <ScrollView style={styles.eventList}>
        {[
          {
            time: '07:00',
            title: 'Daily Workout',
            desc: 'Push up 10x, Squat 10x',
            end: '08:00',
            color: '#fff',
          },
          {
            time: '09:00',
            title: 'Work on a new project',
            desc: 'Working on a new UI project',
            end: '17:00',
            color: '#fff',
          },
          {
            time: '18:00',
            title: 'Meeting with a client',
            desc: 'Zoom meeting with Zake, Allen, and David',
            end: '19:00',
            color: '#f66',
          },
          {
            time: '19:30',
            title: 'Dinner with John',
            desc: 'At House of Tadu',
            end: '20:30',
            color: '#fff',
          },
        ].map((event, index) => (
          <View key={index} style={[styles.eventItem, { backgroundColor: event.color }]}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeText}>{event.time}</Text>
              <Text style={styles.timeText}>{event.end}</Text>
            </View>
            <View style={styles.detailsColumn}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDesc}>{event.desc}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginBottom: 20,
  },
  weekdayText: {
    color: '#000',
    width: '14.28%',
    textAlign: 'center',
    marginBottom: 6,
  },
  dayContainer: {
    width: '14.28%',
    alignItems: 'center',
    marginVertical: 4,
  },
  dayText: {
    color: '#000',
    fontSize: 14,
    padding: 8,
  },
  selectedDay: {
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  todayText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  eventsCount: {
    color: '#000',
    fontSize: 14,
  },
  eventList: {
    flex: 1,
  },
  eventItem: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
  },
  timeColumn: {
    width: 60,
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#000',
    fontSize: 12,
  },
  detailsColumn: {
    flex: 1,
    marginLeft: 10,
  },
  eventTitle: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  eventDesc: {
    color: '#000',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 24,
    backgroundColor: '#e74c3c',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
