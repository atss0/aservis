import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Iconify } from "react-native-iconify"
import Colors from "../styles/Colors"
import { FontFamily, FontSizes } from "../styles/Fonts"
import { wScale, hScale } from "../styles/Scaler"

interface ProfileMenuItemProps {
  icon: string
  title: string
  subtitle?: string
  onPress: () => void
  color?: string
  showBadge?: boolean
  disabled?: boolean
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  color = Colors.neutral.grey5,
  showBadge = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabledContainer]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Iconify icon={icon} size={wScale(20)} color={disabled ? Colors.neutral.grey3 : color} />
      </View>

      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.title,
            { color: disabled ? Colors.neutral.grey3 : color, marginBottom: subtitle ? hScale(4) : 0 },
          ]}
        >
          {title}
        </Text>
        {subtitle && <Text style={[styles.subtitle, disabled && styles.disabledText]}>{subtitle}</Text>}
      </View>

      <View style={styles.rightContainer}>
        {showBadge && <View style={styles.badge} />}
        <Iconify
          icon="mdi:chevron-right"
          size={wScale(20)}
          color={disabled ? Colors.neutral.grey3 : Colors.neutral.grey4}
        />
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
    marginBottom: hScale(12),
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
  title: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.regular),
    marginBottom: 0,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.neutral.grey4,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    width: wScale(8),
    height: wScale(8),
    borderRadius: wScale(4),
    backgroundColor: Colors.status.error,
    marginRight: wScale(8),
  },
  disabledContainer: {
    opacity: 0.6,
  },
  disabledText: {
    color: Colors.neutral.grey3,
  },
})

export default ProfileMenuItem
