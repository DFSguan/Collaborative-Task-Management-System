import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const NotificationScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Notification</Text>
          <TouchableOpacity>
            <Text style={styles.menuIcon}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tabActive}>
            <Text style={styles.tabActiveText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Unread</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>I was mentioned</Text>
          </TouchableOpacity>
        </View>

        {/* Today Section */}
        <Text style={styles.sectionTitle}>Today</Text>

        <View style={styles.card}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png' }}
            style={styles.avatar}
          />
          <View style={styles.cardContent}>
            <Text style={styles.automationText}>Automation · 1 hr ago</Text>
            <Text style={styles.cardText}>An email was sent to everyone on this board</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Image
            source={{ uri: 'https://i.ibb.co/xmS5jfT/avatar.png' }}
            style={styles.avatar}
          />
          <View style={styles.cardContent}>
            <Text style={styles.automationText}>Automation · 1 hr ago</Text>
            <Text style={styles.cardText}>Event date has arrived! An email was sent to @LaraCraft</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Image
            source={{ uri: 'https://i.ibb.co/9TTH9XL/avatar2.png' }} // Replace with another avatar if needed
            style={styles.avatar}
          />
          <View style={styles.cardContent}>
            <Text style={styles.automationText}>Automation · 1 hr ago</Text>
            <Text style={styles.cardText}>A new document was signed and added to your board</Text>
          </View>
        </View>



        {/* Yesterday Section */}
        <Text style={styles.sectionTitle}>Yesterday</Text>

        <View style={styles.card}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png' }}
            style={styles.avatar}
          />
          <View style={styles.cardContent}>
            <Text style={styles.automationText}>Automation · 1 hr ago</Text>
            <Text style={styles.cardText}>An email was sent to everyone on this board</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuIcon: {
    fontSize: 22,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#EAEAEA',
  },
  tabActive: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FF6B57',
  },
  tabText: {
    color: '#333',
  },
  tabActiveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  automationText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
  },
  swipeCard: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  swipeContent: {
    flex: 1,
  },
  deleteIcon: {
    paddingHorizontal: 12,
  },
});