"use client"

import { useState, useEffect, useRef } from "react"
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Animated, Platform, Dimensions } from "react-native"
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps"
import { Iconify } from "react-native-iconify"
import Header from "../../components/Header"
import BusStatusCard from "../../components/BusStatusCard"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"

const { width, height } = Dimensions.get("window")
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.02
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

// Örnek veriler (gerçek uygulamada API'den gelecek)
const INITIAL_REGION = {
  latitude: 41.0082,
  longitude: 28.9784,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
}

const BUS_LOCATION = {
  latitude: 41.0092,
  longitude: 28.9744,
}

const HOME_LOCATION = {
  latitude: 41.0082,
  longitude: 28.9784,
}

// Yaklaşma daireleri yarıçapları (metre cinsinden)
const OUTER_RADIUS = 500 // 500 metre
const INNER_RADIUS = 100 // 100 metre

const HomeScreen = () => {
  const mapRef = useRef<any>(null)
  const [busStatus, setBusStatus] = useState("Yolda") // 'Yolda', 'Yaklaşıyor', 'Geldi'
  const [estimatedTime, setEstimatedTime] = useState("15 dk")
  const [showBusInfo, setShowBusInfo] = useState(false)
  const slideAnim = useRef(new Animated.Value(0)).current

  // Servisin konumuna göre durumunu belirle
  useEffect(() => {
    // Gerçek uygulamada, bu hesaplama sunucu tarafında yapılabilir
    // veya haversine formülü kullanılarak iki nokta arası mesafe hesaplanabilir

    // Örnek olarak, rastgele bir durum atayalım
    const statuses = ["Yolda", "Yaklaşıyor", "Geldi"]
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    setBusStatus(randomStatus)

    // Tahmini varış süresini ayarla
    if (randomStatus === "Yolda") {
      setEstimatedTime("15 dk")
    } else if (randomStatus === "Yaklaşıyor") {
      setEstimatedTime("5 dk")
    } else {
      setEstimatedTime("0 dk")
    }
  }, [])

  // Servis bilgisi panelini göster/gizle
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showBusInfo ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [showBusInfo, slideAnim])

  // Servis konumuna git
  const goToBusLocation = () => {
    mapRef.current?.animateToRegion({
      ...BUS_LOCATION,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    })
  }

  // Ev konumuna git
  const goToHomeLocation = () => {
    mapRef.current?.animateToRegion({
      ...HOME_LOCATION,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    })
  }

  // Tüm noktaları görecek şekilde haritayı ayarla
  const fitToMarkers = () => {
    mapRef.current?.fitToSuppliedMarkers(["bus", "home"], {
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
          initialRegion={INITIAL_REGION}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          showsBuildings={true}
          showsTraffic={false}
          showsIndoors={true}
        >
          {/* Ev konumu */}
          <Marker identifier="home" coordinate={HOME_LOCATION} title="Ev Konumu">
            <View style={styles.homeMarker}>
              <Iconify icon="mdi:home" size={wScale(20)} color={Colors.neutral.white} />
            </View>
          </Marker>

          {/* Dış yaklaşma dairesi */}
          <Circle
            center={HOME_LOCATION}
            radius={OUTER_RADIUS}
            fillColor={Colors.map.outerRadius}
            strokeColor={Colors.primary.main}
            strokeWidth={1}
          />

          {/* İç yaklaşma dairesi */}
          <Circle
            center={HOME_LOCATION}
            radius={INNER_RADIUS}
            fillColor={Colors.map.innerRadius}
            strokeColor={Colors.primary.main}
            strokeWidth={1}
          />

          {/* Servis konumu */}
          <Marker
            identifier="bus"
            coordinate={BUS_LOCATION}
            title="Servis Konumu"
            description={`Tahmini varış: ${estimatedTime}`}
            onPress={() => setShowBusInfo(!showBusInfo)}
          >
            <View style={styles.busMarker}>
              <Iconify icon="mdi:bus" size={wScale(20)} color={Colors.neutral.white} />
            </View>
          </Marker>
        </MapView>

        {/* Harita kontrolleri */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.mapControlButton} onPress={goToBusLocation}>
            <Iconify icon="mdi:bus" size={wScale(24)} color={Colors.primary.main} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.mapControlButton} onPress={goToHomeLocation}>
            <Iconify icon="mdi:home" size={wScale(24)} color={Colors.primary.main} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.mapControlButton} onPress={fitToMarkers}>
            <Iconify icon="mdi:fit-to-screen" size={wScale(24)} color={Colors.primary.main} />
          </TouchableOpacity>
        </View>

        {/* Servis durum kartı - şimdi ekranın altında */}
        <View style={styles.busStatusCardContainer}>
          <BusStatusCard
            status={busStatus as "Yolda" | "Yaklaşıyor" | "Geldi"}
            estimatedTime={estimatedTime}
            onPress={() => setShowBusInfo(true)}
          />
        </View>

        {/* Servis bilgi paneli */}
        <Animated.View
          style={[
            styles.busInfoPanel,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [200, 0],
                  }),
                },
              ],
              opacity: slideAnim,
              // Eğer panel görünmüyorsa, dokunma olaylarını engelle
              pointerEvents: showBusInfo ? "auto" : "none",
            },
          ]}
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
              <Text style={styles.busInfoText}>Tahmini Varış: {estimatedTime}</Text>
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
})

export default HomeScreen

