import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Iconify } from "react-native-iconify"
import Colors from "../styles/Colors"
import { FontFamily, FontSizes } from "../styles/Fonts"
import { wScale, hScale } from "../styles/Scaler"
import { addHours } from "../utils/time"

interface TripHistoryCardProps {
  date: string
  pickupTime: string
  dropoffTime: string
  driverName: string
  status: "onTime" | "delayed" | "cancelled"
  onPress: () => void
}

const TripHistoryCard: React.FC<TripHistoryCardProps> = ({
  date,
  pickupTime,
  dropoffTime,
  driverName,
  status,
  onPress,
}) => {
  // Duruma göre renk ve metin belirle
  const getStatusColor = () => {
    switch (status) {
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
    switch (status) {
      case "onTime":
        return "Zamanında"
      case "delayed":
        return "Gecikmeli"
      case "cancelled":
        return "İptal Edildi"
      default:
        return "Zamanında"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "onTime":
        return "mdi:check-circle"
      case "delayed":
        return "mdi:clock-alert"
      case "cancelled":
        return "mdi:close-circle"
      default:
        return "mdi:check-circle"
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{date}</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.timeContainer}>
          <View style={styles.timeItem}>
            <Iconify icon="mdi:arrow-up-circle" size={wScale(16)} color={Colors.primary.main} />
            <Text style={styles.timeLabel}>Alış:</Text>
            <Text style={styles.timeValue}>{addHours(pickupTime)}</Text>
          </View>

          <View style={styles.timeItem}>
            <Iconify icon="mdi:arrow-down-circle" size={wScale(16)} color={Colors.secondary.main} />
            <Text style={styles.timeLabel}>Bırakış:</Text>
            <Text style={styles.timeValue}>{addHours(dropoffTime)}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.driverContainer}>
            <Iconify icon="mdi:account" size={wScale(16)} color={Colors.neutral.grey4} />
            <Text style={styles.driverText}>{driverName}</Text>
          </View>

          <View style={[styles.statusContainer, { backgroundColor: getStatusColor() }]}>
            <Iconify icon={getStatusIcon()} size={wScale(14)} color={Colors.neutral.white} />
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>
      </View>

      <Iconify icon="mdi:chevron-right" size={wScale(20)} color={Colors.neutral.grey4} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.white,
    borderRadius: wScale(12),
    padding: wScale(12),
    marginBottom: hScale(12),
    borderWidth: 1,
    borderColor: Colors.neutral.grey2,
  },
  dateContainer: {
    width: wScale(50),
    marginRight: wScale(12),
  },
  dateText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey5,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hScale(8),
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeLabel: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginLeft: wScale(4),
    marginRight: wScale(4),
  },
  timeValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey5,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  driverContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginLeft: wScale(4),
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wScale(6),
    paddingVertical: hScale(2),
    borderRadius: wScale(10),
  },
  statusText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.tiny),
    color: Colors.neutral.white,
    marginLeft: wScale(4),
  },
})

export default TripHistoryCard

