import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Iconify } from "react-native-iconify"
import Colors from "../styles/Colors"
import { FontFamily, FontSizes } from "../styles/Fonts"
import { wScale, hScale } from "../styles/Scaler"

interface PaymentSummaryCardProps {
  totalDue: string
  nextPaymentDate: string
  nextPaymentAmount: string
  onMakePayment: () => void
}

const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({
  totalDue,
  nextPaymentDate,
  nextPaymentAmount,
  onMakePayment,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Ödeme Özeti</Text>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Toplam Borç</Text>
        <Text style={styles.totalAmount}>{totalDue} ₺</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.nextPaymentContainer}>
        <View style={styles.nextPaymentInfo}>
          <Text style={styles.nextPaymentLabel}>Sonraki Ödeme</Text>
          <Text style={styles.nextPaymentDate}>{nextPaymentDate}</Text>
        </View>
        <View style={styles.nextPaymentAmountContainer}>
          <Text style={styles.nextPaymentAmount}>{nextPaymentAmount} ₺</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.paymentButton} onPress={onMakePayment} activeOpacity={0.8}>
        <Iconify icon="mdi:cash" size={wScale(20)} color={Colors.neutral.white} />
        <Text style={styles.paymentButtonText}>Ödeme Yap</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral.white,
    borderRadius: wScale(12),
    padding: wScale(16),
    marginBottom: hScale(16),
    borderWidth: 1,
    borderColor: Colors.neutral.grey2,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    marginBottom: hScale(12),
  },
  headerText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
  },
  totalContainer: {
    alignItems: "center",
    marginBottom: hScale(16),
  },
  totalLabel: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginBottom: hScale(4),
  },
  totalAmount: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.xxlarge),
    color: Colors.neutral.grey5,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral.grey2,
    marginBottom: hScale(16),
  },
  nextPaymentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hScale(16),
  },
  nextPaymentInfo: {
    flex: 1,
  },
  nextPaymentLabel: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginBottom: hScale(4),
  },
  nextPaymentDate: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
  },
  nextPaymentAmountContainer: {
    backgroundColor: Colors.primary.background,
    paddingHorizontal: wScale(12),
    paddingVertical: hScale(6),
    borderRadius: wScale(8),
  },
  nextPaymentAmount: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.primary.main,
  },
  paymentButton: {
    flexDirection: "row",
    backgroundColor: Colors.primary.main,
    borderRadius: wScale(12),
    paddingVertical: hScale(12),
    justifyContent: "center",
    alignItems: "center",
  },
  paymentButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.white,
    marginLeft: wScale(8),
  },
})

export default PaymentSummaryCard

