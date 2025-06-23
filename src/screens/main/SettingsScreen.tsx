"use client"

import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, ScrollView, Alert } from "react-native"
import { Iconify } from "react-native-iconify"
import Slider from "@react-native-community/slider"
import Header from "../../components/Header"
import ProfileMenuItem from "../../components/ProfileMenuItem"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { setOuterRadius, setInnerRadius } from "../../redux/ApproachSlice"

const SettingsScreen = ({ navigation }: any) => {
  // Yaklaşma daireleri ayarları
  const dispatch = useDispatch()
  const approachState = useSelector((state: RootState) => state.Approach)

  // Bildirim ayarları
  const [notifyApproaching, setNotifyApproaching] = useState(true)
  const [notifyArrived, setNotifyArrived] = useState(true)
  const [notifyDelayed, setNotifyDelayed] = useState(true)

  // Diğer ayarlar
  const [darkMode, setDarkMode] = useState(false)
  const [showTraffic, setShowTraffic] = useState(false)
  const [language, setLanguage] = useState("Türkçe")

  // Dil seçimi
  const handleLanguageSelect = () => {
    Alert.alert(
      "Dil Seçimi",
      "Lütfen bir dil seçin",
      [
        { text: "Türkçe", onPress: () => setLanguage("Türkçe") },
        { text: "English", onPress: () => setLanguage("English") },
        { text: "İptal", style: "cancel" },
      ],
      { cancelable: true },
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Ayarlar" showBackButton={true} onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.content}>
        {/* Genel Ayarlar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genel Ayarlar</Text>

          <ProfileMenuItem icon="mdi:translate" title="Dil" subtitle={language} onPress={handleLanguageSelect} />

          <View style={styles.settingToggleItem}>
            <View style={styles.settingToggleInfo}>
              <Iconify icon="mdi:theme-light-dark" size={wScale(20)} color={Colors.primary.main} />
              <Text style={styles.settingToggleLabel}>Karanlık Mod</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: Colors.neutral.grey3, true: Colors.primary.light }}
              thumbColor={darkMode ? Colors.primary.main : Colors.neutral.grey4}
            />
          </View>
        </View>

        {/* Harita Ayarları */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Harita Ayarları</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Text style={styles.settingLabel}>Dış Daire (Yaklaşıyor)</Text>
              <Text style={styles.settingValue}>{approachState.outerRadius} metre</Text>
            </View>
            <Slider
              value={approachState.outerRadius}
              minimumValue={100}
              maximumValue={1000}
              step={10}
              onSlidingComplete={(value) => dispatch(setOuterRadius(value))}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Text style={styles.settingLabel}>İç Daire (Geldi)</Text>
              <Text style={styles.settingValue}>{approachState.innerRadius} metre</Text>
            </View>
            <Slider
              value={approachState.innerRadius}
              minimumValue={20}
              maximumValue={500}
              step={5}
              onSlidingComplete={(value) => dispatch(setInnerRadius(value))}
            />
          </View>

          <View style={styles.settingToggleItem}>
            <View style={styles.settingToggleInfo}>
              <Iconify icon="mdi:map" size={wScale(20)} color={Colors.primary.main} />
              <Text style={styles.settingToggleLabel}>Trafik Durumunu Göster</Text>
            </View>
            <Switch
              value={showTraffic}
              onValueChange={setShowTraffic}
              trackColor={{ false: Colors.neutral.grey3, true: Colors.primary.light }}
              thumbColor={showTraffic ? Colors.primary.main : Colors.neutral.grey4}
            />
          </View>
        </View>

        {/* Bildirim Ayarları */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirimler</Text>

          <View style={styles.settingToggleItem}>
            <View style={styles.settingToggleInfo}>
              <Iconify icon="mdi:bell-ring" size={wScale(20)} color={Colors.primary.main} />
              <Text style={styles.settingToggleLabel}>Servis Yaklaşıyor</Text>
            </View>
            <Switch
              value={notifyApproaching}
              onValueChange={setNotifyApproaching}
              trackColor={{ false: Colors.neutral.grey3, true: Colors.primary.light }}
              thumbColor={notifyApproaching ? Colors.primary.main : Colors.neutral.grey4}
            />
          </View>

          <View style={styles.settingToggleItem}>
            <View style={styles.settingToggleInfo}>
              <Iconify icon="mdi:bell-ring" size={wScale(20)} color={Colors.primary.main} />
              <Text style={styles.settingToggleLabel}>Servis Geldi</Text>
            </View>
            <Switch
              value={notifyArrived}
              onValueChange={setNotifyArrived}
              trackColor={{ false: Colors.neutral.grey3, true: Colors.primary.light }}
              thumbColor={notifyArrived ? Colors.primary.main : Colors.neutral.grey4}
            />
          </View>

          <View style={styles.settingToggleItem}>
            <View style={styles.settingToggleInfo}>
              <Iconify icon="mdi:bell-ring" size={wScale(20)} color={Colors.primary.main} />
              <Text style={styles.settingToggleLabel}>Servis Gecikti</Text>
            </View>
            <Switch
              value={notifyDelayed}
              onValueChange={setNotifyDelayed}
              trackColor={{ false: Colors.neutral.grey3, true: Colors.primary.light }}
              thumbColor={notifyDelayed ? Colors.primary.main : Colors.neutral.grey4}
            />
          </View>
        </View>

        {/* Hesap Ayarları */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hesap</Text>

          <ProfileMenuItem
            icon="mdi:account-edit"
            title="Profil Bilgilerini Düzenle"
            onPress={() => console.log("Profil düzenle")}
          />

          <ProfileMenuItem icon="mdi:lock-reset" title="Şifre Değiştir" onPress={() => console.log("Şifre değiştir")} />

          <ProfileMenuItem
            icon="mdi:delete"
            title="Hesabı Sil"
            onPress={() => {
              Alert.alert("Hesabı Sil", "Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.", [
                { text: "İptal", style: "cancel" },
                {
                  text: "Hesabı Sil",
                  onPress: () => console.log("Hesap silme işlemi"),
                  style: "destructive",
                },
              ])
            }}
            color={Colors.status.error}
          />
        </View>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            Alert.alert(
              "Ayarları Sıfırla",
              "Tüm ayarları varsayılan değerlerine sıfırlamak istediğinize emin misiniz?",
              [
                { text: "İptal", style: "cancel" },
                {
                  text: "Sıfırla",
                  onPress: () => {
                    setOuterRadius(500)
                    setInnerRadius(100)
                    setNotifyApproaching(true)
                    setNotifyArrived(true)
                    setNotifyDelayed(true)
                    setDarkMode(false)
                    setShowTraffic(false)
                    setLanguage("Türkçe")
                  },
                },
              ],
            )
          }}
        >
          <Text style={styles.resetButtonText}>Varsayılan Ayarlara Sıfırla</Text>
        </TouchableOpacity>
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
  section: {
    marginBottom: hScale(24),
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(12),
    padding: wScale(16),
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
    marginBottom: hScale(16),
  },
  settingItem: {
    marginBottom: hScale(16),
  },
  settingLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hScale(8),
  },
  settingLabel: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
  },
  settingValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.small),
    color: Colors.primary.main,
  },
  slider: {
    width: "100%",
    height: hScale(40),
  },
  settingToggleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hScale(16),
    backgroundColor: Colors.neutral.white,
    borderRadius: wScale(12),
    padding: wScale(12),
  },
  settingToggleInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingToggleLabel: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
    marginLeft: wScale(10),
  },
  resetButton: {
    backgroundColor: Colors.neutral.grey2,
    borderRadius: wScale(12),
    paddingVertical: hScale(12),
    alignItems: "center",
    marginBottom: hScale(30),
  },
  resetButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
  },
})

export default SettingsScreen

