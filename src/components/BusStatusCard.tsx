import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Iconify } from "react-native-iconify"
import Colors from "../styles/Colors"
import { FontFamily, FontSizes } from "../styles/Fonts"
import { wScale, hScale } from "../styles/Scaler"

interface BusStatusCardProps {
  status: "Yolda" | "Yaklaşıyor" | "Geldi"
  estimatedTime: string
  onPress: () => void
}

const BusStatusCard: React.FC<BusStatusCardProps> = ({ status, estimatedTime, onPress }) => {
  // Duruma göre renk ve ikon belirle
  const getStatusColor = () => {
    switch (status) {
      case "Yolda":
        return Colors.status.info
      case "Yaklaşıyor":
        return Colors.status.warning
      case "Geldi":
        return Colors.status.success
      default:
        return Colors.status.info
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "Yolda":
        return "mdi:bus"
      case "Yaklaşıyor":
        return "mdi:bus-alert"
      case "Geldi":
        return "mdi:bus-stop"
      default:
        return "mdi:bus"
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.iconContainer, { backgroundColor: getStatusColor() }]}>
        <Iconify icon={getStatusIcon()} size={wScale(24)} color={Colors.neutral.white} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.statusText}>{status}</Text>
        <Text style={styles.timeText}>Tahmini varış: {estimatedTime}</Text>
      </View>

      <Iconify icon="mdi:chevron-right" size={wScale(24)} color={Colors.neutral.grey4} />
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
    marginHorizontal: wScale(16),
    marginBottom: hScale(16),
    borderWidth: 1,
    borderColor: Colors.neutral.grey2,
    elevation: 3,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: wScale(40),
    height: wScale(40),
    borderRadius: wScale(20),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wScale(12),
  },
  contentContainer: {
    flex: 1,
  },
  statusText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
    marginBottom: hScale(2),
  },
  timeText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
  },
})

export default BusStatusCard

