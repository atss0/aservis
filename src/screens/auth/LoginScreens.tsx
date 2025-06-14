import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Iconify } from 'react-native-iconify';
import Colors from '../../styles/Colors';
import { FontFamily, FontSizes } from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = 'E-posta veya telefon numarası gereklidir';
    } else if (!isValidEmail(email) && !isValidPhone(email)) {
      newErrors.email = 'Geçerli bir e-posta veya telefon numarası giriniz';
    }
    
    if (!password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  };

  const handleLogin = () => {
    if (validateForm()) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        // Navigate to main app
        // navigation.replace('MainTabs');
      }, 1500);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>Hoş Geldiniz</Text>
            <Text style={styles.subtitle}>
              Çocuğunuzun servis durumunu takip etmek için giriş yapın
            </Text>
            
            <CustomInput
              label="E-posta veya Telefon"
              placeholder="E-posta adresinizi veya telefon numaranızı girin"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              error={errors.email}
              icon="mdi:email-outline"
            />
            
            <CustomInput
              label="Şifre"
              placeholder="Şifrenizi girin"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
              icon="mdi:lock-outline"
            />
            
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </TouchableOpacity>
            
            <CustomButton
              title="Giriş Yap"
              onPress={handleLogin}
              type="primary"
              size="large"
              loading={loading}
              style={styles.loginButton}
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2023 Servis Takip. Tüm hakları saklıdır.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wScale(24),
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: hScale(60),
    marginBottom: hScale(40),
  },
  logo: {
    width: wScale(180),
    height: hScale(80),
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.xxlarge),
    color: Colors.neutral.grey5,
    marginBottom: hScale(8),
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey4,
    marginBottom: hScale(32),
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: hScale(24),
  },
  forgotPasswordText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.primary.main,
  },
  loginButton: {
    width: '100%',
    marginBottom: hScale(24),
  },
  footer: {
    marginTop: 'auto',
    marginBottom: hScale(24),
    alignItems: 'center',
  },
  footerText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
  },
});

export default LoginScreen;
