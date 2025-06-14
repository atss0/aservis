import type React from "react"
import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Iconify } from "react-native-iconify"
import Colors from "../styles/Colors"
import { FontFamily, FontSizes } from "../styles/Fonts"
import { wScale, hScale } from "../styles/Scaler"
import type { NotificationType } from "./NotificationCard"

interface FilterOption {
  id: string
  label: string
  icon: string
  type?: NotificationType
}

interface NotificationFilterProps {
  activeFilter: string
  onFilterChange: (filterId: string) => void
}

const NotificationFilter: React.FC<NotificationFilterProps> = ({ activeFilter, onFilterChange }) => {
  const filters: FilterOption[] = [
    { id: "all", label: "Tümü", icon: "mdi:bell-outline" },
    { id: "unread", label: "Okunmamış", icon: "mdi:bell-badge-outline" },
    { id: "info", label: "Bilgi", icon: "mdi:information-outline", type: "info" },
    { id: "warning", label: "Uyarı", icon: "mdi:alert-outline", type: "warning" },
    { id: "success", label: "Başarılı", icon: "mdi:check-circle-outline", type: "success" },
    { id: "error", label: "Hata", icon: "mdi:close-circle-outline", type: "error" },
    { id: "payment", label: "Ödeme", icon: "mdi:cash", type: "payment" },
  ]

  const getFilterColor = (filter: FilterOption) => {
    if (!filter.type) return Colors.primary.main

    switch (filter.type) {
      case "info":
        return Colors.status.info
      case "warning":
        return Colors.status.warning
      case "success":
        return Colors.status.success
      case "error":
        return Colors.status.error
      case "payment":
        return Colors.secondary.main
      default:
        return Colors.primary.main
    }
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollViewStyle} // Yeni stil ekleyelim
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterButton,
            activeFilter === filter.id && styles.activeFilterButton,
            activeFilter === filter.id && { borderColor: getFilterColor(filter) },
          ]}
          onPress={() => onFilterChange(filter.id)}
        >
          <Iconify
            icon={filter.icon}
            size={wScale(16)}
            color={activeFilter === filter.id ? getFilterColor(filter) : Colors.neutral.grey4}
          />
          <Text
            style={[
              styles.filterText,
              activeFilter === filter.id && styles.activeFilterText,
              activeFilter === filter.id && { color: getFilterColor(filter) },
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: hScale(12),
    paddingHorizontal: wScale(4),
    height: hScale(60), // Sabit yükseklik ekleyelim
    alignItems: "center", // İçeriği dikey olarak ortalar
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wScale(12),
    paddingVertical: hScale(6),
    borderRadius: wScale(16),
    marginRight: wScale(8),
    backgroundColor: Colors.neutral.grey1,
    borderWidth: 1,
    borderColor: Colors.neutral.grey2,
  },
  activeFilterButton: {
    backgroundColor: Colors.neutral.white,
    borderWidth: 1,
  },
  filterText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginLeft: wScale(6),
  },
  activeFilterText: {
    fontFamily: FontFamily.semiBold,
  },
  scrollViewStyle: {
    height: hScale(60), // ScrollView'a da sabit yükseklik verelim
    backgroundColor: Colors.neutral.white, // Arka plan rengini belirleyelim
  },
})

export default NotificationFilter

