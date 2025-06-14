"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { Iconify } from "react-native-iconify"
import Header from "../../components/Header"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"
import type { NotificationType } from "../../components/NotificationCard"

// Örnek bildirim detayı
interface NotificationDetail {
  id: string
  title: string
  message: string
  fullContent: string
  time: string
  date: string
  type: NotificationType
  isRead: boolean
  actionType?: "link" | "button" | "none"
  actionText?: string
  actionUrl?: string
}

const DUMMY_NOTIFICATION_DETAILS: Record<string, NotificationDetail> = {
  "1": {
    id: "1",
    title: "Servis Yaklaşıyor",
    message: "Servis aracı evinize yaklaşıyor. Tahmini varış süresi: 5 dakika.",
    fullContent:
      "Servis aracı şu anda evinize yaklaşıyor. Tahmini varış süresi 5 dakikadır. Lütfen hazır olun ve çocuğunuzu servis noktasına zamanında getirin. Sürücü: Ahmet Yılmaz, Araç Plakası: 34 ABC 123",
    time: "07:25",
    date: "12 May 2023",
    type: "info",
    isRead: false,
    actionType: "button",
    actionText: "Haritada Göster",
  },
  "2": {
    id: "2",
    title: "Servis Gecikecek",
    message: "Servis aracı trafik nedeniyle 10 dakika gecikecek. Özür dileriz.",
    fullContent:
      "Servis aracı yoğun trafik nedeniyle yaklaşık 10 dakika gecikecektir. Bu durumdan dolayı özür dileriz. Sürücümüz en kısa sürede ulaşmak için alternatif rotalar kullanmaktadır. Anlayışınız için teşekkür ederiz.",
    time: "07:15",
    date: "11 May 2023",
    type: "warning",
    isRead: true,
    actionType: "none",
  },
  "3": {
    id: "3",
    title: "Servis Geldi",
    message: "Servis aracı evinize ulaştı. Lütfen hazır olun.",
    fullContent:
      "Servis aracı evinize ulaştı. Lütfen çocuğunuzla birlikte servis noktasına gelin. Sürücü sizi bekliyor. Sürücü: Ahmet Yılmaz, Araç Plakası: 34 ABC 123",
    time: "07:30",
    date: "10 May 2023",
    type: "success",
    isRead: true,
    actionType: "button",
    actionText: "Sürücüyü Ara",
  },
  "4": {
    id: "4",
    title: "Ödeme Hatırlatması",
    message: "Mayıs ayı servis ödemesi için son 3 gün. Lütfen ödemenizi yapın.",
    fullContent:
      "Mayıs ayı servis ödemesi için son 3 gün kaldı. Lütfen ödemenizi zamanında yaparak servis hizmetinin kesintisiz devam etmesini sağlayın. Ödeme yapmak için uygulama içindeki Ödemeler bölümünü kullanabilirsiniz.",
    time: "14:00",
    date: "9 May 2023",
    type: "payment",
    isRead: false,
    actionType: "button",
    actionText: "Ödeme Yap",
  },
  "5": {
    id: "5",
    title: "Sürücü Değişikliği",
    message: "Yarından itibaren servis sürücünüz Mehmet Demir olarak değiştirilmiştir.",
    fullContent:
      "Yarından itibaren servis sürücünüz Mehmet Demir olarak değiştirilmiştir. Yeni sürücümüz 5 yıllık deneyime sahiptir ve tüm güvenlik eğitimlerini tamamlamıştır. Sürücü değişikliği hakkında herhangi bir sorunuz olursa lütfen bizimle iletişime geçin.",
    time: "16:30",
    date: "8 May 2023",
    type: "info",
    isRead: true,
    actionType: "link",
    actionText: "Sürücü Bilgilerini Gör",
  },
  "6": {
    id: "6",
    title: "Servis İptal",
    message: "Yarınki servis hizmeti hava koşulları nedeniyle iptal edilmiştir.",
    fullContent:
      "Yarınki servis hizmeti olumsuz hava koşulları nedeniyle iptal edilmiştir. Meteoroloji Genel Müdürlüğü'nün şiddetli kar yağışı uyarısı nedeniyle öğrencilerimizin güvenliği için bu karar alınmıştır. Hava koşulları düzeldiğinde servis hizmeti normal şekilde devam edecektir.",
    time: "18:45",
    date: "7 May 2023",
    type: "error",
    isRead: true,
    actionType: "none",
  },
  "7": {
    id: "7",
    title: "Yeni Güzergah",
    message: "Servis güzergahı yol çalışması nedeniyle değiştirilmiştir. Yeni güzergah için tıklayın.",
    fullContent:
      "Ana güzergahta devam eden yol çalışması nedeniyle servis güzergahı geçici olarak değiştirilmiştir. Yeni güzergah nedeniyle servis saatlerinde 5-10 dakikalık değişiklikler olabilir. Yeni güzergah haritasını görmek için aşağıdaki butona tıklayabilirsiniz.",
    time: "12:30",
    date: "6 May 2023",
    type: "info",
    isRead: false,
    actionType: "button",
    actionText: "Güzergahı Göster",
  },
  "8": {
    id: "8",
    title: "Mayıs Ayı Ödemesi",
    message: "Mayıs ayı servis ödemesi başarıyla alınmıştır. Teşekkür ederiz.",
    fullContent:
      "Mayıs ayı servis ödemesi başarıyla alınmıştır. Ödemeniz için teşekkür ederiz. Bir sonraki ödeme tarihi 1 Haziran 2023'tür. Otomatik ödeme talimatınız varsa, ödemeniz belirtilen tarihte otomatik olarak gerçekleştirilecektir.",
    time: "09:15",
    date: "5 May 2023",
    type: "payment",
    isRead: true,
    actionType: "link",
    actionText: "Ödeme Geçmişini Gör",
  },
}

const NotificationDetailScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  const [notification, setNotification] = useState<NotificationDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const notificationId = route?.params?.notificationId || "1"

  // Bildirim detaylarını yükle
  useEffect(() => {
    // Gerçek uygulamada API'den veri çekilecek
    const loadNotification = async () => {
      setLoading(true)
      // API çağrısını simüle etmek için timeout kullanıyoruz
      setTimeout(() => {
        const notificationDetail = DUMMY_NOTIFICATION_DETAILS[notificationId]
        setNotification(notificationDetail)
        setLoading(false)
      }, 500)
    }

    loadNotification()
  }, [notificationId])

  // Bildirim tipine göre ikon ve renk belirle
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "info":
        return "mdi:information"
      case "warning":
        return "mdi:alert"
      case "success":
        return "mdi:check-circle"
      case "error":
        return "mdi:close-circle"
      case "payment":
        return "mdi:cash"
      default:
        return "mdi:bell"
    }
  }

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case "info":
        return Colors.status.info
      case "warning":
        return Colors.status.warning
      case "success":
        return Colors.status.success
      case "error":
        return Colors.status.error
      case "payment":
        return Colors.secondary.main
      default:
        return Colors.primary.main
    }
  }

  // Aksiyon butonuna tıklama
  const handleActionPress = () => {
    if (!notification) return

    switch (notification.actionType) {
      case "button":
        if (notification.actionText === "Haritada Göster") {
          // Harita ekranına git
          navigation.navigate("Home")
        } else if (notification.actionText === "Sürücüyü Ara") {
          // Arama işlemi
          console.log("Sürücüyü ara")
        } else if (notification.actionText === "Ödeme Yap") {
          // Ödeme ekranına git
          navigation.navigate("Payments")
        } else if (notification.actionText === "Güzergahı Göster") {
          // Güzergah ekranına git
          console.log("Güzergahı göster")
        }
        break
      case "link":
        if (notification.actionText === "Sürücü Bilgilerini Gör") {
          // Sürücü bilgileri ekranına git
          console.log("Sürücü bilgilerini göster")
        } else if (notification.actionText === "Ödeme Geçmişini Gör") {
          // Ödeme geçmişi ekranına git
          console.log("Ödeme geçmişini göster")
        }
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Bildirim Detayı" showBackButton={true} onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.main} />
        </View>
      </SafeAreaView>
    )
  }

  if (!notification) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Bildirim Detayı" showBackButton={true} onBackPress={() => navigation.goBack()} />
        <View style={styles.errorContainer}>
          <Iconify icon="mdi:alert-circle" size={wScale(64)} color={Colors.status.error} />
          <Text style={styles.errorTitle}>Bildirim Bulunamadı</Text>
          <Text style={styles.errorText}>İstediğiniz bildirim bulunamadı veya silinmiş olabilir.</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Bildirim Detayı" showBackButton={true} onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(notification.type) }]}>
            <Iconify icon={getNotificationIcon(notification.type)} size={wScale(24)} color={Colors.neutral.white} />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.timeText}>
              {notification.time} - {notification.date}
            </Text>
          </View>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{notification.fullContent}</Text>
        </View>

        {notification.actionType !== "none" && notification.actionText && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: getNotificationColor(notification.type) }]}
            onPress={handleActionPress}
          >
            <Text style={styles.actionButtonText}>{notification.actionText}</Text>
          </TouchableOpacity>
        )}
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
  headerContainer: {
    flexDirection: "row",
    marginBottom: hScale(20),
  },
  iconContainer: {
    width: wScale(48),
    height: wScale(48),
    borderRadius: wScale(24),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wScale(16),
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.large),
    color: Colors.neutral.grey5,
    marginBottom: hScale(4),
  },
  timeText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
  },
  messageContainer: {
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(12),
    padding: wScale(16),
    marginBottom: hScale(20),
  },
  messageText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
    lineHeight: wScale(24),
  },
  actionButton: {
    paddingVertical: hScale(12),
    borderRadius: wScale(12),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hScale(30),
  },
  actionButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.white,
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
})

export default NotificationDetailScreen

