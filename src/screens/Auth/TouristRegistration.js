// src/screens/Auth/TouristRegistration.js
import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { sendOtp, verifyOtpAndRegister } from '../../api/touristApi';
import { AuthContext } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const CustomButton = ({ title, onPress, loading, style, variant = 'primary' }) => (
  <TouchableOpacity 
    style={[
      styles.button, 
      variant === 'secondary' && styles.buttonSecondary,
      loading && styles.buttonDisabled,
      style
    ]} 
    onPress={onPress}
    disabled={loading}
    activeOpacity={0.8}
  >
    {loading ? (
      <ActivityIndicator size="small" color={variant === 'secondary' ? '#2563EB' : '#FFFFFF'} />
    ) : (
      <Text style={[
        styles.buttonText, 
        variant === 'secondary' && styles.buttonTextSecondary
      ]}>
        {title}
      </Text>
    )}
  </TouchableOpacity>
);

const FormInput = ({ label, placeholder, value, onChangeText, keyboardType, style, ...props }) => (
  <View style={[styles.inputContainer, style]}>
    {label && <Text style={styles.inputLabel}>{label}</Text>}
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
    />
  </View>
);


export default function TouristRegistration({ navigation }) {
  const [step, setStep] = useState('otp'); // 'otp' or 'verify'
  const [type, setType] = useState('INDIAN');
  const [mobile, setMobile] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [visaId, setVisaId] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);

  const onSendOtp = async () => {
    if (!mobile) return Alert.alert('Validation', 'Enter mobile number');
    if (type === 'INDIAN' && !/^\d{12}$/.test(aadhaar)) {
      return Alert.alert('Validation', 'Enter 12-digit Aadhaar');
    }
    if (type === 'FOREIGNER' && !visaId) {
      return Alert.alert('Validation', 'Enter Visa ID');
    }
    setLoading(true);
    try {
      await sendOtp({ mobile, type, aadhaar: type === 'INDIAN' ? aadhaar : undefined, visaId: type === 'FOREIGNER' ? visaId : undefined });
      Alert.alert('OTP sent', 'Check backend logs or SMS gateway for OTP');
      setStep('verify');
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyAndRegister = async () => {
    if (!otp) return Alert.alert('Validation', 'Enter OTP');
    if (!name) return Alert.alert('Validation', 'Enter name');
    setLoading(true);
    try {
      const payload = {
        mobile,
        otp,
        type,
        aadhaar: type === 'INDIAN' ? aadhaar : undefined,
        visaId: type === 'FOREIGNER' ? visaId : undefined,
        name,
        age: age ? parseInt(age, 10) : null,
        gender,
        address,
        emergencyContact,
        travelStart: new Date().toISOString(),
        travelEnd: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        consent: true,
      };
      const data = await verifyOtpAndRegister(payload);
      if (data?.touristId) {
        console.log('Registration successful, tourist ID:', data.touristId);
        // Register first
        register(data.touristId);
        console.log('Register function called');
        // Show success message and navigate to Home
        Alert.alert(
          'Registration Successful! 🎉', 
          `Welcome to Smart Tourist!\nYour Tourist ID: ${data.touristId}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', data?.error || 'Registration failed');
      }
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        bounces={false}
        overScrollMode="never"
        nestedScrollEnabled={false}
      >
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Tourist Registration</Text>
            <Text style={styles.subtitle}>
              {step === 'otp' 
                ? 'Enter your details to receive OTP' 
                : 'Complete your registration'
              }
            </Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: step === 'otp' ? '50%' : '100%' }]} />
            </View>
            <Text style={styles.progressText}>
              Step {step === 'otp' ? '1' : '2'} of 2
            </Text>
          </View>

          {/* Tourist Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tourist Type</Text>
            <View style={styles.typeButtonContainer}>
              <TouchableOpacity 
                onPress={() => setType('INDIAN')} 
                style={[
                  styles.typeButton, 
                  type === 'INDIAN' && styles.typeButtonActive
                ]}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.typeButtonText,
                  type === 'INDIAN' && styles.typeButtonTextActive
                ]}>
                  Indian Citizen
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setType('FOREIGNER')} 
                style={[
                  styles.typeButton, 
                  type === 'FOREIGNER' && styles.typeButtonActive
                ]}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.typeButtonText,
                  type === 'FOREIGNER' && styles.typeButtonTextActive
                ]}>
                  Foreign Tourist
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.section}>
            <FormInput
              label="Mobile Number *"
              placeholder="Enter 10-digit mobile number"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              maxLength={10}
            />

            {type === 'INDIAN' ? (
              <FormInput
                label="Aadhaar Number *"
                placeholder="Enter 12-digit Aadhaar number"
                value={aadhaar}
                onChangeText={setAadhaar}
                keyboardType="number-pad"
                maxLength={12}
              />
            ) : (
              <FormInput
                label="Visa ID *"
                placeholder="Enter your Visa ID"
                value={visaId}
                onChangeText={setVisaId}
              />
            )}

            {step === 'verify' && (
              <>
                <FormInput
                  label="OTP *"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                
                <FormInput
                  label="Full Name *"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
                
                <FormInput
                  label="Age"
                  placeholder="Enter your age"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                  maxLength={3}
                />
                
                <FormInput
                  label="Gender"
                  placeholder="Male/Female/Other"
                  value={gender}
                  onChangeText={setGender}
                  autoCapitalize="words"
                />
                
                <FormInput
                  label="Address"
                  placeholder="Enter your address"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={3}
                  style={styles.textArea}
                />
                
                <FormInput
                  label="Emergency Contact"
                  placeholder="Emergency contact number"
                  value={emergencyContact}
                  onChangeText={setEmergencyContact}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {step === 'otp' ? (
              <CustomButton
                title="Send OTP"
                onPress={onSendOtp}
                loading={loading}
              />
            ) : (
              <>
                <CustomButton
                  title="Register"
                  onPress={onVerifyAndRegister}
                  loading={loading}
                />
                <CustomButton
                  title="Back to OTP"
                  onPress={() => setStep('otp')}
                  variant="secondary"
                  style={styles.secondaryButton}
                />
              </>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By registering, you agree to our terms and conditions
            </Text>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  typeButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  typeButtonActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#2563EB',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 52,
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2563EB',
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: '#2563EB',
  },
  secondaryButton: {
    marginTop: 8,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
});
