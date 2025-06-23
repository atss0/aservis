import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { Iconify } from "react-native-iconify"
import Colors from "../styles/Colors"
import { FontFamily, FontSizes } from "../styles/Fonts"
import { wScale, hScale } from "../styles/Scaler"

interface Student {
  id: number
  name: string
  pickup_lat: string
  pickup_lng: string
  dropoff_lat: string
  dropoff_lng: string
  grade: string
  school: string
  pickup_time: string
  dropoff_time: string
  parent: {
    id: number
    name: string
    phone: string
  }
}

type RideStatus = "waiting" | "picked_up" | "dropped_off"

interface StudentCardProps {
  student: Student
  rideActive: boolean
  status?: RideStatus
  onPickup?: (id: number) => void
  onDropoff?: (id: number) => void
  onCallParent: (phone: string) => void
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  rideActive,
  status,
  onPickup,
  onDropoff,
  onCallParent }) => {
  /* ---- buton & renk seçimleri ---- */
  let actionLabel = "", actionIcon = "mdi:account-check", actionColor = Colors.status.warning
  let actionCb: (() => void) | undefined

  const currentStatus = status ?? "waiting"

  if (rideActive && currentStatus === "waiting") {
    actionLabel = "Bindi"
    actionIcon = "mdi:account-check"
    actionColor = Colors.status.warning
    actionCb = () => onPickup?.(student.id)
  } else if (rideActive && currentStatus === "picked_up") {
    actionLabel = "İndi"
    actionIcon = "mdi:school"
    actionColor = Colors.status.success
    actionCb = () => onDropoff?.(student.id)
  }

  const badge = {
    waiting: { txt: "Bekliyor", bg: Colors.status.warning },
    picked_up: { txt: "Bindi", bg: Colors.status.info },
    dropped_off: { txt: "İndi", bg: Colors.status.success },
  }[currentStatus]

  return (
    <View style={styles.container}>
      <View style={styles.studentInfo}>
        <Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" }} style={styles.studentPhoto} />

        <View style={styles.studentDetails}>
          <View style={styles.studentHeader}>
            <Text style={styles.studentName}>{student.name}</Text>
          </View>

          <Text style={styles.studentGrade}>{student.school}</Text>
          <Text style={styles.studentGrade}>{student.grade}</Text>
        </View>
      </View>

      {/* Sağ taraf: ara + (varsa) pickup/dropoff */}
      <View style={styles.actions}>
        {/* Ride aktifken: sadece Bindi / İndi */}
        {rideActive && actionCb && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: actionColor }]}
            onPress={actionCb}
          >
            <Iconify icon={actionIcon} size={wScale(16)} color={Colors.neutral.white} />
            <Text style={styles.actionButtonText}>{actionLabel}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.callButton}
          onPress={() => onCallParent(student.parent.phone)}
        >
          <Iconify icon="mdi:phone" size={wScale(16)} color={Colors.primary.main} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral.white,
    borderRadius: wScale(12),
    padding: wScale(12),
    marginBottom: hScale(12),
    borderWidth: 1,
    borderColor: Colors.neutral.grey2,
    flexDirection: "row",
    alignItems: "center",
  },
  studentInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  studentPhoto: {
    width: wScale(50),
    height: wScale(50),
    borderRadius: wScale(25),
    marginRight: wScale(12),
  },
  studentDetails: {
    flex: 1,
  },
  studentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hScale(4),
  },
  studentName: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wScale(6),
    paddingVertical: hScale(2),
    borderRadius: wScale(10),
    marginLeft: wScale(8),
  },
  statusText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.tiny),
    color: Colors.neutral.white,
    marginLeft: wScale(4),
  },
  studentGrade: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginBottom: hScale(2),
  },
  studentAddress: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
    marginBottom: hScale(2),
  },
  pickupTime: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.small),
    color: Colors.primary.main,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: wScale(8),
  },
  callButton: {
    width: wScale(36),
    height: wScale(36),
    borderRadius: wScale(18),
    backgroundColor: Colors.primary.background,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wScale(12),
    paddingVertical: hScale(6),
    borderRadius: wScale(16),
  },
  actionButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.tiny),
    color: Colors.neutral.white,
    marginLeft: wScale(4),
  },
})

export default StudentCard
