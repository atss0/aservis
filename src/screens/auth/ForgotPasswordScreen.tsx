"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native"
import { Iconify } from "react-native-iconify"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"
import CustomInput from "../../components/CustomInput"
import CustomButton from "../../components/CustomButton"

interface ForgotPasswordScreenProps {
  navigation: any
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleResetPassword = () => {
    if (!email) {
      setError("E-posta adresi gereklidir")
      return
    }

    if (!validateEmail(email)) {
      setError("Geçerli bir e-posta adresi giriniz")
      return
    }

    setError("")
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1500)
  }

  const handleBackToLogin = () => {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
            <Iconify icon="mdi:arrow-left" size={wScale(24)} color={Colors.neutral.grey5} />
          </TouchableOpacity>

          <View style={styles.contentContainer}>
            <Text style={styles.title}>Şifremi Unuttum</Text>
            <Text style={styles.subtitle}>
              Şifrenizi sıfırlamak için e-posta adresinizi girin. Size şifre sıfırlama talimatlarını içeren bir e-posta
              göndereceğiz.
            </Text>

            {!success ? (
              <>
                <CustomInput
                  label="E-posta"
                  placeholder="E-posta adresinizi girin"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text)
                    setError("")
                  }}
                  keyboardType="email-address"
                  error={error}
                  icon="mdi:email-outline"
                />

                <CustomButton
                  title="Şifremi Sıfırla"
                  onPress={handleResetPassword}
                  type="primary"
                  size="large"
                  loading={loading}
                  style={styles.resetButton}
                />
              </>
            ) : (
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <Iconify icon="mdi:check-circle" size={wScale(64)} color={Colors.status.success} />
                </View>
                <Text style={styles.successTitle}>E-posta Gönderildi</Text>
                <Text style={styles.successText}>
                  Şifre sıfırlama talimatları {email} adresine gönderildi. Lütfen e-posta kutunuzu kontrol edin.
                </Text>
                <CustomButton
                  title="Giriş Sayfasına Dön"
                  onPress={handleBackToLogin}
                  type="primary"
                  size="large"
                  style={styles.backToLoginButton}
                />
              </View>
            )}

            <TouchableOpacity style={styles.loginLinkContainer} onPress={handleBackToLogin}>
              <Text style={styles.loginLinkText}>Giriş sayfasına dön</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

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
  backButton: {
    marginTop: hScale(16),
    width: wScale(40),
    height: wScale(40),
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    marginTop: hScale(24),
    alignItems: "center",
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.xxlarge),
    color: Colors.neutral.grey5,
    marginBottom: hScale(16),
    alignSelf: "flex-start",
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey4,
    marginBottom: hScale(32),
    alignSelf: "flex-start",
  },
  resetButton: {
    width: "100%",
    marginTop: hScale(16),
  },
  loginLinkContainer: {
    marginTop: hScale(24),
  },
  loginLinkText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.regular),
    color: Colors.primary.main,
  },
  successContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: hScale(32),
  },
  successIconContainer: {
    marginBottom: hScale(24),
  },
  successTitle: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.xlarge),
    color: Colors.neutral.grey5,
    marginBottom: hScale(16),
  },
  successText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey4,
    textAlign: "center",
    marginBottom: hScale(32),
  },
  backToLoginButton: {
    width: "100%",
  },
})

export default ForgotPasswordScreen

