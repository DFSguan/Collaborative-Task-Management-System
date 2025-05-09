import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

const CalendarScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar Screen</Text>
      <Image
        source={{ uri: 'https://robohash.org/wue1fypk' }}
        style={styles.avatar}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
})

export default CalendarScreen
