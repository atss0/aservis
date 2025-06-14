"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native"
import { Iconify } from "react-native-iconify"
import Header from "../../components/Header"
import TripHistoryCard from "../../components/TripHistoryCard"
import HistoryFilter from "../../components/HistoryFilter"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"

// Örnek veri
const DUMMY_TRIPS = [
  {
    id: "1",
    date: "12 May",
    pickupTime: "07:30",
    dropoffTime: "08:15",
    driverName: "Ahmet Yılmaz",
    status: "onTime",
  },
  {
    id: "2",
    date: "11 May",
    pickupTime: "07:35",
    dropoffTime: "08:20",
    driverName: "Ahmet Yılmaz",
    status: "delayed",
  },
  {
    id: "3",
    date: "10 May",
    pickupTime: "07:30",
    dropoffTime: "08:10",
    driverName: "Mehmet Demir",
    status: "onTime",
  },
  {
    id: "4",
    date: "9 May",
    pickupTime: "07:30",
    dropoffTime: "08:15",
    driverName: "Ahmet Yılmaz",
    status: "onTime",
  },
  {
    id: "5",
    date: "8 May",
    pickupTime: "00:00",
    dropoffTime: "00:00",
    driverName: "Ahmet Yılmaz",
    status: "cancelled",
  },
  {
    id: "6",
    date: "7 May",
    pickupTime: "07:30",
    dropoffTime: "08:15",
    driverName: "Mehmet Demir",
    status: "onTime",
  },
  {
    id: "7",
    date: "6 May",
    pickupTime: "07:40",
    dropoffTime: "08:30",
    driverName: "Ahmet Yılmaz",
    status: "delayed",
  },
  {
    id: "8",
    date: "5 May",
    pickupTime: "07:30",
    dropoffTime: "08:15",
    driverName: "Mehmet Demir",
    status: "onTime",
  },
]

const HistoryScreen = ({ navigation }: any) => {
  const [trips, setTrips] = useState(DUMMY_TRIPS)
  const [filteredTrips, setFilteredTrips] = useState(DUMMY_TRIPS)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [monthlyStats, setMonthlyStats] = useState({
    total: 0,
    onTime: 0,
    delayed: 0,
    cancelled: 0,
  })

  // Filtreleme ve arama işlemlerini yönet
  useEffect(() => {
    setLoading(true)

    // Arama ve filtreleme işlemlerini simüle etmek için timeout kullanıyoruz
    const timer = setTimeout(() => {
      let result = [...trips]

      // Arama sorgusuna göre filtrele
      if (searchQuery) {
        result = result.filter(
          (trip) =>
            trip.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trip.date.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      // Duruma göre filtrele
      if (activeFilter !== "all") {
        result = result.filter((trip) => trip.status === activeFilter)
      }

      setFilteredTrips(result)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, activeFilter, trips])

  // Aylık istatistikleri hesapla
  useEffect(() => {
    const stats = {
      total: trips.length,
      onTime: trips.filter((trip) => trip.status === "onTime").length,
      delayed: trips.filter((trip) => trip.status === "delayed").length,
      cancelled: trips.filter((trip) => trip.status === "cancelled").length,
    }

    setMonthlyStats(stats)
  }, [trips])

  // Yolculuk detaylarına git
  const handleTripPress = (tripId: any) => {
    console.log(`Trip ${tripId} pressed`)
    navigation.navigate('TripDetail', { tripId });
  }

  // Filtre değişikliğini işle
  const handleFilterChange = (filter: any) => {
    setActiveFilter(filter)
  }

  // Arama sorgusunu temizle
  const clearSearch = () => {
    setSearchQuery("")
  }

  // Yolculuk kartını render et
  const renderTripItem = ({ item }: any) => (
    <TripHistoryCard
      date={item.date}
      pickupTime={item.pickupTime}
      dropoffTime={item.dropoffTime}
      driverName={item.driverName}
      status={item.status}
      onPress={() => handleTripPress(item.id)}
    />
  )

  // Liste boşsa gösterilecek bileşen
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Iconify icon="mdi:calendar-blank" size={wScale(64)} color={Colors.neutral.grey3} />
      <Text style={styles.emptyTitle}>Yolculuk Bulunamadı</Text>
      <Text style={styles.emptyText}>
        Seçilen filtrelere uygun yolculuk bulunamadı. Lütfen farklı bir filtre seçin veya aramanızı temizleyin.
      </Text>
    </View>
  )

  // Liste yükleniyorsa gösterilecek bileşen
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary.main} />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Geçmiş Yolculuklar" rightIcon="mdi:filter-variant" onRightPress={() => console.log("Filtreler")} />

      <View style={styles.content}>
        {/* Arama Çubuğu */}
        <View style={styles.searchContainer}>
          <Iconify icon="mdi:magnify" size={wScale(20)} color={Colors.neutral.grey4} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tarih veya sürücü ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.neutral.grey4}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={clearSearch}>
              <Iconify icon="mdi:close-circle" size={wScale(20)} color={Colors.neutral.grey4} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Aylık İstatistikler */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Mayıs 2023 İstatistikleri</Text>
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{monthlyStats.total}</Text>
              <Text style={styles.statLabel}>Toplam</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.status.success }]}>{monthlyStats.onTime}</Text>
              <Text style={styles.statLabel}>Zamanında</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.status.warning }]}>{monthlyStats.delayed}</Text>
              <Text style={styles.statLabel}>Gecikmeli</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.status.error }]}>{monthlyStats.cancelled}</Text>
              <Text style={styles.statLabel}>İptal</Text>
            </View>
          </View>
        </View>

        {/* Filtreler */}
        <HistoryFilter onFilterChange={handleFilterChange} activeFilter={activeFilter} />

        {/* Yolculuk Listesi */}
        {loading ? (
          renderLoading()
        ) : (
          <FlatList
            data={filteredTrips}
            renderItem={renderTripItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyList}
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
    padding: wScale(16),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(12),
    paddingHorizontal: wScale(12),
    marginBottom: hScale(16),
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
    paddingVertical: hScale(10),
    marginLeft: wScale(8),
  },
  statsContainer: {
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(12),
    padding: wScale(16),
    marginBottom: hScale(16),
  },
  statsTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
    marginBottom: hScale(12),
  },
  statsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.large),
    color: Colors.neutral.grey5,
  },
  statLabel: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.tiny),
    color: Colors.neutral.grey4,
    marginTop: hScale(4),
  },
  listContent: {
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
})

export default HistoryScreen

