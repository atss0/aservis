import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Iconify } from "react-native-iconify"
import Colors from "../styles/Colors"
import { FontFamily, FontSizes } from "../styles/Fonts"
import { wScale, hScale } from "../styles/Scaler"

export type RouteStatus = "not_started" | "active" | "completed"

interface DriverRouteCardProps {
  status: RouteStatus,
  students: any[],
  currentTime: Date,
  onStartRoute: () => void
  onCompleteRoute: () => void
}

const DriverRouteCard: React.FC<DriverRouteCardProps> = ({
  status,
  students,
  currentTime,
  onStartRoute,
  onCompleteRoute,
}) => {
  /* Buton metni + rengi duruma bağlı */
  let btnLabel = "Rotayı Başlat"
  let btnColor = Colors.primary.main
  let btnAction: (() => void) | undefined = onStartRoute

  if (status === "active") {
    btnLabel = "Rotayı Bitir"
    btnColor = Colors.status.success
    btnAction = onCompleteRoute
  } else if (status === "completed") {
    btnAction = undefined   // buton gösterme veya 'Yeniden Başlat'
  }

  return (
    <View style={styles.container}>
      {/* Üst kısım */}
      <View style={styles.header}>
        <View style={styles.routeInfo}>
          <Text style={styles.currentTime}>
            {currentTime.toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </Text>
        </View>
        <View style={styles.routeIcon}>
          <Iconify icon="mdi:bus" size={wScale(24)} color={Colors.primary.main} />
        </View>
      </View>

      {/* İstatistikler */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Iconify icon="mdi:account-group" size={wScale(16)} color={Colors.neutral.grey4} />
          <Text style={styles.statText}>Toplam: {students.length}</Text>
        </View>
      </View>

      {/* Aksiyon butonu (opsiyonel) */}
      {btnAction && (
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: btnColor }]} onPress={btnAction}>
          <Iconify icon="mdi:play" size={wScale(18)} color={Colors.neutral.white} />
          <Text style={styles.actionButtonText}>{btnLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

/* -------------------------------------------------------------------- */
/* Styles                                                               */
/* -------------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral.white,
    borderRadius: wScale(16),
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: hScale(16),
  },
  routeInfo: { flex: 1 },
  routeName: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
    marginBottom: hScale(4),
  },
  routeTime: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
  },
  routeIcon: {
    width: wScale(40),
    height: wScale(40),
    borderRadius: wScale(20),
    backgroundColor: Colors.primary.background,
    justifyContent: "center",
    alignItems: "center",
  },
  progressSection: { marginBottom: hScale(16) },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hScale(8),
  },
  progressText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey5,
  },
  progressPercentage: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.small),
    color: Colors.primary.main,
  },
  progressBarContainer: {
    height: hScale(6),
    backgroundColor: Colors.neutral.grey2,
    borderRadius: wScale(3),
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.primary.main,
    borderRadius: wScale(3),
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hScale(16),
  },
  statItem: { flexDirection: "row", alignItems: "center" },
  statText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.tiny),
    color: Colors.neutral.grey4,
    marginLeft: wScale(4),
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hScale(12),
    borderRadius: wScale(12),
  },
  actionButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.white,
    marginLeft: wScale(8),
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.neutral.grey1,
    borderRadius: wScale(12),
    padding: wScale(16),
    marginBottom: hScale(16),
  },
  currentTime: {
    fontFamily: FontFamily.bold,
    fontSize: wScale(FontSizes.xlarge),
    color: Colors.neutral.grey5,
  },
})

export default DriverRouteCard