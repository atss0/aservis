import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Iconify } from "react-native-iconify"
import Colors from "../styles/Colors"
import { FontFamily, FontSizes } from "../styles/Fonts"
import { wScale, hScale } from "../styles/Scaler"

export type PaymentStatus = "paid" | "pending" | "overdue" | "upcoming"

interface PaymentCardProps {
  id: string
  month: string
  amount: string
  dueDate: string
  status: PaymentStatus
  paymentDate?: string
  onPress: () => void
}

const PaymentCard: React.FC<PaymentCardProps> = ({ id, month, amount, dueDate, status, paymentDate, onPress }) => {
  // Ödeme durumuna göre ikon ve renk belirle
  const getStatusIcon = () => {
    switch (status) {
      case "paid":
        return "mdi:check-circle"
      case "pending":
        return "mdi:clock-outline"
      case "overdue":
        return "mdi:alert-circle"
      case "upcoming":
        return "mdi:calendar-clock"
      default:
        return "mdi:cash"
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "paid":
        return Colors.status.success
      case "pending":
        return Colors.status.warning
      case "overdue":
        return Colors.status.error
      case "upcoming":
        return Colors.status.info
      default:
        return Colors.primary.main
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "paid":
        return "Ödendi"
      case "pending":
        return "Beklemede"
      case "overdue":
        return "Gecikmiş"
      case "upcoming":
        return "Yaklaşan"
      default:
        return ""
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: getStatusColor() }]}>
        <Iconify icon={getStatusIcon()} size={wScale(24)} color={Colors.neutral.white} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.monthText}>{month}</Text>
          <Text style={styles.amountText}>{amount} ₺</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.dateContainer}>
            <Iconify icon="mdi:calendar" size={wScale(14)} color={Colors.neutral.grey4} />
            <Text style={styles.dateText}>Son Ödeme: {dueDate}</Text>
          </View>

          {paymentDate && (
            <View style={styles.dateContainer}>
              <Iconify icon="mdi:calendar-check" size={wScale(14)} color={Colors.neutral.grey4} />
              <Text style={styles.dateText}>Ödeme Tarihi: {paymentDate}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
        <Iconify icon="mdi:chevron-right" size={wScale(20)} color={Colors.neutral.grey4} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.neutral.white,
    borderRadius: wScale(12),
    padding: wScale(12),
    marginBottom: hScale(12),
    borderWidth: 1,
    borderColor: Colors.neutral.grey2,
    height: hScale(100),
    alignItems: "center",
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
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hScale(8),
  },
  monthText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
  },
  amountText: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
  },
  detailsContainer: {
    gap: hScale(4),
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginLeft: wScale(4),
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wScale(8),
  },
  statusBadge: {
    paddingHorizontal: wScale(8),
    paddingVertical: hScale(4),
    borderRadius: wScale(12),
    marginBottom: hScale(4),
  },
  statusText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.tiny),
    color: Colors.neutral.white,
  },
})

export default PaymentCard

