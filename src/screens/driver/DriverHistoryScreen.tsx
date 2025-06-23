"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { Iconify } from "react-native-iconify"
import Header from "../../components/Header"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"
import axios from "axios"
import { API_URL } from "@env"
import { useSelector } from "react-redux"
import TripHistoryCard from "../../components/TripHistoryCard"
import HistoryFilter from "../../components/HistoryFilter"

/* ---------- küçük yardımcılar ---------- */
const fmtDate = (iso: string) => {
  const d = new Date(iso.replace(" ", "T"))
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })
}
const fmtTime = (iso: string) => {
  const d = new Date(iso.replace(" ", "T"))
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
}
const diffHHMM = (start: string, end: string | null) => {
  if (!end) return "—"
  const s = new Date(start.replace(" ", "T")).getTime()
  const e = new Date(end.replace(" ", "T")).getTime()
  const min = Math.round((e - s) / 60_000)
  return `${Math.floor(min / 60)}s ${min % 60}dk`
}

type ApiRide = {
  id: number; started_at: string; ended_at: string | null;
  status: "active" | "completed" | "cancelled";
  vehicle: { plate_number: string }
}

const DriverHistoryScreen = ({ navigation }: any) => {
  const token = useSelector((s: any) => s.User.token)
  const [rides, setRides] = useState<ApiRide[]>([])
  const [filtered, setFiltered] = useState<ApiRide[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setFilter] = useState<"all" | "active" | "completed" | "cancelled">("all")

  useEffect(() => {
    let cancelled = false               // eski “mounted” yerine anlaşılır isim

    const fetchRides = async () => {
      try {
        const { data } = await axios.get<{ rides: ApiRide[] }>(
          `${API_URL}/driver/rides`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (!cancelled) {               // component hâlâ ekrandaysa
          const list = data.rides.sort((a, b) => b.id - a.id)
          setRides(list)
          setFiltered(list)
        }
      } catch (err: any) {
        console.log("driver rides err", err?.response?.data || err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchRides()                        // 🚀 ilk çağrı

    return () => { cancelled = true }   // 🧹 cleanup
  }, [])

  /* ----------------- FİLTRE -------------------- */
  useEffect(() => {
    if (!rides) return
    const f = activeFilter === "all"
      ? rides
      : rides.filter(r => r.status === activeFilter)
    setFiltered(f)
  }, [activeFilter, rides])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return Colors.status.success
      case "completed_with_issues":
        return Colors.status.warning
      case "cancelled":
        return Colors.status.error
      default:
        return Colors.neutral.grey4
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Tamamlandı"
      case "completed_with_issues":
        return "Sorunlu Tamamlandı"
      case "cancelled":
        return "İptal Edildi"
      default:
        return "Bilinmiyor"
    }
  }

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DriverRouteDetail", { routeId: item.id })}>
      <View style={styles.header}>
        <Text style={styles.date}>{fmtDate(item.started_at)}</Text>
        <View style={[styles.badge,
        {
          backgroundColor: item.status === "completed" ? Colors.status.success
            : item.status === "active" ? Colors.status.info
              : Colors.status.error
        }]}>
          <Text style={styles.badgeTxt}>
            {item.status === "completed" ? "Tamamlandı" :
              item.status === "active" ? "Devam Ediyor" : "İptal"}
          </Text>
        </View>
      </View>

      <Text style={styles.routeName}>Plaka {item.vehicle ? item.vehicle.plate_number : "yok"}</Text>

      <View style={styles.row}>
        <Iconify icon="mdi:clock-outline" size={wScale(16)} color={Colors.neutral.grey4} />
        <Text style={styles.rowTxt}>
          {fmtTime(item.started_at)} – {item.ended_at ? fmtTime(item.ended_at) : "—"}
        </Text>
        <Iconify icon="mdi:timer-outline" size={wScale(16)} color={Colors.neutral.grey4} style={{ marginLeft: 8 }} />
        <Text style={styles.rowTxt}>{diffHHMM(item.started_at, item.ended_at)}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Rota Geçmişi" />

      <View style={styles.content}>
        {loading
          ? <ActivityIndicator style={{ marginTop: 30 }} size="large" color={Colors.primary.main} />
          : <FlatList
            data={filtered}
            renderItem={renderItem}
            /* <<<— ▶️  benzersiz key problemi buradan giderildi  */
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ padding: 16 }}
          />}
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
  listContent: {
    paddingBottom: hScale(20),
  },
  historyItem: {
    backgroundColor: Colors.neutral.white,
    borderRadius: wScale(12),
    padding: wScale(16),
    marginBottom: hScale(12),
    borderWidth: 1,
    borderColor: Colors.neutral.grey2,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hScale(8),
  },
  historyDate: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
  },
  statusBadge: {
    paddingHorizontal: wScale(8),
    paddingVertical: hScale(4),
    borderRadius: wScale(12),
  },
  statusText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.tiny),
    color: Colors.neutral.white,
  },
  routeName: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey4,
    marginBottom: hScale(12),
  },
  historyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hScale(12),
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginLeft: wScale(4),
  },
  studentStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(8),
    paddingVertical: hScale(8),
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
  },
  statLabel: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.tiny),
    color: Colors.neutral.grey4,
    marginTop: hScale(2),
  },
  statDivider: {
    width: 1,
    height: hScale(30),
    backgroundColor: Colors.neutral.grey3,
  },
  card: {
    backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: Colors.neutral.grey2
  },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  date: {
    fontFamily: FontFamily.semiBold, fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5
  },
  badge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  badgeTxt: {
    fontFamily: FontFamily.medium, fontSize: wScale(FontSizes.tiny),
    color: "#fff"
  },
  row: { flexDirection: "row", alignItems: "center" },
  rowTxt: {
    fontFamily: FontFamily.regular, fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4, marginLeft: 4
  },
})

export default DriverHistoryScreen
