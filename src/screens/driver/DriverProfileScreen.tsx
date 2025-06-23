"use client"

import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Alert } from "react-native"
import { Iconify } from "react-native-iconify"
import { useDispatch, useSelector } from "react-redux"
import Header from "../../components/Header"
import ProfileMenuItem from "../../components/ProfileMenuItem"
import CustomAlert from "../../components/Alert"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"
import axios from "axios"
import { API_URL } from "@env"
import { RootState } from "../../redux/store"
import { setUser as setUserAction  } from "../../redux/UserSlice"
import storage from "../../storage"
import { clearUser } from "../../redux/UserSlice"

const DriverProfileScreen = ({ navigation }: any) => {
  const userState = useSelector((state: RootState) => state.User);
  const dispatch = useDispatch()
  const [driver] = useState()
  const [loading, setLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
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

  const showCustomAlert = (type: "success" | "error" | "warning" | "info", title: string, message: string) => {
    setAlertConfig({ type, title, message })
    setShowAlert(true)
  }

  // Çıkış yap
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

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profil" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Custom Alert */}
        {showAlert && (
          <CustomAlert
            type={alertConfig.type}
            title={alertConfig.title}
            message={alertConfig.message}
            onClose={() => setShowAlert(false)}
          />
        )}

        {/* Profil Başlığı */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}} style={styles.profileImage} />
            <View style={styles.driverBadge}>
              <Iconify icon="mdi:bus" size={wScale(16)} color={Colors.neutral.white} />
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userState?.user?.name}</Text>
            <View style={styles.profileContact}>
              <Iconify icon="mdi:email" size={wScale(14)} color={Colors.neutral.grey4} />
              <Text style={styles.profileContactText}>{userState?.user?.email}</Text>
            </View>
            <View style={styles.profileContact}>
              <Iconify icon="mdi:phone" size={wScale(14)} color={Colors.neutral.grey4} />
              <Text style={styles.profileContactText}>{userState?.user?.phone}</Text>
            </View>
          </View>
        </View>

        {/* Araç Bilgileri */}
        <View style={styles.vehicleContainer}>
          <Text style={styles.sectionTitle}>Araç Bilgileri</Text>

          <View style={styles.vehicleInfo}>
            <View style={styles.vehicleItem}>
              <Iconify icon="mdi:car" size={wScale(20)} color={Colors.secondary.main} />
              <View style={styles.vehicleDetails}>
                <Text style={styles.vehicleLabel}>Model</Text>
                <Text style={styles.vehicleValue}>Transit</Text>
              </View>
            </View>

            <View style={styles.vehicleItem}>
              <Iconify icon="mdi:license" size={wScale(20)} color={Colors.secondary.main} />
              <View style={styles.vehicleDetails}>
                <Text style={styles.vehicleLabel}>Plaka</Text>
                <Text style={styles.vehicleValue}>34ABC123</Text>
              </View>
            </View>

            <View style={styles.vehicleItem}>
              <Iconify icon="mdi:account-group" size={wScale(20)} color={Colors.secondary.main} />
              <View style={styles.vehicleDetails}>
                <Text style={styles.vehicleLabel}>Kapasite</Text>
                <Text style={styles.vehicleValue}>14 kişi</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menü Bölümü */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Hesap</Text>

          <ProfileMenuItem
            icon="mdi:account-edit"
            title="Profil Bilgilerimi Düzenle"
            onPress={() =>
              showCustomAlert("info", "Geliştirme Aşamasında", "Bu özellik henüz geliştirme aşamasındadır.")
            }
          />

          <ProfileMenuItem
            icon="mdi:bell-outline"
            title="Bildirim Ayarları"
            onPress={() => navigation.navigate("DriverSettings")}
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
    borderColor: Colors.secondary.main,
  },
  driverBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.secondary.main,
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
  statsContainer: {
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "48%",
    backgroundColor: Colors.neutral.white,
    borderRadius: wScale(12),
    padding: wScale(16),
    alignItems: "center",
    marginBottom: hScale(12),
  },
  statValue: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.large),
    color: Colors.neutral.grey5,
    marginBottom: hScale(4),
  },
  statLabel: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
  },
  vehicleContainer: {
    marginBottom: hScale(24),
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(16),
    padding: wScale(16),
  },
  vehicleInfo: {
    gap: hScale(12),
  },
  vehicleItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.white,
    borderRadius: wScale(12),
    padding: wScale(12),
  },
  vehicleDetails: {
    marginLeft: wScale(12),
  },
  vehicleLabel: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
  },
  vehicleValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
    marginTop: hScale(2),
  },
  menuContainer: {
    marginBottom: hScale(30),
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(16),
    padding: wScale(16),
  },
})

export default DriverProfileScreen
