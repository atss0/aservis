"use client"

import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import { Iconify } from "react-native-iconify"
import Header from "../../components/Header"
import Colors from "../../styles/Colors"
import { FontFamily, FontSizes } from "../../styles/Fonts"
import { wScale, hScale } from "../../styles/Scaler"

interface DailyReport {
  date: string
  totalRoutes: number
  completedRoutes: number
  totalStudents: number
  pickedUpStudents: number
  onTimePercentage: number
  averageDelay: string
}

interface WeeklyReport {
  week: string
  totalRoutes: number
  completedRoutes: number
  totalStudents: number
  pickedUpStudents: number
  onTimePercentage: number
  averageDelay: string
}

interface MonthlyReport {
  month: string
  totalRoutes: number
  completedRoutes: number
  totalStudents: number
  pickedUpStudents: number
  onTimePercentage: number
  averageDelay: string
}

// Örnek rapor verileri
const MOCK_REPORTS: {
  daily: DailyReport
  weekly: WeeklyReport
  monthly: MonthlyReport
} = {
  daily: {
    date: "12 Mayıs 2023",
    totalRoutes: 2,
    completedRoutes: 2,
    totalStudents: 16,
    pickedUpStudents: 16,
    onTimePercentage: 95,
    averageDelay: "2 dk",
  },
  weekly: {
    week: "8-14 Mayıs 2023",
    totalRoutes: 10,
    completedRoutes: 9,
    totalStudents: 80,
    pickedUpStudents: 78,
    onTimePercentage: 87,
    averageDelay: "5 dk",
  },
  monthly: {
    month: "Mayıs 2023",
    totalRoutes: 44,
    completedRoutes: 42,
    totalStudents: 352,
    pickedUpStudents: 348,
    onTimePercentage: 89,
    averageDelay: "4 dk",
  },
}

const DriverReportsScreen = ({ navigation }: any) => {
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "monthly">("daily")

  const getCurrentReport = () => {
    return MOCK_REPORTS[selectedPeriod]
  }

  const getReportDateText = () => {
    const report = getCurrentReport()
    if ("date" in report) {
      return report.date
    } else if ("week" in report) {
      return report.week
    } else if ("month" in report) {
      return report.month
    }
    return ""
  }

  const getPeriodTitle = () => {
    switch (selectedPeriod) {
      case "daily":
        return "Günlük Rapor"
      case "weekly":
        return "Haftalık Rapor"
      case "monthly":
        return "Aylık Rapor"
      default:
        return "Rapor"
    }
  }

  const renderStatCard = (title: string, value: string | number, icon: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Iconify icon={icon} size={wScale(20)} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  )

  const report = getCurrentReport()

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Raporlar" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Dönem Seçimi */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === "daily" && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod("daily")}
          >
            <Text style={[styles.periodText, selectedPeriod === "daily" && styles.periodTextActive]}>Günlük</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === "weekly" && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod("weekly")}
          >
            <Text style={[styles.periodText, selectedPeriod === "weekly" && styles.periodTextActive]}>Haftalık</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === "monthly" && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod("monthly")}
          >
            <Text style={[styles.periodText, selectedPeriod === "monthly" && styles.periodTextActive]}>Aylık</Text>
          </TouchableOpacity>
        </View>

        {/* Rapor Başlığı */}
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle}>{getPeriodTitle()}</Text>
          <Text style={styles.reportDate}>{getReportDateText()}</Text>
        </View>

        {/* İstatistikler */}
        <View style={styles.statsContainer}>
          {renderStatCard("Toplam Rota", report.totalRoutes, "mdi:routes", Colors.primary.main)}

          {renderStatCard("Tamamlanan Rota", report.completedRoutes, "mdi:check-circle", Colors.status.success)}

          {renderStatCard("Toplam Öğrenci", report.totalStudents, "mdi:account-group", Colors.secondary.main)}

          {renderStatCard("Alınan Öğrenci", report.pickedUpStudents, "mdi:account-check", Colors.status.info)}
        </View>

        {/* Performans Metrikleri */}
        <View style={styles.performanceSection}>
          <Text style={styles.sectionTitle}>Performans Metrikleri</Text>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Iconify icon="mdi:clock-check" size={wScale(24)} color={Colors.status.success} />
              <Text style={styles.metricTitle}>Zamanında Varış Oranı</Text>
            </View>
            <Text style={styles.metricValue}>%{report.onTimePercentage}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${report.onTimePercentage}%` }]} />
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Iconify icon="mdi:timer" size={wScale(24)} color={Colors.status.warning} />
              <Text style={styles.metricTitle}>Ortalama Gecikme</Text>
            </View>
            <Text style={styles.metricValue}>{report.averageDelay}</Text>
          </View>
        </View>

        {/* Hızlı Aksiyonlar */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Rapor İşlemleri</Text>

          <TouchableOpacity style={styles.actionButton}>
            <Iconify icon="mdi:download" size={wScale(20)} color={Colors.primary.main} />
            <Text style={styles.actionButtonText}>Raporu İndir</Text>
            <Iconify icon="mdi:chevron-right" size={wScale(16)} color={Colors.neutral.grey4} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Iconify icon="mdi:share" size={wScale(20)} color={Colors.primary.main} />
            <Text style={styles.actionButtonText}>Raporu Paylaş</Text>
            <Iconify icon="mdi:chevron-right" size={wScale(16)} color={Colors.neutral.grey4} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Iconify icon="mdi:email" size={wScale(20)} color={Colors.primary.main} />
            <Text style={styles.actionButtonText}>E-posta Gönder</Text>
            <Iconify icon="mdi:chevron-right" size={wScale(16)} color={Colors.neutral.grey4} />
          </TouchableOpacity>
        </View>
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
  periodSelector: {
    flexDirection: "row",
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(12),
    padding: wScale(4),
    marginBottom: hScale(20),
  },
  periodButton: {
    flex: 1,
    paddingVertical: hScale(8),
    alignItems: "center",
    borderRadius: wScale(8),
  },
  periodButtonActive: {
    backgroundColor: Colors.primary.main,
  },
  periodText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
  },
  periodTextActive: {
    color: Colors.neutral.white,
  },
  reportHeader: {
    alignItems: "center",
    marginBottom: hScale(24),
  },
  reportTitle: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.large),
    color: Colors.neutral.grey5,
    marginBottom: hScale(4),
  },
  reportDate: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey4,
  },
  statsContainer: {
    marginBottom: hScale(24),
  },
  statCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: wScale(12),
    padding: wScale(16),
    marginBottom: hScale(12),
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: Colors.neutral.grey2,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hScale(8),
  },
  statTitle: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
    marginLeft: wScale(8),
  },
  statValue: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.xlarge),
  },
  performanceSection: {
    marginBottom: hScale(24),
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
    marginBottom: hScale(16),
  },
  metricCard: {
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(12),
    padding: wScale(16),
    marginBottom: hScale(12),
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hScale(8),
  },
  metricTitle: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
    marginLeft: wScale(8),
  },
  metricValue: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.xxlarge),
    color: Colors.neutral.grey5,
    marginBottom: hScale(8),
  },
  progressBar: {
    height: hScale(6),
    backgroundColor: Colors.neutral.grey3,
    borderRadius: wScale(3),
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.status.success,
    borderRadius: wScale(3),
  },
  actionsSection: {
    marginBottom: hScale(30),
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.white,
    borderRadius: wScale(12),
    padding: wScale(16),
    marginBottom: hScale(12),
    borderWidth: 1,
    borderColor: Colors.neutral.grey2,
  },
  actionButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
    flex: 1,
    marginLeft: wScale(12),
  },
})

export default DriverReportsScreen
