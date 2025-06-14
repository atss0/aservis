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
  Alert
} from "react-native"
import { Iconify } from "react-native-iconify"
import Header from "../../components/Header"
import ProfileMenuItem from "../../components/ProfileMenuItem"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"
import CustomAlert from "../../components/Alert"

// Örnek kullanıcı verisi
interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  photo: string
  children: {
    id: string
    name: string
    grade: string
    school: string
    photo: string
  }[]
}

const DUMMY_USER: UserProfile = {
  id: "1",
  name: "Ahmet Yılmaz",
  email: "ahmet.yilmaz@example.com",
  phone: "0532 123 45 67",
  photo: "https://randomuser.me/api/portraits/men/32.jpg",
  children: [
    {
      id: "1",
      name: "Ayşe Yılmaz",
      grade: "5. Sınıf",
      school: "Atatürk İlkokulu",
      photo: "https://randomuser.me/api/portraits/girls/22.jpg",
    },
    {
      id: "2",
      name: "Mehmet Yılmaz",
      grade: "3. Sınıf",
      school: "Atatürk İlkokulu",
      photo: "https://randomuser.me/api/portraits/boys/12.jpg",
    },
  ],
}

const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAlert, setShowAlert] = useState(false)

  // Kullanıcı verilerini yükle
  useEffect(() => {
    // Gerçek uygulamada API'den veri çekilecek
    const loadUserProfile = async () => {
      setLoading(true)
      // API çağrısını simüle etmek için timeout kullanıyoruz
      setTimeout(() => {
        setUser(DUMMY_USER)
        setLoading(false)
      }, 500)
    }

    loadUserProfile()
  }, [])

  // Ayarlar sayfasına git
  const handleSettingsPress = () => {
    navigation.navigate("Settings")
  }

  // Profil düzenleme sayfasına git
  const handleEditProfilePress = () => {
    // navigation.navigate("EditProfile")
    setShowAlert(true)
  }

  // Çocuk profili sayfasına git
  const handleChildProfilePress = (childId: string) => {
    // navigation.navigate("ChildProfile", { childId })
    console.log(`Çocuk profili: ${childId}`)
  }

  // Çıkış yap
  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Çıkış Yap",
          onPress: () => {
            // Gerçek uygulamada oturum kapatma işlemi yapılacak
            console.log("Çıkış yapıldı")
            // navigation.reset({
            //   index: 0,
            //   routes: [{ name: "Auth" }],
            // })
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Profil" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.main} />
        </View>
      </SafeAreaView>
    )
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Profil" />
        <View style={styles.errorContainer}>
          <Iconify icon="mdi:account-alert" size={wScale(64)} color={Colors.status.error} />
          <Text style={styles.errorTitle}>Profil Bulunamadı</Text>
          <Text style={styles.errorText}>Profil bilgilerinize erişilemiyor. Lütfen daha sonra tekrar deneyin.</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profil" rightIcon="mdi:cog" onRightPress={handleSettingsPress} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {showAlert && (
          <CustomAlert
            type="info"
            title="Geliştirme Aşamasında"
            message="Bu özellik henüz geliştirme aşamasındadır."
            onClose={() => setShowAlert(false)}
          />
        )}

        {/* Profil Başlığı */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: user.photo }} style={styles.profileImage} />
            <TouchableOpacity style={styles.editImageButton} onPress={handleEditProfilePress}>
              <Iconify icon="mdi:camera" size={wScale(16)} color={Colors.neutral.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <View style={styles.profileContact}>
              <Iconify icon="mdi:email" size={wScale(14)} color={Colors.neutral.grey4} />
              <Text style={styles.profileContactText}>{user.email}</Text>
            </View>
            <View style={styles.profileContact}>
              <Iconify icon="mdi:phone" size={wScale(14)} color={Colors.neutral.grey4} />
              <Text style={styles.profileContactText}>{user.phone}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfilePress}>
            <Text style={styles.editProfileText}>Düzenle</Text>
          </TouchableOpacity>
        </View>

        {/* Çocuklar Bölümü */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Çocuklarım</Text>

          {user.children.map((child) => (
            <TouchableOpacity key={child.id} style={styles.childItem} onPress={() => handleChildProfilePress(child.id)}>
              <Image source={{ uri: child.photo }} style={styles.childImage} />
              <View style={styles.childInfo}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childDetails}>
                  {child.grade} - {child.school}
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

          <ProfileMenuItem icon="mdi:shield-check" title="Gizlilik ve Güvenlik" onPress={() => setShowAlert(true)} />

          <ProfileMenuItem icon="mdi:help-circle" title="Yardım ve Destek" onPress={() => setShowAlert(true)} />

          <ProfileMenuItem icon="mdi:information" title="Hakkında" onPress={() => setShowAlert(true)} />

          <ProfileMenuItem icon="mdi:logout" title="Çıkış Yap" onPress={handleLogout} color={Colors.status.error} />
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
  },
})

export default ProfileScreen

