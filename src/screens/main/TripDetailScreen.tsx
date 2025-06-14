import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from "react-native"
import { Iconify } from "react-native-iconify"
import Header from "../../components/Header"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"

// Örnek veri
const DUMMY_TRIP = {
  id: "1",
  date: "12 Mayıs 2023",
  pickupTime: "07:30",
  dropoffTime: "08:15",
  driverName: "Ahmet Yılmaz",
  driverPhone: "0532 123 45 67",
  driverPhoto: "https://randomuser.me/api/portraits/men/32.jpg",
  busPlate: "34 ABC 123",
  status: "onTime",
  route: [
    { time: "07:30", location: "Ev", status: "completed" },
    { time: "07:45", location: "Ara Durak", status: "completed" },
    { time: "08:15", location: "Okul", status: "completed" },
  ],
  notes: "Yolculuk sorunsuz tamamlandı.",
}

const TripDetailScreen = ({ navigation, route }: {navigation: any, route: any}) => {
  // Gerçek uygulamada, route.params.tripId kullanılarak API'den veri çekilecek
  const tripId = route?.params?.tripId || "1"
  const trip = DUMMY_TRIP // Gerçek uygulamada API'den alınacak

  // Duruma göre renk ve metin belirle
  const getStatusColor = () => {
    switch (trip.status) {
      case "onTime":
        return Colors.status.success
      case "delayed":
        return Colors.status.warning
      case "cancelled":
        return Colors.status.error
      default:
        return Colors.status.success
    }
  }

  const getStatusText = () => {
    switch (trip.status) {
      case "onTime":
        return "Zamanında Tamamlandı"
      case "delayed":
        return "Gecikmeli Tamamlandı"
      case "cancelled":
        return "İptal Edildi"
      default:
        return "Zamanında Tamamlandı"
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Yolculuk Detayı" showBackButton={true} onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tarih ve Durum */}
        <View style={styles.headerContainer}>
          <Text style={styles.dateText}>{trip.date}</Text>
          <View style={[styles.statusContainer, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        {/* Sürücü Bilgileri */}
        <View style={styles.driverContainer}>
          <View style={styles.driverHeader}>
            <Text style={styles.sectionTitle}>Sürücü Bilgileri</Text>
            <TouchableOpacity style={styles.callButton} onPress={() => console.log("Sürücüyü Ara")}>
              <Iconify icon="mdi:phone" size={wScale(16)} color={Colors.neutral.white} />
              <Text style={styles.callButtonText}>Ara</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.driverContent}>
            <Image source={{ uri: trip.driverPhoto }} style={styles.driverPhoto} />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{trip.driverName}</Text>
              <Text style={styles.driverPhone}>{trip.driverPhone}</Text>
              <Text style={styles.busPlate}>Araç Plakası: {trip.busPlate}</Text>
            </View>
          </View>
        </View>

        {/* Yolculuk Saatleri */}
        <View style={styles.timesContainer}>
          <Text style={styles.sectionTitle}>Yolculuk Saatleri</Text>
          <View style={styles.timeRow}>
            <View style={styles.timeItem}>
              <Iconify icon="mdi:arrow-up-circle" size={wScale(20)} color={Colors.primary.main} />
              <Text style={styles.timeLabel}>Alış</Text>
              <Text style={styles.timeValue}>{trip.pickupTime}</Text>
            </View>
            <View style={styles.timeItem}>
              <Iconify icon="mdi:arrow-down-circle" size={wScale(20)} color={Colors.secondary.main} />
              <Text style={styles.timeLabel}>Bırakış</Text>
              <Text style={styles.timeValue}>{trip.dropoffTime}</Text>
            </View>
          </View>
        </View>

        {/* Rota */}
        <View style={styles.routeContainer}>
          <Text style={styles.sectionTitle}>Rota Detayları</Text>
          {trip.route.map((stop, index) => (
            <View key={index} style={styles.routeItem}>
              <View style={styles.routeTimeline}>
                <View
                  style={[
                    styles.routeDot,
                    { backgroundColor: stop.status === "completed" ? Colors.status.success : Colors.neutral.grey3 },
                  ]}
                />
                {index < trip.route.length - 1 && <View style={styles.routeLine} />}
              </View>
              <View style={styles.routeContent}>
                <Text style={styles.routeTime}>{stop.time}</Text>
                <Text style={styles.routeLocation}>{stop.location}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Notlar */}
        {trip.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.sectionTitle}>Notlar</Text>
            <Text style={styles.notesText}>{trip.notes}</Text>
          </View>
        )}

        {/* Sorun Bildir */}
        <TouchableOpacity style={styles.reportButton} onPress={() => console.log("Sorun Bildir")}>
          <Iconify icon="mdi:alert-circle" size={wScale(20)} color={Colors.status.error} />
          <Text style={styles.reportButtonText}>Bu Yolculukla İlgili Sorun Bildir</Text>
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hScale(20),
  },
  dateText: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.large),
    color: Colors.neutral.grey5,
  },
  statusContainer: {
    paddingHorizontal: wScale(12),
    paddingVertical: hScale(4),
    borderRadius: wScale(12),
  },
  statusText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.white,
  },
  driverContainer: {
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(12),
    padding: wScale(16),
    marginBottom: hScale(16),
  },
  driverHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hScale(12),
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
  },
  driverContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverPhoto: {
    width: wScale(60),
    height: wScale(60),
    borderRadius: wScale(30),
    marginRight: wScale(16),
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
    marginBottom: hScale(4),
  },
  driverPhone: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginBottom: hScale(4),
  },
  busPlate: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary.main,
    borderRadius: wScale(16),
    paddingHorizontal: wScale(12),
    paddingVertical: hScale(6),
  },
  callButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.white,
    marginLeft: wScale(4),
  },
  timesContainer: {
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(12),
    padding: wScale(16),
    marginBottom: hScale(16),
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: hScale(8),
  },
  timeItem: {
    alignItems: "center",
  },
  timeLabel: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginTop: hScale(4),
    marginBottom: hScale(2),
  },
  timeValue: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
  },
  routeContainer: {
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(12),
    padding: wScale(16),
    marginBottom: hScale(16),
  },
  routeItem: {
    flexDirection: "row",
    marginTop: hScale(12),
  },
  routeTimeline: {
    width: wScale(24),
    alignItems: "center",
  },
  routeDot: {
    width: wScale(12),
    height: wScale(12),
    borderRadius: wScale(6),
  },
  routeLine: {
    width: wScale(2),
    height: hScale(30),
    backgroundColor: Colors.neutral.grey3,
    marginTop: hScale(4),
  },
  routeContent: {
    flex: 1,
    marginLeft: wScale(8),
  },
  routeTime: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
  },
  routeLocation: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginTop: hScale(2),
  },
  notesContainer: {
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(12),
    padding: wScale(16),
    marginBottom: hScale(16),
  },
  notesText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
    marginTop: hScale(8),
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hScale(12),
    marginBottom: hScale(30),
  },
  reportButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.regular),
    color: Colors.status.error,
    marginLeft: wScale(8),
  },
})

export default TripDetailScreen

