import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import Colors from "../styles/Colors"
import { FontFamily, FontSizes } from "../styles/Fonts"
import { wScale, hScale } from "../styles/Scaler"

interface HistoryFilterProps {
  onFilterChange: (filter: string) => void
  activeFilter: string
}

const HistoryFilter: React.FC<HistoryFilterProps> = ({ onFilterChange, activeFilter }) => {
  const filters = [
    { id: "all", label: "Tümü" },
    { id: "onTime", label: "Zamanında" },
    { id: "delayed", label: "Gecikmeli" },
    { id: "cancelled", label: "İptal" },
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtrele:</Text>
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[styles.filterButton, activeFilter === filter.id && styles.activeFilterButton]}
            onPress={() => onFilterChange(filter.id)}
          >
            <Text style={[styles.filterText, activeFilter === filter.id && styles.activeFilterText]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: hScale(16),
  },
  title: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginBottom: hScale(8),
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterButton: {
    paddingHorizontal: wScale(12),
    paddingVertical: hScale(6),
    borderRadius: wScale(16),
    backgroundColor: Colors.neutral.grey2,
    marginRight: wScale(8),
    marginBottom: hScale(8),
  },
  activeFilterButton: {
    backgroundColor: Colors.primary.main,
  },
  filterText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey5,
  },
  activeFilterText: {
    color: Colors.neutral.white,
  },
})

export default HistoryFilter

