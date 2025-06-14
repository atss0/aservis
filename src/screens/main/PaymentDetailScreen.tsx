"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { Iconify } from "react-native-iconify"
import Header from "../../components/Header"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"
import type { PaymentStatus } from "../../components/PaymentCard"

// Örnek ödeme detayı
interface PaymentDetail {
  id: string
  month: string
  amount: string
  dueDate: string
  status: PaymentStatus
  paymentDate?: string
  paymentMethod?: string
  transactionId?: string
  receiptUrl?: string
  description: string
  items: {
    name: string
    amount: string
  }[]
}

const DUMMY_PAYMENT_DETAILS: Record<string, PaymentDetail> = {
  "1": {
    id: "1",
    month: "Mayıs 2023",
    amount: "750",
    dueDate: "01.05.2023",
    status: "paid",
    paymentDate: "28.04.2023",
    paymentMethod: "Kredi Kartı",
    transactionId: "TRX123456789",
    receiptUrl: "https://example.com/receipt/123456789",
    description: "Mayıs 2023 servis ücreti",
    items: [
      { name: "Servis Ücreti", amount: "700" },
      { name: "Sigorta", amount: "50" },
    ],
  },
  "2": {
    id: "2",
    month: "Haziran 2023",
    amount: "750",
    dueDate: "01.06.2023",
    status: "pending",
    description: "Haziran 2023 servis ücreti",
    items: [
      { name: "Servis Ücreti", amount: "700" },
      { name: "Sigorta", amount: "50" },
    ],
  },
}

const PaymentDetailScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  const [payment, setPayment] = useState<PaymentDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const paymentId = route?.params?.paymentId || "1"

  // Ödeme detaylarını yükle
  useEffect(() => {
    // Gerçek uygulamada API'den veri çekilecek
    const loadPaymentDetail = async () => {
      setLoading(true)
      // API çağrısını simüle etmek için timeout kullanıyoruz
      setTimeout(() => {
        const paymentDetail = DUMMY_PAYMENT_DETAILS[paymentId]
        setPayment(paymentDetail)
        setLoading(false)
      }, 500)
    }

    loadPaymentDetail()
  }, [paymentId])

  // Ödeme durumuna göre renk ve metin belirle
  const getStatusColor = (status: PaymentStatus) => {
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

  const getStatusText = (status: PaymentStatus) => {
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

  // Ödeme yap
  const handleMakePayment = () => {
    Alert.alert(
      "Ödeme Yap",
      "Ödeme yapmak için bir yöntem seçin",
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Kredi Kartı",
          onPress: () => console.log("Kredi Kartı ile ödeme"),
        },
        {
          text: "Banka Havalesi",
          onPress: () => console.log("Banka Havalesi ile ödeme"),
        },
      ],
      { cancelable: true },
    )
  }

  // Makbuzu görüntüle
  const handleViewReceipt = () => {
    if (payment?.receiptUrl) {
      // Gerçek uygulamada makbuz görüntüleme sayfasına yönlendirilecek
      console.log("Makbuz görüntüleniyor:", payment.receiptUrl)
      // navigation.navigate("ReceiptViewer", { url: payment.receiptUrl });
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Ödeme Detayı" showBackButton={true} onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.main} />
        </View>
      </SafeAreaView>
    )
  }

  if (!payment) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Ödeme Detayı" showBackButton={true} onBackPress={() => navigation.goBack()} />
        <View style={styles.errorContainer}>
          <Iconify icon="mdi:alert-circle" size={wScale(64)} color={Colors.status.error} />
          <Text style={styles.errorTitle}>Ödeme Bulunamadı</Text>
          <Text style={styles.errorText}>İstediğiniz ödeme bulunamadı veya silinmiş olabilir.</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Ödeme Detayı" showBackButton={true} onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ödeme Başlığı */}
        <View style={styles.headerContainer}>
          <Text style={styles.monthText}>{payment.month}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) }]}>
            <Text style={styles.statusText}>{getStatusText(payment.status)}</Text>
          </View>
        </View>

        {/* Ödeme Tutarı */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Ödeme Tutarı</Text>
          <Text style={styles.amountValue}>{payment.amount} ₺</Text>
        </View>

        {/* Ödeme Bilgileri */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Ödeme Bilgileri</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Son Ödeme Tarihi</Text>
            <Text style={styles.infoValue}>{payment.dueDate}</Text>
          </View>

          {payment.paymentDate && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ödeme Tarihi</Text>
              <Text style={styles.infoValue}>{payment.paymentDate}</Text>
            </View>
          )}

          {payment.paymentMethod && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ödeme Yöntemi</Text>
              <Text style={styles.infoValue}>{payment.paymentMethod}</Text>
            </View>
          )}

          {payment.transactionId && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>İşlem Numarası</Text>
              <Text style={styles.infoValue}>{payment.transactionId}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Açıklama</Text>
            <Text style={styles.infoValue}>{payment.description}</Text>
          </View>
        </View>

        {/* Ödeme Detayları */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Ödeme Detayları</Text>

          {payment.items.map((item, index) => (
            <View key={index} style={styles.detailRow}>
              <Text style={styles.detailName}>{item.name}</Text>
              <Text style={styles.detailAmount}>{item.amount} ₺</Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Toplam</Text>
            <Text style={styles.totalValue}>{payment.amount} ₺</Text>
          </View>
        </View>

        {/* Ödeme Butonları */}
        {payment.status === "paid" ? (
          <TouchableOpacity style={styles.receiptButton} onPress={handleViewReceipt}>
            <Iconify icon="mdi:receipt" size={wScale(20)} color={Colors.neutral.white} />
            <Text style={styles.buttonText}>Makbuzu Görüntüle</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.paymentButton} onPress={handleMakePayment}>
            <Iconify icon="mdi:cash" size={wScale(20)} color={Colors.neutral.white} />
            <Text style={styles.buttonText}>Ödeme Yap</Text>
          </TouchableOpacity>
        )}
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
  monthText: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.large),
    color: Colors.neutral.grey5,
  },
  statusBadge: {
    paddingHorizontal: wScale(12),
    paddingVertical: hScale(4),
    borderRadius: wScale(12),
  },
  statusText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.white,
  },
  amountContainer: {
    alignItems: "center",
    marginBottom: hScale(24),
  },
  amountLabel: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginBottom: hScale(4),
  },
  amountValue: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.xxxlarge),
    color: Colors.neutral.grey5,
  },
  infoContainer: {
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(12),
    padding: wScale(16),
    marginBottom: hScale(16),
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
    marginBottom: hScale(12),
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hScale(8),
  },
  infoLabel: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
  },
  infoValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey5,
    textAlign: "right",
    flex: 1,
    marginLeft: wScale(8),
  },
  detailsContainer: {
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(12),
    padding: wScale(16),
    marginBottom: hScale(24),
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hScale(8),
  },
  detailName: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
  },
  detailAmount: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hScale(8),
    paddingTop: hScale(8),
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.grey3,
  },
  totalLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
  },
  totalValue: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
  },
  paymentButton: {
    flexDirection: "row",
    backgroundColor: Colors.primary.main,
    borderRadius: wScale(12),
    paddingVertical: hScale(12),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hScale(30),
  },
  receiptButton: {
    flexDirection: "row",
    backgroundColor: Colors.secondary.main,
    borderRadius: wScale(12),
    paddingVertical: hScale(12),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hScale(30),
  },
  buttonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.white,
    marginLeft: wScale(8),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wScale(20),
  },
  errorTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.large),
    color: Colors.neutral.grey5,
    marginTop: hScale(16),
    marginBottom: hScale(8),
  },
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey4,
    textAlign: "center",
  },
})

export default PaymentDetailScreen

