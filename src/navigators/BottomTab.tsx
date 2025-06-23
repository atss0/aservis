import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import CustomTabBar from "../components/CustomTabBar"

// Import screens (placeholders for now)
import HomeScreen from "../screens/main/HomeScreen"
import HistoryStack from "./HistoryStack"
import NotificationsStack from "./NotificationsStack"
import PaymentsStack from "./PaymentsStack"
import ProfileStack from "./ProfileStack"

const Tab = createBottomTabNavigator()

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HistoryStack" component={HistoryStack} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} />
    </Tab.Navigator>
  )
}

export default MainTabNavigator

