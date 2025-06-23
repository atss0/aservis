import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Iconify } from "react-native-iconify"
import Colors from "../styles/Colors"
import { FontFamily, FontSizes } from "../styles/Fonts"
import { wScale, hScale } from "../styles/Scaler"

type Status = "Yolda" | "Yaklaşıyor" | "Geldi"
type Flag = { picked: boolean; dropped: boolean }
type Flags = Record<number, Flag>        // key = childId

interface BusStatusCardProps {
  status: Status
  flags: Flags                // ← YENİ
  getName: (id: number) => string  // ← YENİ (çocuğun adını almak için)
  onPress: () => void
}

/* Yardımcı: rozet metni + rengi */
const flagMeta = (f: Flag) => {
  if (f.dropped) return { txt: "İndi", bg: Colors.status.success }
  if (f.picked) return { txt: "Bindi", bg: Colors.status.info }
  /* else */                return { txt: "Bekliyor", bg: Colors.status.warning }
}

const BusStatusCard: React.FC<BusStatusCardProps> = ({ status, flags, getName, onPress }) => {
  // Duruma göre renk ve ikon belirle
  const color = {
    Yolda: Colors.status.info,
    Yaklaşıyor: Colors.status.warning,
    Geldi: Colors.status.success,
  }[status]

  const icon = {
    Yolda: "mdi:bus",
    Yaklaşıyor: "mdi:bus-alert",
    Geldi: "mdi:bus-stop",
  }[status]

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Iconify icon={icon} size={wScale(24)} color={Colors.neutral.white} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.statusText}>{status}</Text>

        {Object.entries(flags).map(([cid, f]) => {
          const meta = flagMeta(f)
          return (
            <View key={cid} style={styles.flagRow}>
              <Text style={styles.flagName}>{getName(+cid)}</Text>
              <View style={[styles.flagBadge, { backgroundColor: meta.bg }]}>
                <Text style={styles.flagTxt}>{meta.txt}</Text>
              </View>
            </View>
          )
        })}
      </View>
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
  flagRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: hScale(2) },
  flagName: { fontFamily: FontFamily.regular, fontSize: wScale(FontSizes.small), color: Colors.neutral.grey5 },
  flagBadge: { borderRadius: wScale(8), paddingHorizontal: wScale(8), paddingVertical: hScale(2) },
  flagTxt: { fontFamily: FontFamily.medium, fontSize: wScale(FontSizes.tiny), color: Colors.neutral.white },
})

export default BusStatusCard

