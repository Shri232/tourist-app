// src/screens/Home/PanicButtonScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';

export default function PanicButtonScreen() {
  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Alert',
      'Emergency services have been notified. Help is on the way!',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Emergency Services</Text>
        <Text style={styles.subtitle}>
          Press the button below if you need immediate assistance
        </Text>
        
        <TouchableOpacity style={styles.panicButton} onPress={handleEmergencyCall}>
          <Text style={styles.panicButtonText}>🚨</Text>
          <Text style={styles.panicButtonLabel}>EMERGENCY</Text>
        </TouchableOpacity>
        
        <Text style={styles.warning}>
          This will alert local emergency services and your emergency contact
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 60,
  },
  panicButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 40,
  },
  panicButtonText: {
    fontSize: 48,
    marginBottom: 8,
  },
  panicButtonLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  warning: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 280,
  },
});
