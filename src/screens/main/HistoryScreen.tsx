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
import axios from "axios"
import { API_URL } from "@env"
import storage from "../../storage"
import { useSelector } from "react-redux"

type ApiRide = {
  id: number; vehicle: { plate_number: string }
  started_at: string; ended_at: string | null; status: "active" | "completed"
}

type Trip = {                       // ekranın kullandığı sade model
  id: string
  date: string            // “22 Haz” gibi
  pickupTime: string       // HH:mm
  dropoffTime: string       // HH:mm veya “—”
  driverName: string       // elimizde yok; plaka gösterelim
  status: "active" | "completed"
}

const HistoryScreen = ({ navigation }: any) => {
  const [trips, setTrips] = useState<any>([])
  const [filteredTrips, setFilteredTrips] = useState<any>(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const userState = useSelector((state: any) => state.User)
  const childState = useSelector((state: any) => state.Child)

  useEffect(() => {
    let isMounted = true;
  
    const fetchRides = async () => {
      setLoading(true);
  
      try {
        /* 1️⃣ – tüm çocuklara API çağrıları */
        const calls = childState.children.map((child: any) =>
          axios.get<{rides: ApiRide[]}>(
            `${API_URL}/parent/child/${child.id}/rides`,
            { headers:{ Authorization:`Bearer ${userState.token}` } }
          ).then(res => ({ childId: child.id, rides: res.data.rides }))
        );
  
        const responses = await Promise.all(calls);
  
        /* 2️⃣ – tekrar etmeyen Trip listesi oluştur */
        const uniq = new Map<string, Trip>();     // key = rideId-childId
  
        responses.forEach(({ childId, rides }) => {
          rides.forEach((r: any) => {
            const key = `${r.id}-${childId}`;
            if (uniq.has(key)) return;            // zaten eklenmiş
  
            const start = new Date(r.started_at.replace(" ", "T"));
            const end   = r.ended_at ? new Date(r.ended_at.replace(" ", "T")) : null;
            const fmt   = (d:Date)=> d.toLocaleTimeString("tr-TR",{hour:"2-digit", minute:"2-digit"});
  
            uniq.set(key, {
              id          : key,                  // FlatList key
              date        : start.toLocaleDateString("tr-TR",{day:"2-digit", month:"short"}),
              pickupTime  : fmt(start),
              dropoffTime : end ? fmt(end) : "—",
              driverName  : r.vehicle.plate_number,
              status      : r.status,
            });
          });
        });
  
        if (isMounted) {
          const arr = Array.from(uniq.values())
            .sort((a,b)=> Number(b.id.split("-")[0]) - Number(a.id.split("-")[0])); // rideId büyükten küçüğe
          setTrips(arr);
          setFilteredTrips(arr);
        }
      } catch (err:any) {
        console.log("ride fetch err", err?.response?.data || err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
  
    fetchRides();
    return () => { isMounted = false };
  }, []);        // deps boş; sadece mount’ta çalışsın


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

        {/* Yolculuk Listesi */}
        {loading ? (
          renderLoading()
        ) : (
          <FlatList
            data={trips}
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

