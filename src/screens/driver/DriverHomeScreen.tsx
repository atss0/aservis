"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking, Alert } from "react-native"
import { Iconify } from "react-native-iconify"
import Header from "../../components/Header"
import DriverRouteCard from "../../components/DriverRouteCard"
import StudentCard from "../../components/StudentCard"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import axios from "axios"
import { API_URL } from "@env"
import { Modal, FlatList } from "react-native"
import { setPickedUp, setDroppedOff, clearRide } from "../../redux/RideProgressSlice"
import Geolocation from '@react-native-community/geolocation'

interface Vehicle { id: number; plate_number: string }

// Route tipini tanımlayalım
interface Route {
  id: string
  name: string
  startTime: string
  endTime: string
  status: "not_started" | "in_progress" | "completed"
  totalStudents: number
  pickedUpStudents: number
}

// Student tipini tanımlayalım
interface Student {
  id: number
  name: string
  grade: string
  address: string
  parentPhone: string
  status: "waiting" | "picked_up" | "dropped_off"
  pickupTime: string
  photo: string
}

const DriverHomeScreen = ({ navigation }: any) => {
  const driverChildState = useSelector((state: RootState) => state.DriverChild)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [vehicles, setVehicles] = useState<Vehicle[]>([])        /* NEW */
  const [vehicleModal, setVehicleModal] = useState(false)                /* NEW */
  const [chosenVehicle, setChosenVehicle] = useState<Vehicle | null>(null) /* NEW */
  const userState = useSelector((s: RootState) => s.User)
  const [ride, setRide] = useState<any>(null)
  const cardStatus = ride?.status ?? "not_started"
  const authHeader = { headers: { Authorization: `Bearer ${userState.token}` } }
  const dispatch = useDispatch()
  const statusMap = useSelector((s: RootState) => s.RideProgress.byId)
  const locTimer = useRef<NodeJS.Timeout | null>(null)
  const watchId = useRef<number | null>(null)

  const postLocation = (rideId: number | null, lat?: number, lng?: number) => {
    // Ride ID veya koordinatlar geçersizse hiç deneme
    if (!rideId || lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
      console.log("postLocation skipped – invalid data", { rideId, lat, lng })
      return
    }

    axios.post(
      `${API_URL}/rides/${rideId}/location`,
      { lat: +lat.toFixed(6), lng: +lng.toFixed(6) },
      authHeader
    ).catch(err =>
      console.log("loc err", err?.response?.data || err.message)
    )
  }

  const startLocationTracking = (rideId: number) => {
    Geolocation.requestAuthorization?.()

    // 5 sn'de bir
    locTimer.current = setInterval(() => {
      Geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords
          postLocation(rideId, latitude, longitude)   // ⬅ rideId param
        },
        err => console.log("geo err", err),
        { enableHighAccuracy: true, timeout: 1e4, maximumAge: 0 }
      )
    }, 5000)

    // isteğe bağlı aralıksız izleme
    watchId.current = Geolocation.watchPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        postLocation(rideId, latitude, longitude)
      },
      err => console.log("watch err", err),
      { enableHighAccuracy: true, distanceFilter: 20 }
    )
  }

  const stopLocationTracking = () => {
    if (locTimer.current) { clearInterval(locTimer.current); locTimer.current = null }
    if (watchId.current !== null) { Geolocation.clearWatch(watchId.current); watchId.current = null }
  }

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/driver/vehicles`,
          { headers: { Authorization: `Bearer ${userState.token}` } }
        )
        setVehicles(data)
      } catch (e: any) {
        console.log("vehicles fetch error", e?.response?.data || e.message)
      }
    }
    fetchVehicles()
  }, [])

  // Zamanı güncelle
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentTime(new Date())
  //   }, 1000)

  //   return () => clearInterval(timer)
  // }, [])

  useEffect(() => {
    const fetchCurrentRide = async () => {
      try {
        const { data } = await axios.get<{ rides: any[] }>(
          `${API_URL}/driver/rides`, authHeader
        )
        // API sıralı döndüyse ilk eleman en güncel
        const latest = data.rides[0]
        if (latest && latest.status === "active") {
          setRide(latest)               // aktif rota state'e yüklendi
          startLocationTracking(latest.id)
        } else {
          setRide(null)
        }
      } catch (e: any) {
        console.log("ride history error", e?.response?.data || e.message)
      }
    }

    fetchCurrentRide()
  }, [])

  // Rotayı başlat
  const handleStartRoute = () => {
    if (!vehicles || vehicles.length === 0) {
      Alert.alert("Araç bulunamadı", "Lütfen önce size atanmış bir araç ekleyin.")
      return
    }
    setVehicleModal(true)
  }

  // Rotayı bitir
  const handleCompleteRoute = () => {
    axios.post(`${API_URL}/rides/${ride.id}/end`, {}, {
      headers: { Authorization: `Bearer ${userState.token}` },
    })
      .then((response) => {
        stopLocationTracking()
        setRide(null)
        dispatch(clearRide()) // Redux state'i temizle
        Alert.alert("Rota Tamamlandı", `Rota #${response.data.ride.id} başarıyla tamamlandı.`)
      })
      .catch((error) => {
        console.error("Failed to complete route:", error)
        Alert.alert("Hata", "Rotayı tamamlayamadık. Lütfen tekrar deneyin.")
      })
  }

  /* ------------------ BİNDİ ------------------ */
  const handlePickup = async (studentId: number) => {
    if (!ride) return                      // rota aktif değil
    try {
      await axios.post(
        `${API_URL}/rides/${ride.id}/student/${studentId}/pickup`,
        {},
        authHeader
      )
      dispatch(setPickedUp(studentId))
    } catch (e: any) {
      console.log("pickup error", e?.response?.data || e.message)
      Alert.alert("Hata", "Biniş kaydedilemedi.")
    }
  }

  /* ------------------ İNDİ ------------------ */
  const handleDropoff = async (studentId: number) => {
    if (!ride) return
    try {
      await axios.post(
        `${API_URL}/rides/${ride.id}/student/${studentId}/dropoff`,
        {},
        authHeader
      )
      dispatch(setDroppedOff(studentId))
    } catch (e: any) {
      console.log("dropoff error", e?.response?.data || e.message)
      Alert.alert("Hata", "İniş kaydedilemedi.")
    }
  }

  // Veliye telefon et
  const handleCallParent = (phone: string) => {
    const url = `tel:${phone}`
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url)
        } else {
          Alert.alert("Hata", "Telefon uygulaması açılamıyor.")
        }
      })
      .catch((err) => {
        console.error("Failed to open phone app:", err)
        Alert.alert("Hata", "Telefon uygulaması açılamıyor.")
      })
  }

  // Acil durum
  const handleEmergency = () => {
    Alert.alert("Acil Durum", "Acil durum bildirimi gönderilsin mi?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Gönder",
        onPress: () => {
          console.log("Emergency notification sent")
          Alert.alert("Bildirim Gönderildi", "Acil durum bildirimi gönderildi.")
        },
        style: "destructive",
      },
    ])
  }

  console.log(cardStatus)

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Şoför Paneli"
        rightIcon="mdi:alert-circle"
        onRightPress={handleEmergency}
        iconColor={Colors.status.error}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rota Kartı */}
        <DriverRouteCard status={cardStatus} students={driverChildState.students} currentTime={currentTime} onStartRoute={handleStartRoute} onCompleteRoute={handleCompleteRoute} />

        {/* Öğrenci Listesi */}
        <View style={styles.studentsSection}>
          <Text style={styles.sectionTitle}>
            Öğrenciler ({driverChildState.students.length})
          </Text>

          {driverChildState.students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              status={statusMap[student.id]}
              rideActive={!!ride && ride.status === "active"}  // rota aktif mi?
              onPickup={() => handlePickup(student.id)}      // API’ye /pickup
              onDropoff={() => handleDropoff(student.id)}    // API’ye /dropoff
              onCallParent={handleCallParent}
            />
          ))}
        </View>
      </ScrollView>
      <Modal
        visible={vehicleModal}
        animationType="slide"
        transparent
        onRequestClose={() => setVehicleModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Araç Seç</Text>

            <FlatList
              data={vehicles}
              keyExtractor={(v) => v.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.vehicleItem,
                    item.id === chosenVehicle?.id && styles.vehicleItemSelected,
                  ]}
                  onPress={() => setChosenVehicle(item)}
                >
                  <Iconify
                    icon="mdi:bus"
                    size={wScale(20)}
                    color={item.id === chosenVehicle?.id ? Colors.neutral.white : Colors.primary.main}
                  />
                  <Text
                    style={[
                      styles.vehicleText,
                      item.id === chosenVehicle?.id && { color: Colors.neutral.white },
                    ]}
                  >
                    {item.plate_number}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: Colors.neutral.grey2 }]}
                onPress={() => setVehicleModal(false)}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: chosenVehicle ? Colors.primary.main : Colors.neutral.grey3 },
                ]}
                disabled={!chosenVehicle}
                onPress={async () => {
                  try {
                    setVehicleModal(false)
                    const { data } = await axios.post(
                      `${API_URL}/rides/start`,
                      { vehicle_id: chosenVehicle!.id },
                      { headers: { Authorization: `Bearer ${userState.token}` } }
                    )
                    setRide(data.ride)
                    startLocationTracking(data.ride.id)
                    Alert.alert("Başlatıldı", `Ride #${data.ride.id} aktif.`)
                    // navigate / state update burada
                  } catch (e: any) {
                    console.log("ride start error", e?.response?.data || e.message)
                    Alert.alert("Hata", "Rota başlatılamadı.")
                  }
                }}
              >
                <Text style={styles.modalButtonText}>Başlat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  statusBadge: {
    paddingHorizontal: wScale(12),
    paddingVertical: hScale(6),
    borderRadius: wScale(16),
  },
  statusText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.white,
  },
  studentsSection: {
    marginBottom: hScale(24),
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
    marginBottom: hScale(12),
  },
  quickActions: {
    marginBottom: hScale(30),
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hScale(12),
    borderRadius: wScale(12),
    marginHorizontal: wScale(4),
  },
  actionButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.white,
    marginLeft: wScale(6),
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: Colors.neutral.white,
    borderRadius: wScale(12),
    padding: wScale(16),
  },
  modalTitle: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
    marginBottom: hScale(12),
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hScale(10),
    paddingHorizontal: wScale(12),
    borderRadius: wScale(8),
    marginBottom: hScale(6),
    backgroundColor: Colors.neutral.grey1,
  },
  vehicleItemSelected: {
    backgroundColor: Colors.primary.main,
  },
  vehicleText: {
    marginLeft: wScale(8),
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey5,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: hScale(12),
  },
  modalButton: {
    paddingVertical: hScale(10),
    paddingHorizontal: wScale(16),
    borderRadius: wScale(8),
    marginLeft: wScale(8),
  },
  modalButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.white,
  },
})

export default DriverHomeScreen
