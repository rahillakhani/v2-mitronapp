import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
import { isValidEmail, isValidPhone } from '@shared/utils';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { signUp } = useAuth();
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    firstName: '',
    lastName: '',
    businessName: '',
    phone: '',
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!formData.email.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!isValidEmail(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (!isValidPhone(formData.phone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    if (formData.role === 'buyer' && (!formData.firstName.trim() || !formData.lastName.trim())) {
      Alert.alert('Error', 'Please enter your first and last name');
      return;
    }

    if (formData.role === 'vendor' && !formData.businessName.trim()) {
      Alert.alert('Error', 'Please enter your business name');
      return;
    }

    if (!formData.agreeToTerms) {
      Alert.alert('Error', 'Please agree to the terms and conditions');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare user data based on role
      const userData = {
        role: formData.role,
        profile: formData.role === 'buyer' ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          addresses: [],
          savedBikes: [],
          preferences: {
            notifications: {
              orderUpdates: true,
              messages: true,
              promotions: true,
              newProducts: false,
            },
            language: 'en',
            currency: 'INR',
          },
        } : {
          businessName: formData.businessName,
          contactPerson: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          businessAddress: {},
          categories: [],
          isApproved: false,
          rating: 0,
          totalOrders: 0,
        },
      };

      await signUp(formData.email.trim(), formData.password, userData);
      Alert.alert('Success', 'Account created successfully!');
      
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
    },
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
    },
    picker: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
    },
    registerButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    registerButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
    },
    registerButtonText: {
      color: theme.colors.white,
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
    },
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    loginText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    loginLink: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
      fontWeight: theme.fontWeight.medium,
      marginLeft: theme.spacing.xs,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: theme.colors.border,
      marginRight: theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    checkboxText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.text,
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create Account</Text>

          {/* Role Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account Type</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={formData.role}
                onValueChange={(value) => setFormData({...formData, role: value})}
              >
                <Picker.Item label="Buyer" value="buyer" />
                <Picker.Item label="Vendor" value="vendor" />
              </Picker>
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Name Fields */}
          {formData.role === 'buyer' ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChangeText={(text) => setFormData({...formData, firstName: text})}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChangeText={(text) => setFormData({...formData, lastName: text})}
                />
              </View>
            </>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Business Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your business name"
                value={formData.businessName}
                onChangeText={(text) => setFormData({...formData, businessName: text})}
              />
            </View>
          )}

          {/* Phone */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
              keyboardType="phone-pad"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
              secureTextEntry
            />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
              secureTextEntry
            />
          </View>

          {/* Terms and Conditions */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setFormData({...formData, agreeToTerms: !formData.agreeToTerms})}
          >
            <View style={[styles.checkbox, formData.agreeToTerms && styles.checkboxChecked]}>
              {formData.agreeToTerms && <Text style={{color: 'white', fontSize: 12}}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              I agree to the Terms and Conditions and Privacy Policy
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
