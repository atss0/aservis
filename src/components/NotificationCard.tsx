import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Iconify } from "react-native-iconify"
import Colors from "../styles/Colors"
import { FontFamily, FontSizes } from "../styles/Fonts"
import { wScale, hScale } from "../styles/Scaler"

export type NotificationType = "info" | "warning" | "success" | "error" | "payment"

interface NotificationCardProps {
  id: string
  title: string
  message: string
  time: string
  date: string
  type: NotificationType
  isRead: boolean
  onPress: () => void
  onMarkAsRead?: () => void
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  id,
  title,
  message,
  time,
  date,
  type,
  isRead,
  onPress,
  onMarkAsRead,
}) => {
  // Bildirim tipine göre ikon ve renk belirle
  const getNotificationIcon = () => {
    switch (type) {
      case "info":
        return "mdi:information"
      case "warning":
        return "mdi:alert"
      case "success":
        return "mdi:check-circle"
      case "error":
        return "mdi:close-circle"
      case "payment":
        return "mdi:cash"
      default:
        return "mdi:bell"
    }
  }

  const getNotificationColor = () => {
    switch (type) {
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
    <TouchableOpacity style={[styles.container, isRead && styles.readContainer]} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: getNotificationColor() }]}>
        <Iconify icon={getNotificationIcon()} size={wScale(20)} color={Colors.neutral.white} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {!isRead && <View style={styles.unreadDot} />}
        </View>

        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>

        <View style={styles.footerContainer}>
          <Text style={styles.timeText}>
            {time} - {date}
          </Text>

          {!isRead && onMarkAsRead && (
            <TouchableOpacity
              style={styles.readButton}
              onPress={(e) => {
                e.stopPropagation()
                onMarkAsRead()
              }}
            >
              <Text style={styles.readButtonText}>Okundu İşaretle</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.neutral.white,
    borderRadius: wScale(12),
    padding: wScale(12),
    marginBottom: hScale(12),
    borderWidth: 1,
    borderColor: Colors.neutral.grey2,
  },
  readContainer: {
    backgroundColor: Colors.neutral.grey1,
    borderColor: Colors.neutral.grey2,
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hScale(4),
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
    flex: 1,
  },
  unreadDot: {
    width: wScale(8),
    height: wScale(8),
    borderRadius: wScale(4),
    backgroundColor: Colors.primary.main,
    marginLeft: wScale(8),
  },
  message: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
    marginBottom: hScale(8),
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
  },
  readButton: {
    paddingHorizontal: wScale(8),
    paddingVertical: hScale(4),
    borderRadius: wScale(12),
    backgroundColor: Colors.primary.background,
  },
  readButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.tiny),
    color: Colors.primary.main,
  },
})

export default NotificationCard

