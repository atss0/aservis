import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from "react-native"
import { Iconify } from "react-native-iconify"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Colors from "../styles/Colors"
import { FontFamily, FontSizes } from "../styles/Fonts"
import { wScale, hScale } from "../styles/Scaler"

interface HeaderProps {
  title: string
  leftIcon?: string
  rightIcon?: string
  onLeftPress?: () => void
  onRightPress?: () => void
  showBackButton?: boolean
  onBackPress?: () => void
  backgroundColor?: string
  titleColor?: string
  iconColor?: string
}

const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  showBackButton = false,
  onBackPress,
  backgroundColor = Colors.neutral.white,
  titleColor = Colors.neutral.grey5,
  iconColor = Colors.neutral.grey5,
}) => {
  const insets = useSafeAreaInsets()

  return (
    <>
      <StatusBar
        barStyle={backgroundColor === Colors.neutral.white ? "dark-content" : "light-content"}
        backgroundColor={backgroundColor}
        translucent={Platform.OS === "android"}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor,
            paddingTop: Platform.OS === "android" ? insets.top + hScale(10) : hScale(10),
            paddingBottom: hScale(10),
          },
        ]}
      >
        <View style={styles.leftContainer}>
          {showBackButton ? (
            <TouchableOpacity onPress={onBackPress} style={styles.iconButton} activeOpacity={0.7}>
              <Iconify icon="mdi:arrow-left" size={wScale(24)} color={iconColor} />
            </TouchableOpacity>
          ) : leftIcon ? (
            <TouchableOpacity
              onPress={onLeftPress}
              style={styles.iconButton}
              activeOpacity={0.7}
              disabled={!onLeftPress}
            >
              <Iconify icon={leftIcon} size={wScale(24)} color={iconColor} />
            </TouchableOpacity>
          ) : (
            <View style={styles.emptyContainer} />
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={styles.rightContainer}>
          {rightIcon ? (
            <TouchableOpacity
              onPress={onRightPress}
              style={styles.iconButton}
              activeOpacity={0.7}
              disabled={!onRightPress}
            >
              <Iconify icon={rightIcon} size={wScale(24)} color={iconColor} />
            </TouchableOpacity>
          ) : (
            <View style={styles.emptyContainer} />
          )}
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wScale(16),
    width: "100%",
  },
  leftContainer: {
    width: wScale(40),
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  rightContainer: {
    width: wScale(40),
    alignItems: "flex-end",
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: wScale(FontSizes.large),
  },
  iconButton: {
    padding: wScale(4),
  },
  emptyContainer: {
    width: wScale(32),
    height: wScale(32),
  },
})

export default Header

