"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, Alert } from "react-native"
import { Iconify } from "react-native-iconify"
import Header from "../../components/Header"
import NotificationCard, { type NotificationType } from "../../components/NotificationCard"
import NotificationFilter from "../../components/NotificationFilter"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"

// Örnek bildirim verileri
interface Notification {
  id: string
  title: string
  message: string
  time: string
  date: string
  type: NotificationType
  isRead: boolean
}

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Servis Yaklaşıyor",
    message: "Servis aracı evinize yaklaşıyor. Tahmini varış süresi: 5 dakika.",
    time: "07:25",
    date: "12 May 2023",
    type: "info",
    isRead: false,
  },
  {
    id: "2",
    title: "Servis Gecikecek",
    message: "Servis aracı trafik nedeniyle 10 dakika gecikecek. Özür dileriz.",
    time: "07:15",
    date: "11 May 2023",
    type: "warning",
    isRead: true,
  },
  {
    id: "3",
    title: "Servis Geldi",
    message: "Servis aracı evinize ulaştı. Lütfen hazır olun.",
    time: "07:30",
    date: "10 May 2023",
    type: "success",
    isRead: true,
  },
  {
    id: "4",
    title: "Ödeme Hatırlatması",
    message: "Mayıs ayı servis ödemesi için son 3 gün. Lütfen ödemenizi yapın.",
    time: "14:00",
    date: "9 May 2023",
    type: "payment",
    isRead: false,
  },
  {
    id: "5",
    title: "Sürücü Değişikliği",
    message: "Yarından itibaren servis sürücünüz Mehmet Demir olarak değiştirilmiştir.",
    time: "16:30",
    date: "8 May 2023",
    type: "info",
    isRead: true,
  },
  {
    id: "6",
    title: "Servis İptal",
    message: "Yarınki servis hizmeti hava koşulları nedeniyle iptal edilmiştir.",
    time: "18:45",
    date: "7 May 2023",
    type: "error",
    isRead: true,
  },
  {
    id: "7",
    title: "Yeni Güzergah",
    message: "Servis güzergahı yol çalışması nedeniyle değiştirilmiştir. Yeni güzergah için tıklayın.",
    time: "12:30",
    date: "6 May 2023",
    type: "info",
    isRead: false,
  },
  {
    id: "8",
    title: "Mayıs Ayı Ödemesi",
    message: "Mayıs ayı servis ödemesi başarıyla alınmıştır. Teşekkür ederiz.",
    time: "09:15",
    date: "5 May 2023",
    type: "payment",
    isRead: true,
  },
]

const NotificationsScreen = ({ navigation }: any) => {
  const [notifications, setNotifications] = useState<Notification[]>(DUMMY_NOTIFICATIONS)
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(DUMMY_NOTIFICATIONS)
  const [activeFilter, setActiveFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Bildirimleri filtrele
  useEffect(() => {
    setLoading(true)

    // Filtreleme işlemini simüle etmek için timeout kullanıyoruz
    const timer = setTimeout(() => {
      let result = [...notifications]

      // Filtre tipine göre filtrele
      if (activeFilter === "unread") {
        result = result.filter((notification) => !notification.isRead)
      } else if (activeFilter !== "all") {
        result = result.filter((notification) => notification.type === activeFilter)
      }

      setFilteredNotifications(result)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [activeFilter, notifications])

  // Bildirimi okundu olarak işaretle
  const handleMarkAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, isRead: true } : notification,
    )
    setNotifications(updatedNotifications)
  }

  // Tüm bildirimleri okundu olarak işaretle
  const handleMarkAllAsRead = () => {
    Alert.alert("Tümünü Okundu İşaretle", "Tüm bildirimleri okundu olarak işaretlemek istediğinize emin misiniz?", [
      {
        text: "İptal",
        style: "cancel",
      },
      {
        text: "Evet",
        onPress: () => {
          const updatedNotifications = notifications.map((notification) => ({
            ...notification,
            isRead: true,
          }))
          setNotifications(updatedNotifications)
        },
      },
    ])
  }

  // Tüm bildirimleri temizle
  const handleClearAll = () => {
    Alert.alert("Tümünü Temizle", "Tüm bildirimleri silmek istediğinize emin misiniz?", [
      {
        text: "İptal",
        style: "cancel",
      },
      {
        text: "Evet",
        onPress: () => {
          setNotifications([])
        },
      },
    ])
  }

  // Yenileme işlemi
  const handleRefresh = () => {
    setRefreshing(true)
    // Gerçek uygulamada API'den yeni bildirimleri çekecek
    setTimeout(() => {
      setNotifications(DUMMY_NOTIFICATIONS)
      setRefreshing(false)
    }, 1000)
  }

  // Bildirime tıklama
  const handleNotificationPress = (notification: Notification) => {
    // Bildirimi okundu olarak işaretle
    if (!notification.isRead) {
      handleMarkAsRead(notification.id)
    }

    // Bildirim detay sayfasına git
    navigation.navigate("NotificationDetail", { notificationId: notification.id })
  }

  // Bildirim kartını render et
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <View style={{ height: hScale(120) + hScale(12) }}>
      <NotificationCard
        id={item.id}
        title={item.title}
        message={item.message}
        time={item.time}
        date={item.date}
        type={item.type}
        isRead={item.isRead}
        onPress={() => handleNotificationPress(item)}
        onMarkAsRead={() => handleMarkAsRead(item.id)}
      />
    </View>
  )

  // Liste boşsa gösterilecek bileşen
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Iconify icon="mdi:bell-off-outline" size={wScale(64)} color={Colors.neutral.grey3} />
      <Text style={styles.emptyTitle}>Bildirim Yok</Text>
      <Text style={styles.emptyText}>
        {activeFilter === "all" ? "Henüz hiç bildiriminiz yok." : "Seçilen filtreye uygun bildirim bulunamadı."}
      </Text>
    </View>
  )

  // Liste yükleniyorsa gösterilecek bileşen
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary.main} />
    </View>
  )

  // Okunmamış bildirim sayısını hesapla
  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Bildirimler"
        rightIcon={notifications.length > 0 ? "mdi:dots-vertical" : undefined}
        onRightPress={() => {
          Alert.alert("Bildirim İşlemleri", "Lütfen bir işlem seçin", [
            {
              text: "İptal",
              style: "cancel",
            },
            {
              text: "Tümünü Okundu İşaretle",
              onPress: handleMarkAllAsRead,
            },
            {
              text: "Tümünü Temizle",
              onPress: handleClearAll,
              style: "destructive",
            },
          ])
        }}
      />

      <View style={styles.content}>
        {/* Bildirim Filtreleri */}
        <View style={styles.filterContainer}>
          <NotificationFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </View>

        {/* Bildirim Sayısı */}
        {notifications.length > 0 && (
          <View style={styles.countContainer}>
            <Text style={styles.countText}>
              Toplam <Text style={styles.countHighlight}>{notifications.length}</Text> bildirim
              {unreadCount > 0 && (
                <Text>
                  , <Text style={[styles.countHighlight, { color: Colors.primary.main }]}>{unreadCount}</Text> okunmamış
                </Text>
              )}
            </Text>
          </View>
        )}

        {/* Bildirim Listesi */}
        {loading ? (
          renderLoading()
        ) : (
          <FlatList
            data={filteredNotifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyList}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            getItemLayout={(data, index) => ({
              length: hScale(120) + hScale(12), // Kart yüksekliği + margin
              offset: (hScale(120) + hScale(12)) * index,
              index,
            })}
          />
        )}
      </View>
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
    paddingTop: 0, // Üst padding'i kaldıralım
  },
  countContainer: {
    paddingHorizontal: wScale(16),
    marginBottom: hScale(8),
  },
  countText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
  },
  countHighlight: {
    fontFamily: FontFamily.semiBold,
    color: Colors.neutral.grey5,
  },
  listContent: {
    paddingHorizontal: wScale(16),
    paddingBottom: hScale(20),
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: wScale(20),
    marginTop: hScale(40),
  },
  emptyTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.large),
    color: Colors.neutral.grey5,
    marginTop: hScale(16),
    marginBottom: hScale(8),
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey4,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    backgroundColor: Colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.grey2,
    marginBottom: hScale(8),
  },
})

export default NotificationsScreen

