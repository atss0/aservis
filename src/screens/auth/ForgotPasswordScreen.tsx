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
import CustomAlert from "../../components/Alert"

interface ForgotPasswordScreenProps {
  navigation: any
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const [alertConfig, setAlertConfig] = useState<{
    type: "success" | "error" | "warning" | "info"
    title: string
    message: string
  }>({
    type: "info",
    title: "",
    message: "",
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const showCustomAlert = (type: "success" | "error" | "warning" | "info", title: string, message: string) => {
    setAlertConfig({ type, title, message })
    setShowAlert(true)
  }

  const handleResetPassword = async () => {
    // Validation
    if (!email.trim()) {
      setError("E-posta adresi gereklidir")
      return
    }

    if (!validateEmail(email.trim())) {
      setError("Geçerli bir e-posta adresi giriniz")
      return
    }

    setError("")
    setLoading(true)

    
  }

  const handleBackToLogin = () => {
    navigation.goBack()
  }

  const handleResendEmail = async () => {
    if (email && validateEmail(email)) {
      setSuccess(false)
      await handleResetPassword()
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Custom Alert */}
          {showAlert && (
            <CustomAlert
              type={alertConfig.type}
              title={alertConfig.title}
              message={alertConfig.message}
              onClose={() => setShowAlert(false)}
            />
          )}

          <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
            <Iconify icon="mdi:arrow-left" size={wScale(24)} color={Colors.neutral.grey5} />
          </TouchableOpacity>

          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Şifremi Unuttum</Text>
              <Text style={styles.subtitle}>
                Şifrenizi sıfırlamak için e-posta adresinizi girin. Size şifre sıfırlama talimatlarını içeren bir
                e-posta göndereceğiz.
              </Text>
            </View>

            {!success ? (
              <View style={styles.formContainer}>
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
                  title={loading ? "Gönderiliyor..." : "Şifremi Sıfırla"}
                  onPress={handleResetPassword}
                  type="primary"
                  size="large"
                  loading={loading}
                  disabled={loading}
                  style={styles.resetButton}
                />
              </View>
            ) : (
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <Iconify icon="mdi:check-circle" size={wScale(64)} color={Colors.status.success} />
                </View>
                <Text style={styles.successTitle}>E-posta Gönderildi</Text>
                <Text style={styles.successText}>
                  Şifre sıfırlama talimatları {email} adresine gönderildi. Lütfen e-posta kutunuzu kontrol edin.
                </Text>

                <View style={styles.successActions}>
                  <CustomButton
                    title="Giriş Sayfasına Dön"
                    onPress={handleBackToLogin}
                    type="primary"
                    size="large"
                    style={styles.backToLoginButton}
                  />

                  <CustomButton
                    title="E-postayı Tekrar Gönder"
                    onPress={handleResendEmail}
                    type="outline"
                    size="medium"
                    style={styles.resendButton}
                  />
                </View>
              </View>
            )}

            <View style={styles.footer}>
              <TouchableOpacity style={styles.loginLinkContainer} onPress={handleBackToLogin}>
                <Text style={styles.loginLinkText}>Giriş sayfasına dön</Text>
              </TouchableOpacity>

              <Text style={styles.helpText}>
                E-posta gelmedi mi? Spam klasörünüzü kontrol edin veya birkaç dakika bekleyin.
              </Text>
            </View>
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
    paddingBottom: hScale(20),
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
  },
  headerContainer: {
    marginBottom: hScale(32),
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.xxlarge),
    color: Colors.neutral.grey5,
    marginBottom: hScale(16),
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey4,
    lineHeight: hScale(24),
  },
  formContainer: {
    marginBottom: hScale(32),
  },
  resetButton: {
    width: "100%",
    marginTop: hScale(16),
  },
  successContainer: {
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
    textAlign: "center",
  },
  successText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey4,
    textAlign: "center",
    marginBottom: hScale(32),
    lineHeight: hScale(24),
  },
  successActions: {
    width: "100%",
    gap: hScale(12),
  },
  backToLoginButton: {
    width: "100%",
  },
  resendButton: {
    width: "100%",
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
    paddingTop: hScale(24),
  },
  loginLinkContainer: {
    marginBottom: hScale(16),
  },
  loginLinkText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.regular),
    color: Colors.primary.main,
  },
  helpText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    textAlign: "center",
    lineHeight: hScale(20),
  },
})

export default ForgotPasswordScreen
