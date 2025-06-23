"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native"
import { Iconify } from "react-native-iconify"
import Header from "../../components/Header"
import ProfileMenuItem from "../../components/ProfileMenuItem"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"
import CustomAlert from "../../components/Alert"
import storage from "../../storage"
import { setUser as setUserAction } from "../../redux/UserSlice"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"

// Import'lara dispatch ve logoutUser ekleyelim
import { useDispatch } from "react-redux"
import axios from "axios"
import { clearUser } from "../../redux/UserSlice"
import { setChildren } from "../../redux/ChildSlice"
import { API_URL } from "@env"

// Component başına dispatch ekleyelim
const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch()
  const userState = useSelector((state: RootState) => state.User);
  const childState = useSelector((state: RootState) => state.Child);
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [alertConfig, setAlertConfig] = useState<{
    type: "success" | "error" | "warning" | "info"
    title: string
    message: string
  }>({
    type: "info",
    title: "",
    message: "",
  })

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${userState.token}` },
      })
      dispatch(setUserAction({ user: res.data, role: res.data.role }))
      storage.set("user", JSON.stringify(res.data))
    } catch (err) {
      showCustomAlert("error", "Profil alınamadı", "Lütfen tekrar deneyin.")
    }
    setLoading(false)
  }

  const fetchChildren = async () => {
    try {
      const res = await axios.get(`${API_URL}/parent/children`, {
        headers: { Authorization: `Bearer ${userState.token}` },
      })
      dispatch(setChildren(res.data.children || []))
    } catch (err) {
      showCustomAlert("error", "Çocuk bilgileri alınamadı", "")
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchProfile(), fetchChildren()])
    setRefreshing(false)
  }

  useEffect(() => {
    fetchProfile()
    fetchChildren()
  }, [])

  const showCustomAlert = (type: "success" | "error" | "warning" | "info", title: string, message: string) => {
    setAlertConfig({ type, title, message })
    setShowAlert(true)
  }

  // Ayarlar sayfasına git
  const handleSettingsPress = () => {
    navigation.navigate("Settings")
  }

  // Profil düzenleme sayfasına git
  const handleEditProfilePress = () => {
    // navigation.navigate("EditProfile", { user })
    showCustomAlert("info", "Geliştirme Aşamasında", "Bu özellik henüz geliştirme aşamasındadır.")
  }

  // Çocuk profili sayfasına git
  const handleChildProfilePress = (childId: string) => {
    // navigation.navigate("ChildProfile", { childId })
    console.log(`Çocuk profili: ${childId}`)
    showCustomAlert("info", "Çocuk Profili", `${childId} ID'li çocuğun profili açılacak`)
  }

  // handleLogout fonksiyonunu güncelleyelim
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await axios.post(`${API_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${userState.token}` }
      })
      storage.clearAll()
      dispatch(clearUser())
      showCustomAlert("success", "Çıkış Başarılı", "Başarıyla çıkış yaptınız.")
    } catch (err) {
      console.error("Çıkış yaparken hata:", err)
      showCustomAlert("error", "Çıkış Hatası", "Çıkış yaparken bir hata oluştu.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Profil" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.main} />
          <Text style={styles.loadingText}>Profil bilgileri yükleniyor...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!userState.user) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Profil" />
        <View style={styles.errorContainer}>
          <Iconify icon="mdi:account-alert" size={wScale(64)} color={Colors.status.error} />
          <Text style={styles.errorTitle}>Profil Bulunamadı</Text>
          <Text style={styles.errorText}>Profil bilgilerinize erişilemiyor. Lütfen daha sonra tekrar deneyin.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchProfile()}>
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profil" rightIcon="mdi:cog" onRightPress={handleSettingsPress} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary.main]} />}
      >
        {/* Custom Alert */}
        {showAlert && (
          <CustomAlert
            type={alertConfig.type}
            title={alertConfig.title}
            message={alertConfig.message}
            onClose={() => {
              setShowAlert(false)
              // If it was an unauthorized error, redirect to login
              if (alertConfig.type === "warning" && alertConfig.title === "Oturum Süresi Doldu") {
              }
            }}
          />
        )}

        {/* Profil Başlığı */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
              }}
              style={styles.profileImage}
            />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userState.user.name}</Text>
            <View style={styles.profileContact}>
              <Iconify icon="mdi:email" size={wScale(14)} color={Colors.neutral.grey4} />
              <Text style={styles.profileContactText}>{userState.user.email}</Text>
            </View>
            <View style={styles.profileContact}>
              <Iconify icon="mdi:phone" size={wScale(14)} color={Colors.neutral.grey4} />
              <Text style={styles.profileContactText}>{userState.user.phone}</Text>
            </View>
          </View>
        </View>

        {/* Çocuklar Bölümü */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Çocuklarım ({childState.children.length})</Text>

          {childState.children.map((child: any) => (
            <TouchableOpacity key={child.id} style={styles.childItem} onPress={() => handleChildProfilePress(child.id)}>
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
                }}
                style={styles.childImage}
              />
              <View style={styles.childInfo}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childDetails}>
                  {child.grade} - {child.school}
                </Text>
                <Text style={styles.childDetails}>
                  {child.pickup_time ? `Alış Saati: ${child.pickup_time}` : "Alış Saati: Belirtilmemiş"}
                  {child.dropoff_time ? `\nBırakış Saati: ${child.dropoff_time}` : " | Bırakış Saati: Belirtilmemiş"}
                </Text>
              </View>
              <Iconify icon="mdi:chevron-right" size={wScale(20)} color={Colors.neutral.grey4} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Menü Bölümü */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Hesap</Text>

          <ProfileMenuItem
            icon="mdi:account-edit"
            title="Profil Bilgilerimi Düzenle"
            onPress={handleEditProfilePress}
          />

          <ProfileMenuItem
            icon="mdi:bell-outline"
            title="Bildirim Ayarları"
            onPress={() => navigation.navigate("Settings")}
          />

          <ProfileMenuItem
            icon="mdi:shield-check"
            title="Gizlilik ve Güvenlik"
            onPress={() =>
              showCustomAlert("info", "Geliştirme Aşamasında", "Bu özellik henüz geliştirme aşamasındadır.")
            }
          />

          <ProfileMenuItem
            icon="mdi:help-circle"
            title="Yardım ve Destek"
            onPress={() =>
              showCustomAlert("info", "Geliştirme Aşamasında", "Bu özellik henüz geliştirme aşamasındadır.")
            }
          />

          <ProfileMenuItem
            icon="mdi:information"
            title="Hakkında"
            onPress={() =>
              showCustomAlert("info", "Geliştirme Aşamasında", "Bu özellik henüz geliştirme aşamasındadır.")
            }
          />

          <ProfileMenuItem
            icon="mdi:logout"
            title={isLoggingOut ? "Çıkış Yapılıyor..." : "Çıkış Yap"}
            onPress={handleLogout}
            color={Colors.status.error}
            disabled={isLoggingOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  content: {
    flex: 1,
    padding: wScale(16),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey4,
    marginTop: hScale(16),
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wScale(20),
  },
  errorTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.large),
    color: Colors.neutral.grey5,
    marginTop: hScale(16),
    marginBottom: hScale(8),
  },
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey4,
    textAlign: "center",
    marginBottom: hScale(20),
  },
  retryButton: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: wScale(24),
    paddingVertical: hScale(12),
    borderRadius: wScale(8),
    marginBottom: hScale(12),
  },
  retryButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.white,
  },
  loginButton: {
    backgroundColor: Colors.status.warning,
    paddingHorizontal: wScale(24),
    paddingVertical: hScale(12),
    borderRadius: wScale(8),
  },
  loginButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.white,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hScale(24),
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(16),
    padding: wScale(16),
  },
  profileImageContainer: {
    position: "relative",
    marginRight: wScale(16),
  },
  profileImage: {
    width: wScale(80),
    height: wScale(80),
    borderRadius: wScale(40),
    borderWidth: 2,
    borderColor: Colors.primary.main,
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary.main,
    width: wScale(28),
    height: wScale(28),
    borderRadius: wScale(14),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.neutral.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.large),
    color: Colors.neutral.grey5,
    marginBottom: hScale(4),
  },
  profileContact: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hScale(4),
  },
  profileContactText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginLeft: wScale(6),
  },
  editProfileButton: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: wScale(12),
    paddingVertical: hScale(6),
    borderRadius: wScale(8),
  },
  editProfileText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.white,
  },
  sectionContainer: {
    marginBottom: hScale(24),
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(16),
    padding: wScale(16),
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
    marginBottom: hScale(16),
  },
  childItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.white,
    borderRadius: wScale(12),
    padding: wScale(12),
    marginBottom: hScale(12),
  },
  childImage: {
    width: wScale(50),
    height: wScale(50),
    borderRadius: wScale(25),
    marginRight: wScale(12),
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
    marginBottom: hScale(4),
  },
  childDetails: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginBottom: hScale(4),
  },
  childStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: wScale(8),
    height: wScale(8),
    borderRadius: wScale(4),
    marginRight: wScale(6),
  },
  statusText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginRight: wScale(8),
  },
  childTime: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.primary.main,
  },
})

export default ProfileScreen
