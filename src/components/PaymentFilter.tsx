import type React from "react"
import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import Colors from "../styles/Colors"
import { FontFamily, FontSizes } from "../styles/Fonts"
import { wScale, hScale } from "../styles/Scaler"

interface PaymentFilterProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

const PaymentFilter: React.FC<PaymentFilterProps> = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: "all", label: "Tümü" },
    { id: "paid", label: "Ödendi" },
    { id: "pending", label: "Beklemede" },
    { id: "overdue", label: "Gecikmiş" },
    { id: "upcoming", label: "Yaklaşan" },
  ]

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollViewStyle}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[styles.filterButton, activeFilter === filter.id && styles.activeFilterButton]}
          onPress={() => onFilterChange(filter.id)}
        >
          <Text style={[styles.filterText, activeFilter === filter.id && styles.activeFilterText]}>{filter.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: hScale(12),
    paddingHorizontal: wScale(4),
    height: hScale(60),
    alignItems: "center",
  },
  scrollViewStyle: {
    height: hScale(60),
    backgroundColor: Colors.neutral.white,
  },
  filterButton: {
    paddingHorizontal: wScale(16),
    paddingVertical: hScale(8),
    borderRadius: wScale(16),
    marginRight: wScale(8),
    backgroundColor: Colors.neutral.grey1,
    borderWidth: 1,
    borderColor: Colors.neutral.grey2,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  filterText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
  },
  activeFilterText: {
    fontFamily: FontFamily.semiBold,
    color: Colors.neutral.white,
  },
})

export default PaymentFilter

