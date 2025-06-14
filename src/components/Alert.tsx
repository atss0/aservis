import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Iconify } from "react-native-iconify"
import Colors from "../styles/Colors"
import { FontFamily, FontSizes } from "../styles/Fonts"
import { wScale, hScale } from "../styles/Scaler"

export type AlertType = "info" | "warning" | "success" | "error"

interface AlertProps {
  type?: AlertType
  title?: string
  message: string
  onClose?: () => void
  action?: {
    label: string
    onPress: () => void
  }
}

const Alert: React.FC<AlertProps> = ({ type = "info", title, message, onClose, action }) => {
  // Alert tipine göre ikon ve renk belirle
  const getAlertIcon = () => {
    switch (type) {
      case "info":
        return "mdi:information"
      case "warning":
        return "mdi:alert"
      case "success":
        return "mdi:check-circle"
      case "error":
        return "mdi:close-circle"
      default:
        return "mdi:information"
    }
  }

  const getAlertColor = () => {
    switch (type) {
      case "info":
        return Colors.status.info
      case "warning":
        return Colors.status.warning
      case "success":
        return Colors.status.success
      case "error":
        return Colors.status.error
      default:
        return Colors.status.info
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "info":
        return `${Colors.status.info}15` // %15 opaklık
      case "warning":
        return `${Colors.status.warning}15`
      case "success":
        return `${Colors.status.success}15`
      case "error":
        return `${Colors.status.error}15`
      default:
        return `${Colors.status.info}15`
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case "info":
        return `${Colors.status.info}30` // %30 opaklık
      case "warning":
        return `${Colors.status.warning}30`
      case "success":
        return `${Colors.status.success}30`
      case "error":
        return `${Colors.status.error}30`
      default:
        return `${Colors.status.info}30`
    }
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
      ]}
    >
      <View style={styles.contentContainer}>
        <View style={[styles.iconContainer, { backgroundColor: getAlertColor() }]}>
          <Iconify icon={getAlertIcon()} size={wScale(20)} color={Colors.neutral.white} />
        </View>

        <View style={styles.textContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.message}>{message}</Text>

          {action && (
            <TouchableOpacity style={[styles.actionButton, { borderColor: getAlertColor() }]} onPress={action.onPress}>
              <Text style={[styles.actionText, { color: getAlertColor() }]}>{action.label}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Iconify icon="mdi:close" size={wScale(18)} color={Colors.neutral.grey4} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: wScale(12),
    borderWidth: 1,
    padding: wScale(12),
    marginBottom: hScale(16),
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: wScale(36),
    height: wScale(36),
    borderRadius: wScale(18),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wScale(12),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.medium),
    color: Colors.neutral.grey5,
    marginBottom: hScale(4),
  },
  message: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
    lineHeight: wScale(20),
  },
  actionButton: {
    alignSelf: "flex-start",
    marginTop: hScale(8),
    paddingHorizontal: wScale(12),
    paddingVertical: hScale(6),
    borderRadius: wScale(8),
    borderWidth: 1,
  },
  actionText: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.small),
  },
  closeButton: {
    padding: wScale(4),
    marginLeft: wScale(8),
  },
})

export default Alert

