// src/screens/Home/HomeScreen.js
import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView 
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { touristId, logout } = useContext(AuthContext);

  const navigateToMap = () => {
    navigation.navigate('Map');
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToPanicButton = () => {
    navigation.navigate('PanicButton');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to SmartTourist</Text>
          <Text style={styles.subtitle}>Tourist ID: {touristId}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={navigateToMap}>
            <View style={styles.actionIcon}>
              <Text style={styles.iconText}>🗺️</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Explore Map</Text>
              <Text style={styles.actionSubtitle}>View interactive tourist map</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={navigateToProfile}>
            <View style={styles.actionIcon}>
              <Text style={styles.iconText}>👤</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>My Profile</Text>
              <Text style={styles.actionSubtitle}>View and edit your information</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={navigateToPanicButton}>
            <View style={styles.actionIcon}>
              <Text style={styles.iconText}>🚨</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Emergency</Text>
              <Text style={styles.actionSubtitle}>Quick access to help</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tourist Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Welcome to the Smart Tourist system! Use the map to explore nearby attractions, 
              manage your profile, and access emergency services when needed.
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});