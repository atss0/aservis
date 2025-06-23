"use client"

import { useState, useRef } from "react"
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from "react-native"
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps"
import { Iconify } from "react-native-iconify"
import Header from "../../components/Header"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"

// Örnek rota ve öğrenci konumları
const ROUTE_COORDINATES = [
  { latitude: 41.0082, longitude: 28.9784 },
  { latitude: 41.0092, longitude: 28.9744 },
  { latitude: 41.0102, longitude: 28.9704 },
  { latitude: 41.0112, longitude: 28.9664 },
  { latitude: 41.0122, longitude: 28.9624 },
]

const STUDENT_LOCATIONS = [
  {
    id: "1",
    name: "Ayşe Yılmaz",
    coordinate: { latitude: 41.0092, longitude: 28.9744 },
    status: "picked_up",
  },
  {
    id: "2",
    name: "Mehmet Demir",
    coordinate: { latitude: 41.0102, longitude: 28.9704 },
    status: "waiting",
  },
  {
    id: "3",
    name: "Zeynep Kaya",
    coordinate: { latitude: 41.0112, longitude: 28.9664 },
    status: "waiting",
  },
]

const BUS_LOCATION = { latitude: 41.0087, longitude: 28.9754 }
const SCHOOL_LOCATION = { latitude: 41.0122, longitude: 28.9624 }

const DriverMapScreen = () => {
  const mapRef = useRef<any>(null)
  const [showTraffic, setShowTraffic] = useState(false)

  // Haritayı tüm noktaları gösterecek şekilde ayarla
  const fitToRoute = () => {
    const coordinates = [BUS_LOCATION, ...STUDENT_LOCATIONS.map((s) => s.coordinate), SCHOOL_LOCATION]

    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    })
  }

  // Servis konumuna git
  const goToBusLocation = () => {
    mapRef.current?.animateToRegion({
      ...BUS_LOCATION,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
  }

  const getMarkerColor = (status: string) => {
    switch (status) {
      case "picked_up":
        return Colors.status.success
      case "waiting":
        return Colors.status.warning
      case "dropped_off":
        return Colors.neutral.grey4
      default:
        return Colors.primary.main
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Rota Haritası" />

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 41.0102,
            longitude: 28.9704,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          showsTraffic={showTraffic}
        >
          {/* Rota çizgisi */}
          <Polyline
            coordinates={ROUTE_COORDINATES}
            strokeColor={Colors.primary.main}
            strokeWidth={3}
            lineDashPattern={[5, 5]}
          />

          {/* Servis konumu */}
          <Marker coordinate={BUS_LOCATION} title="Servis Konumu">
            <View style={styles.busMarker}>
              <Iconify icon="mdi:bus" size={wScale(20)} color={Colors.neutral.white} />
            </View>
          </Marker>

          {/* Öğrenci konumları */}
          {STUDENT_LOCATIONS.map((student) => (
            <Marker
              key={student.id}
              coordinate={student.coordinate}
              title={student.name}
              description={student.status === "picked_up" ? "Alındı" : "Bekliyor"}
            >
              <View style={[styles.studentMarker, { backgroundColor: getMarkerColor(student.status) }]}>
                <Iconify
                  icon={student.status === "picked_up" ? "mdi:account-check" : "mdi:account-clock"}
                  size={wScale(16)}
                  color={Colors.neutral.white}
                />
              </View>
            </Marker>
          ))}

          {/* Okul konumu */}
          <Marker coordinate={SCHOOL_LOCATION} title="Okul">
            <View style={styles.schoolMarker}>
              <Iconify icon="mdi:school" size={wScale(20)} color={Colors.neutral.white} />
            </View>
          </Marker>
        </MapView>

        {/* Harita kontrolleri */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton} onPress={goToBusLocation}>
            <Iconify icon="mdi:bus" size={wScale(20)} color={Colors.primary.main} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={fitToRoute}>
            <Iconify icon="mdi:fit-to-screen" size={wScale(20)} color={Colors.primary.main} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, showTraffic && styles.controlButtonActive]}
            onPress={() => setShowTraffic(!showTraffic)}
          >
            <Iconify
              icon="mdi:traffic-light"
              size={wScale(20)}
              color={showTraffic ? Colors.neutral.white : Colors.primary.main}
            />
          </TouchableOpacity>
        </View>

        {/* Durum göstergeleri */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Durum Göstergeleri</Text>

          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.status.warning }]} />
              <Text style={styles.legendText}>Bekliyor</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.status.success }]} />
              <Text style={styles.legendText}>Alındı</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.secondary.main }]} />
              <Text style={styles.legendText}>Servis</Text>
            </View>
          </View>
        </View>
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
  busMarker: {
    width: wScale(36),
    height: wScale(36),
    borderRadius: wScale(18),
    backgroundColor: Colors.secondary.main,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.neutral.white,
  },
  studentMarker: {
    width: wScale(32),
    height: wScale(32),
    borderRadius: wScale(16),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.neutral.white,
  },
  schoolMarker: {
    width: wScale(36),
    height: wScale(36),
    borderRadius: wScale(18),
    backgroundColor: Colors.primary.main,
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
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButton: {
    width: wScale(40),
    height: wScale(40),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hScale(2),
    borderRadius: wScale(8),
  },
  controlButtonActive: {
    backgroundColor: Colors.primary.main,
  },
  legendContainer: {
    position: "absolute",
    bottom: hScale(20),
    left: wScale(16),
    backgroundColor: Colors.neutral.white,
    borderRadius: wScale(12),
    padding: wScale(12),
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey5,
    marginBottom: hScale(8),
  },
  legendItems: {
    gap: hScale(4),
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: wScale(12),
    height: wScale(12),
    borderRadius: wScale(6),
    marginRight: wScale(8),
  },
  legendText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey5,
  },
})

export default DriverMapScreen
