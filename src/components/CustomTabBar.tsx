"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native"
import { Iconify } from "react-native-iconify"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Colors from "../styles/Colors"
import { FontFamily, FontSizes } from "../styles/Fonts"
import { wScale, hScale } from "../styles/Scaler"

interface TabBarItemProps {
  label: string
  icon: string
  activeIcon: string
  onPress: () => void
  isFocused: boolean
  isHome?: boolean
}

const TabBarItem: React.FC<TabBarItemProps> = ({ label, icon, activeIcon, onPress, isFocused, isHome = false }) => {
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start()
  }, [isFocused, animatedValue])

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, isHome ? 1.1 : 1.05],
  })

  if (isHome) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.homeTabContainer}>
        <View style={styles.homeButton}>
          <Animated.View style={[{ transform: [{ scale }] }]}>
            <Iconify icon={isFocused ? activeIcon : icon} size={wScale(28)} color={Colors.neutral.white} />
          </Animated.View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.tabItemContainer}>
      <Animated.View style={[styles.tabItem, { transform: [{ scale }] }]}>
        <Iconify
          icon={isFocused ? activeIcon : icon}
          size={wScale(24)}
          color={isFocused ? Colors.primary.main : Colors.neutral.grey4}
        />
        <Text style={[styles.tabLabel, { color: isFocused ? Colors.primary.main : Colors.neutral.grey4 }]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

interface CustomTabBarProps {
  state: any
  descriptors: any
  navigation: any
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets()

  const tabIcons = {
    HistoryStack: {
      active: "mdi:history",
      inactive: "mdi:history",
    },
    NotificationsStack: {
      active: "mdi:bell",
      inactive: "mdi:bell-outline",
    },
    Home: {
      active: "mdi:home",
      inactive: "mdi:home-outline",
    },
    PaymentsStack: {
      active: "mdi:credit-card",
      inactive: "mdi:credit-card-outline",
    },
    ProfileStack: {
      active: "mdi:account",
      inactive: "mdi:account-outline",
    },
  }

  const tabLabels = {
    HistoryStack: "Geçmiş",
    NotificationsStack: "Bildirimler",
    Home: "Ana Sayfa",
    PaymentsStack: "Ödemeler",
    ProfileStack: "Profil",
  }

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key]
          const label = options.tabBarLabel || options.title || route.name

          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          const routeName = route.name as keyof typeof tabIcons
          const isHome = routeName === "Home"

          return (
            <TabBarItem
              key={route.key}
              label={tabLabels[routeName]}
              icon={tabIcons[routeName].inactive}
              activeIcon={tabIcons[routeName].active}
              onPress={onPress}
              isFocused={isFocused}
              isHome={isHome}
            />
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.grey2,
    paddingTop: hScale(10),
    paddingHorizontal: wScale(10),
  },
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  tabItemContainer: {
    flex: 1,
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hScale(5),
  },
  tabLabel: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.tiny),
    marginTop: hScale(4),
  },
  homeTabContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  homeButton: {
    width: wScale(56),
    height: wScale(56),
    borderRadius: wScale(28),
    backgroundColor: Colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
    bottom: hScale(20),
  },
})

export default CustomTabBar

