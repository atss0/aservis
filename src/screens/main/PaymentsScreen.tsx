"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native"
import { Iconify } from "react-native-iconify"
import Header from "../../components/Header"
import PaymentCard, { type PaymentStatus } from "../../components/PaymentCard"
import PaymentSummaryCard from "../../components/PaymentSummaryCard"
import PaymentFilter from "../../components/PaymentFilter"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"

// Örnek ödeme verileri
interface Payment {
  id: string
  month: string
  amount: string
  dueDate: string
  status: PaymentStatus
  paymentDate?: string
}

const DUMMY_PAYMENTS: Payment[] = [
  {
    id: "1",
    month: "Mayıs 2023",
    amount: "750",
    dueDate: "01.05.2023",
    status: "paid",
    paymentDate: "28.04.2023",
  },
  {
    id: "2",
    month: "Haziran 2023",
    amount: "750",
    dueDate: "01.06.2023",
    status: "pending",
  },
  {
    id: "3",
    month: "Temmuz 2023",
    amount: "750",
    dueDate: "01.07.2023",
    status: "upcoming",
  },
  {
    id: "4",
    month: "Ağustos 2023",
    amount: "750",
    dueDate: "01.08.2023",
    status: "upcoming",
  },
  {
    id: "5",
    month: "Nisan 2023",
    amount: "750",
    dueDate: "01.04.2023",
    status: "paid",
    paymentDate: "30.03.2023",
  },
  {
    id: "6",
    month: "Mart 2023",
    amount: "750",
    dueDate: "01.03.2023",
    status: "paid",
    paymentDate: "28.02.2023",
  },
  {
    id: "7",
    month: "Şubat 2023",
    amount: "750",
    dueDate: "01.02.2023",
    status: "paid",
    paymentDate: "30.01.2023",
  },
  {
    id: "8",
    month: "Ocak 2023",
    amount: "750",
    dueDate: "01.01.2023",
    status: "paid",
    paymentDate: "28.12.2022",
  },
]

const PaymentsScreen = ({ navigation }: any) => {
  const [payments, setPayments] = useState<Payment[]>(DUMMY_PAYMENTS)
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(DUMMY_PAYMENTS)
  const [activeFilter, setActiveFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Ödemeleri filtrele
  useEffect(() => {
    setLoading(true)

    // Filtreleme işlemini simüle etmek için timeout kullanıyoruz
    const timer = setTimeout(() => {
      let result = [...payments]

      // Filtre tipine göre filtrele
      if (activeFilter !== "all") {
        result = result.filter((payment) => payment.status === activeFilter)
      }

      setFilteredPayments(result)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [activeFilter, payments])

  // Yenileme işlemi
  const handleRefresh = () => {
    setRefreshing(true)
    // Gerçek uygulamada API'den yeni ödemeleri çekecek
    setTimeout(() => {
      setPayments(DUMMY_PAYMENTS)
      setRefreshing(false)
    }, 1000)
  }

  // Ödeme detayına git
  const handlePaymentPress = (paymentId: string) => {
    // Ödeme detay sayfasına git
    Alert.alert("Ödeme Detayı", `Ödeme ID: ${paymentId}`)
    navigation.navigate("PaymentDetail", { paymentId });
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

  // Ödeme kartını render et
  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <PaymentCard
      id={item.id}
      month={item.month}
      amount={item.amount}
      dueDate={item.dueDate}
      status={item.status}
      paymentDate={item.paymentDate}
      onPress={() => handlePaymentPress(item.id)}
    />
  )

  // Liste boşsa gösterilecek bileşen
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Iconify icon="mdi:cash-remove" size={wScale(64)} color={Colors.neutral.grey3} />
      <Text style={styles.emptyTitle}>Ödeme Bulunamadı</Text>
      <Text style={styles.emptyText}>
        {activeFilter === "all" ? "Henüz hiç ödeme kaydınız yok." : "Seçilen filtreye uygun ödeme bulunamadı."}
      </Text>
    </View>
  )

  // Liste yükleniyorsa gösterilecek bileşen
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary.main} />
    </View>
  )

  // Toplam borç hesapla
  const calculateTotalDue = () => {
    const pendingAndUpcoming = payments.filter(
      (payment) => payment.status === "pending" || payment.status === "upcoming" || payment.status === "overdue",
    )
    const total = pendingAndUpcoming.reduce((sum, payment) => sum + Number.parseFloat(payment.amount), 0)
    return total.toFixed(2)
  }

  // Sonraki ödeme bilgisini al
  const getNextPayment = () => {
    const pendingPayments = payments.filter((payment) => payment.status === "pending")
    if (pendingPayments.length > 0) {
      return pendingPayments[0]
    }

    const upcomingPayments = payments.filter((payment) => payment.status === "upcoming")
    if (upcomingPayments.length > 0) {
      return upcomingPayments[0]
    }

    return null
  }

  const nextPayment = getNextPayment()

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Ödemeler" rightIcon="mdi:history" onRightPress={() => console.log("Ödeme Geçmişi")} />

      <View style={styles.content}>
        {/* Ödeme Özeti */}
        <View style={styles.summaryContainer}>
          <PaymentSummaryCard
            totalDue={calculateTotalDue()}
            nextPaymentDate={nextPayment ? nextPayment.dueDate : "Bekleyen ödeme yok"}
            nextPaymentAmount={nextPayment ? nextPayment.amount : "0"}
            onMakePayment={handleMakePayment}
          />
        </View>

        {/* Ödeme Filtreleri */}
        <View style={styles.filterContainer}>
          <PaymentFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </View>

        {/* Ödeme Listesi */}
        {loading ? (
          renderLoading()
        ) : (
          <FlatList
            data={filteredPayments}
            renderItem={renderPaymentItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyList}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      </View>

      {/* Fatura Ekle Butonu */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => Alert.alert("Fatura Ekle", "Yeni bir fatura eklemek ister misiniz?")}
      >
        <Iconify icon="mdi:plus" size={wScale(24)} color={Colors.neutral.white} />
      </TouchableOpacity>
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
  },
  summaryContainer: {
    paddingHorizontal: wScale(16),
    paddingTop: hScale(16),
  },
  filterContainer: {
    backgroundColor: Colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.grey2,
    marginBottom: hScale(8),
  },
  listContent: {
    paddingHorizontal: wScale(16),
    paddingBottom: hScale(20),
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: wScale(20),
    marginTop: hScale(40),
  },
  emptyTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.large),
    color: Colors.neutral.grey5,
    marginTop: hScale(16),
    marginBottom: hScale(8),
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey4,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: hScale(20),
    right: wScale(20),
    width: wScale(56),
    height: wScale(56),
    borderRadius: wScale(28),
    backgroundColor: Colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default PaymentsScreen

