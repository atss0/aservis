"use client"
import React from "react"
import { useState, useEffect, useRef } from "react"
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Animated, Platform, Dimensions } from "react-native"
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps"
import { Iconify } from "react-native-iconify"
import Header from "../../components/Header"
import BusStatusCard from "../../components/BusStatusCard"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import axios from "axios"
import { API_URL } from "@env"
import { distMeters } from "../../utils/haversine"   // yolu kendine göre ayarla

const { width, height } = Dimensions.get("window")
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.02
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

type BusGroup = { coords: { latitude: number; longitude: number }; childIds: number[] }
interface RideFlag { picked: boolean; dropped: boolean }

const HomeScreen = () => {
  const userState = useSelector((state: RootState) => state.User)
  const mapRef = useRef<MapView>(null)
  const slideAnim = useRef(new Animated.Value(0)).current
  const pollRef = useRef<NodeJS.Timeout | null>(null)
  const ACTIVE_INTERVAL = 3_000          // 10 sn
  const INACTIVE_INTERVAL = 60_000          // 1 dk

  const childState = useSelector((s: RootState) => s.Child)
  const approachState = useSelector((s: RootState) => s.Approach)
  const OUTER_RADIUS = approachState.outerRadius
  const INNER_RADIUS = approachState.innerRadius
  const [rideFlags, setRideFlags] = useState<Record<number, RideFlag>>({})

  /* -------------------- 1) Çocuklardan gelen servis konumları -------------- */
  const [busGroups, setBusGroups] = useState<Record<string, BusGroup>>({})

  /* -------------------- 2) Varsayılan UI durumları ------------------------- */
  const [busInfoVisible, setBusInfoVisible] = useState(false)
  const [busStatus, setBusStatus] = useState<"Yolda" | "Yaklaşıyor" | "Geldi">("Yolda")
  const [showBusInfo, setShowBusInfo] = useState(false)

  /* -------------------- 3) Harita başlangıç bölgesi ------------------------ */
  const firstChild = childState.children?.[0]
  console.log(firstChild, "firstChild")
  const initialRegion = {
      latitude: +firstChild.pickup_lat, longitude: +firstChild.pickup_lng,
      latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA
    }

  // Tek yerden yönetilecek
  const scheduleNextPoll = (ms: number) => {
    if (pollRef.current) clearTimeout(pollRef.current)
    pollRef.current = setTimeout(fetchStatuses, ms)
  }

  const fetchStatuses = async () => {
    try {
      const results = await Promise.all(
        childState.children!.map(async (c) => {
          const { data } = await axios.get(
            `${API_URL}/parent/child/${c.id}/status`,
            { headers: { Authorization: `Bearer ${userState.token}` } }
          )

          if (data.message || data.ride_status !== "active") return null
          rideFlags[c.id] = { picked: !!data.picked_up, dropped: !!data.dropped_off }
          const { last_location } = data
          return { childId: c.id, lat: +last_location.lat, lng: +last_location.lng }
        })
      )

      const next: Record<string, BusGroup> = {}
      results.forEach((r) => {
        if (!r) return
        const k = `${r.lat.toFixed(5)}_${r.lng.toFixed(5)}`
        if (!next[k]) next[k] = { coords: { latitude: r.lat, longitude: r.lng }, childIds: [r.childId] }
        else next[k].childIds.push(r.childId)
      })
      setBusGroups(next)

      let nearest = Infinity
      childState.children!.forEach(child => {
        const pickLat = +child.pickup_lat, pickLng = +child.pickup_lng
        Object.values(next).forEach(bg => {
          const d = distMeters(pickLat, pickLng, bg.coords.latitude, bg.coords.longitude)
          if (d < nearest) nearest = d
        })
      })

      let status: "Yolda" | "Yaklaşıyor" | "Geldi" = "Yolda"
      if (nearest <= INNER_RADIUS) status = "Geldi"
      else if (nearest <= OUTER_RADIUS) status = "Yaklaşıyor"
      setBusStatus(status)

      const hasActive = Object.keys(next).length > 0
      setBusInfoVisible(hasActive)
      scheduleNextPoll(hasActive ? ACTIVE_INTERVAL : INACTIVE_INTERVAL)

    } catch (e: any) {
      console.log("status fetch error", e?.response?.data || e.message)
      scheduleNextPoll(INACTIVE_INTERVAL)
    }
  }

  useEffect(() => {
    if (!childState.children?.length) return
    fetchStatuses()                 // mount'ta ilk çekim
    return () => { if (pollRef.current) clearTimeout(pollRef.current) }
  }, [childState.children])

  // Ev konumuna git
  const goToHomeLocation = () => {
    if (firstChild) {
      mapRef.current?.animateToRegion({
        latitude: parseFloat(firstChild.pickup_lat),
        longitude: parseFloat(firstChild.pickup_lng),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      })
    }
  }

  // Tüm noktaları görecek şekilde haritayı ayarla
  const fitToMarkers = () => {
    const markerIDs = ["bus", ...childState.children.flatMap((_, i) => [`pickup-${i}`, `dropoff-${i}`])]
    mapRef.current?.fitToSuppliedMarkers(markerIDs, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Servis Takip" rightIcon="mdi:bell" onRightPress={() => console.log("Bildirimler")} />

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          showsBuildings={true}
          showsTraffic={false}
          showsIndoors={true}
        >
          {childState.children?.map((child, index) => (
            <React.Fragment key={`child-${index}`}>
              {/* Pickup Marker */}
              <Marker
                coordinate={{
                  latitude: parseFloat(child.pickup_lat),
                  longitude: parseFloat(child.pickup_lng),
                }}
                identifier={`pickup-${index}`}
              >
                <View style={styles.pickupMarker}>
                  <Iconify icon="mdi:human-child" size={20} color="#fff" />
                </View>
              </Marker>

              {/* Dış çember */}
              <Circle
                center={{
                  latitude: parseFloat(child.pickup_lat),
                  longitude: parseFloat(child.pickup_lng),
                }}
                radius={OUTER_RADIUS}
                strokeColor="rgba(0, 128, 255, 0.5)"
                fillColor="rgba(0, 128, 255, 0.15)"
              />

              {/* İç çember */}
              <Circle
                center={{
                  latitude: parseFloat(child.pickup_lat),
                  longitude: parseFloat(child.pickup_lng),
                }}
                radius={INNER_RADIUS}
                strokeColor="rgba(0, 200, 100, 0.7)"
                fillColor="rgba(0, 200, 100, 0.3)"
              />

              <Marker
                identifier={`dropoff-${index}`}
                coordinate={{
                  latitude: parseFloat(child.dropoff_lat),
                  longitude: parseFloat(child.dropoff_lng),
                }}
                title={`${child.name} - Bırakılma Noktası`}
                description={`Saat: ${child.dropoff_time}`}
              >
                <View style={styles.dropoffMarker}>
                  <Iconify icon="mdi:school" size={wScale(20)} color={Colors.neutral.white} />
                </View>
              </Marker>
            </React.Fragment>
          ))}

          {Object.entries(busGroups).map(([key, g]) => (
            <Marker key={`bus_${key}`} coordinate={g.coords} identifier={`bus_${key}`}>
              <View style={styles.busMarker}>
                <Iconify icon="mdi:bus" size={20} color="#fff" />
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Harita kontrolleri */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.mapControlButton} onPress={fetchStatuses}>
            <Iconify icon="mdi:reload" size={wScale(24)} color={Colors.primary.main} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.mapControlButton} onPress={goToHomeLocation}>
            <Iconify icon="mdi:home" size={wScale(24)} color={Colors.primary.main} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.mapControlButton} onPress={fitToMarkers}>
            <Iconify icon="mdi:fit-to-screen" size={wScale(24)} color={Colors.primary.main} />
          </TouchableOpacity>
        </View>

        {/* Servis durum kartı - şimdi ekranın altında */}
        {busInfoVisible && (
          <View style={styles.busStatusCardContainer}>
            <BusStatusCard 
              status={busStatus} 
              flags={rideFlags} 
              getName={(id) => childState.children?.find(child => child.id === id)?.name || 'Çocuk'} 
              onPress={() => setShowBusInfo(true)} 
            />
          </View>
        )}

        {/* Servis bilgisi paneli */}


        {/* Servis bilgi paneli */}
        <Animated.View
          style={[
            styles.busInfoPanel,
            { transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [200, 0] }) }], opacity: slideAnim }
          ]}
          pointerEvents={showBusInfo ? "auto" : "none"}
        >
          <View style={styles.busInfoHeader}>
            <View style={styles.busInfoHeaderLeft}>
              <Text style={styles.busInfoTitle}>Servis Bilgisi</Text>
              <View
                style={[
                  styles.busStatusBadge,
                  {
                    backgroundColor:
                      busStatus === "Yolda"
                        ? Colors.status.info
                        : busStatus === "Yaklaşıyor"
                          ? Colors.status.warning
                          : Colors.status.success,
                  },
                ]}
              >
                <Text style={styles.busStatusText}>{busStatus}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setShowBusInfo(false)}>
              <Iconify icon="mdi:close" size={wScale(24)} color={Colors.neutral.grey5} />
            </TouchableOpacity>
          </View>

          <View style={styles.busInfoContent}>
            <View style={styles.busInfoItem}>
              <Iconify icon="mdi:clock-outline" size={wScale(20)} color={Colors.neutral.grey4} />
            </View>

            <View style={styles.busInfoItem}>
              <Iconify icon="mdi:account-outline" size={wScale(20)} color={Colors.neutral.grey4} />
              <Text style={styles.busInfoText}>Sürücü: Ahmet Yılmaz</Text>
            </View>

            <View style={styles.busInfoItem}>
              <Iconify icon="mdi:phone-outline" size={wScale(20)} color={Colors.neutral.grey4} />
              <Text style={styles.busInfoText}>Telefon: 0532 123 45 67</Text>
            </View>

            <View style={styles.busInfoItem}>
              <Iconify icon="mdi:license" size={wScale(20)} color={Colors.neutral.grey4} />
              <Text style={styles.busInfoText}>Plaka: 34 ABC 123</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.callButton} onPress={() => console.log("Sürücüyü Ara")}>
            <Iconify icon="mdi:phone" size={wScale(20)} color={Colors.neutral.white} />
            <Text style={styles.callButtonText}>Sürücüyü Ara</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  homeMarker: {
    width: wScale(36),
    height: wScale(36),
    borderRadius: wScale(18),
    backgroundColor: Colors.map.homeMarker,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.neutral.white,
  },
  busMarker: {
    width: wScale(36),
    height: wScale(36),
    borderRadius: wScale(18),
    backgroundColor: Colors.map.busMarker,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.neutral.white,
  },
  mapControls: {
    position: "absolute",
    top: hScale(16),
    right: wScale(16),
    backgroundColor: Colors.neutral.white,
    borderRadius: wScale(12),
    padding: wScale(4),
  },
  mapControlButton: {
    width: wScale(40),
    height: wScale(40),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hScale(4),
  },
  busStatusCardContainer: {
    position: "absolute",
    bottom: hScale(20),
    left: 0,
    right: 0,
    zIndex: 1,
  },
  busInfoPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: wScale(20),
    borderTopRightRadius: wScale(20),
    padding: wScale(20),
    paddingBottom: hScale(Platform.OS === "ios" ? 30 : 20),
    zIndex: 2, // Servis durum kartının üzerinde görünmesi için
  },
  busInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hScale(16),
  },
  busInfoHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  busInfoTitle: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.large),
    color: Colors.neutral.grey5,
    marginRight: wScale(10),
  },
  busStatusBadge: {
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(4),
    borderRadius: wScale(12),
  },
  busStatusText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.white,
  },
  busInfoContent: {
    marginBottom: hScale(20),
  },
  busInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hScale(12),
  },
  busInfoText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
    marginLeft: wScale(10),
  },
  callButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary.main,
    borderRadius: wScale(12),
    paddingVertical: hScale(12),
  },
  callButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.white,
    marginLeft: wScale(8),
  },
  pickupMarker: {
    width: wScale(34),
    height: wScale(34),
    borderRadius: wScale(17),
    backgroundColor: "#10B981", // yeşil
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.neutral.white,
  },
  dropoffMarker: {
    width: wScale(34),
    height: wScale(34),
    borderRadius: wScale(17),
    backgroundColor: "#3B82F6", // mavi
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.neutral.white,
  },
})

export default HomeScreen

