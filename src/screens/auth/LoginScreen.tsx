"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native"
import { Iconify } from "react-native-iconify"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"
import CustomInput from "../../components/CustomInput"
import CustomButton from "../../components/CustomButton"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import axios from "axios"
import { API_URL } from "@env"
import { setToken, setUser } from "../../redux/UserSlice"
import storage from "../../storage"

interface LoginScreenProps {
  navigation: any
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch()
  const userState = useSelector((state: RootState) => state.User)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedUserType, setSelectedUserType] = useState<"parent" | "driver">("parent")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "E-posta veya telefon numarası gereklidir"
    } else if (!isValidEmail(email) && !isValidPhone(email)) {
      newErrors.email = "Geçerli bir e-posta veya telefon numarası giriniz"
    }

    if (!password) {
      newErrors.password = "Şifre gereklidir"
    } else if (password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,11}$/
    return phoneRegex.test(phone)
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      })

      const { token, user } = response.data
      dispatch(setToken(token))
      dispatch(setUser({ user, role: selectedUserType }))
      storage.set("token", token)
      storage.set("user", JSON.stringify(user))
      storage.set("userType", selectedUserType)
    } catch (error: any) {
      console.error("Login error:", error)
      if (error.response) {
        const status = error.response.status
        if (status === 400) {
          setErrors({ ...errors, email: "Geçersiz e-posta veya şifre" })
        } else if (status === 401) {
          setErrors({ ...errors, password: "Şifre yanlış" })
        } else {
          setErrors({ ...errors, email: "Giriş başarısız, lütfen tekrar deneyin" })
        }
      } else {
        setErrors({ ...errors, email: "Sunucuya ulaşılamıyor" })
      }
    } finally {
      setLoading(false)
    }
  }

  // Test için hızlı giriş fonksiyonları
  const handleQuickLoginParent = () => {
    setEmail("ahmettayyip56@gmail.com")
    setPassword("12345678")
    setSelectedUserType("parent")
    setErrors({})
  }

  const handleQuickLoginDriver = () => {
    setEmail("hangarrecordz@gmail.com")
    setPassword("12345678")
    setSelectedUserType("driver")
    setErrors({})
  }

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword")
  }

  useEffect(() => {
    console.log("Redux User state:", userState)
    console.log("Full Redux state:", userState)
  }, [userState])

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.neutral.white} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          bounces={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <View style={styles.logoContainer}>
            <Image source={require("../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Hoş Geldiniz</Text>
            <Text style={styles.subtitle}>Giriş yapmak için kullanıcı tipinizi seçin ve bilgilerinizi girin</Text>

            {/* Debug Info */}
            <View style={styles.debugContainer}>
              <Text style={styles.debugText}>
                Debug: Token={userState?.token ? "✓" : "✗"}, User={userState?.user ? "✓" : "✗"}, Type=
                {userState?.role || "none"}
              </Text>
            </View>

            {/* Test Bilgileri */}
            <View style={styles.testInfoContainer}>
              <Text style={styles.testInfoTitle}>🧪 Test Bilgileri</Text>
              <View style={styles.testCredentials}>
                <View style={styles.testCredentialItem}>
                  <Text style={styles.testCredentialLabel}>Veli Girişi:</Text>
                  <Text style={styles.testCredentialText}>ahmettayyip56@gmail.com / 12345678</Text>
                </View>
                <View style={styles.testCredentialItem}>
                  <Text style={styles.testCredentialLabel}>Şoför Girişi:</Text>
                  <Text style={styles.testCredentialText}>hangarrecordz@gmail.com / 12345678</Text>
                </View>
              </View>
            </View>

            {/* Hızlı Giriş Butonları */}
            <View style={styles.quickLoginContainer}>
              <Text style={styles.quickLoginTitle}>Hızlı Test Girişi:</Text>
              <View style={styles.quickLoginButtons}>
                <TouchableOpacity style={styles.quickLoginButton} onPress={handleQuickLoginParent}>
                  <Iconify icon="mdi:account-child" size={wScale(16)} color={Colors.primary.main} />
                  <Text style={styles.quickLoginButtonText}>Veli Olarak Giriş</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickLoginButton} onPress={handleQuickLoginDriver}>
                  <Iconify icon="mdi:bus" size={wScale(16)} color={Colors.secondary.main} />
                  <Text style={styles.quickLoginButtonText}>Şoför Olarak Giriş</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Kullanıcı Tipi Seçimi */}
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[styles.userTypeButton, selectedUserType === "parent" && styles.userTypeButtonActive]}
                onPress={() => setSelectedUserType("parent")}
              >
                <Iconify
                  icon="mdi:account-child"
                  size={wScale(20)}
                  color={selectedUserType === "parent" ? Colors.neutral.white : Colors.primary.main}
                />
                <Text style={[styles.userTypeText, selectedUserType === "parent" && styles.userTypeTextActive]}>
                  Veli Girişi
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.userTypeButton, selectedUserType === "driver" && styles.userTypeButtonActive]}
                onPress={() => setSelectedUserType("driver")}
              >
                <Iconify
                  icon="mdi:bus"
                  size={wScale(20)}
                  color={selectedUserType === "driver" ? Colors.neutral.white : Colors.primary.main}
                />
                <Text style={[styles.userTypeText, selectedUserType === "driver" && styles.userTypeTextActive]}>
                  Şoför/Görevli
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <CustomInput
                label="E-posta veya Telefon"
                placeholder="E-posta adresinizi veya telefon numaranızı girin"
                value={email}
                onChangeText={(text) => {
                  setEmail(text)
                  setErrors({ ...errors, email: undefined })
                }}
                keyboardType="email-address"
                error={errors.email}
                icon="mdi:email-outline"
              />

              <CustomInput
                label="Şifre"
                placeholder="Şifrenizi girin"
                value={password}
                onChangeText={(text) => {
                  setPassword(text)
                  setErrors({ ...errors, password: undefined })
                }}
                secureTextEntry
                error={errors.password}
                icon="mdi:lock-outline"
              />

              <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
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
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2023 Servis Takip. Tüm hakları saklıdır.</Text>
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
    backgroundColor: Colors.neutral.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wScale(24),
    paddingBottom: hScale(40),
  },
  logoContainer: {
    alignItems: "center",
    marginTop: hScale(20),
    marginBottom: hScale(20),
  },
  logo: {
    width: wScale(160),
    height: hScale(60),
  },
  formContainer: {
    width: "100%",
    flex: 1,
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
    marginBottom: hScale(16),
  },
  debugContainer: {
    backgroundColor: Colors.neutral.grey1,
    padding: wScale(8),
    borderRadius: wScale(8),
    marginBottom: hScale(16),
  },
  debugText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.tiny),
    color: Colors.neutral.grey4,
  },
  testInfoContainer: {
    backgroundColor: Colors.primary.background,
    borderRadius: wScale(12),
    padding: wScale(12),
    marginBottom: hScale(12),
    borderWidth: 1,
    borderColor: Colors.primary.light,
  },
  testInfoTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.small),
    color: Colors.primary.main,
    marginBottom: hScale(8),
  },
  testCredentials: {
    gap: hScale(4),
  },
  testCredentialItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  testCredentialLabel: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.tiny),
    color: Colors.neutral.grey5,
    width: wScale(80),
  },
  testCredentialText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.tiny),
    color: Colors.neutral.grey4,
  },
  quickLoginContainer: {
    marginBottom: hScale(16),
  },
  quickLoginTitle: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey5,
    marginBottom: hScale(8),
  },
  quickLoginButtons: {
    flexDirection: "row",
    gap: wScale(8),
  },
  quickLoginButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hScale(8),
    paddingHorizontal: wScale(12),
    borderRadius: wScale(8),
    backgroundColor: Colors.neutral.grey1,
    borderWidth: 1,
    borderColor: Colors.neutral.grey2,
  },
  quickLoginButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.tiny),
    color: Colors.neutral.grey5,
    marginLeft: wScale(4),
  },
  userTypeContainer: {
    flexDirection: "row",
    marginBottom: hScale(20),
    borderRadius: wScale(12),
    backgroundColor: Colors.neutral.grey1,
    padding: wScale(4),
  },
  userTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hScale(12),
    paddingHorizontal: wScale(16),
    borderRadius: wScale(8),
    backgroundColor: "transparent",
  },
  userTypeButtonActive: {
    backgroundColor: Colors.primary.main,
  },
  userTypeText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.primary.main,
    marginLeft: wScale(8),
  },
  userTypeTextActive: {
    color: Colors.neutral.white,
  },
  inputContainer: {
    marginBottom: hScale(20),
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: hScale(20),
  },
  forgotPasswordText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.primary.main,
  },
  loginButton: {
    width: "100%",
    marginBottom: hScale(16),
  },
  footer: {
    marginTop: "auto",
    paddingVertical: hScale(16),
    alignItems: "center",
    backgroundColor: Colors.neutral.white,
  },
  footerText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
  },
})

export default LoginScreen
