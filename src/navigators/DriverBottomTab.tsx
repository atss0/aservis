import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import CustomDriverTabBar from "../components/CustomDriverTabBar"

// Import screens
import DriverHomeScreen from "../screens/driver/DriverHomeScreen"
import DriverHistoryScreen from "../screens/driver/DriverHistoryScreen"
import DriverMapScreen from "../screens/driver/DriverMapScreen"
import DriverReportsScreen from "../screens/driver/DriverReportsScreen"
import DriverProfileScreen from "../screens/driver/DriverProfileScreen"

const Tab = createBottomTabNavigator()

const DriverTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomDriverTabBar {...props} />}
      initialRouteName="DriverHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="DriverHistory" component={DriverHistoryScreen} />
      <Tab.Screen name="DriverHome" component={DriverHomeScreen} />
      <Tab.Screen name="DriverProfile" component={DriverProfileScreen} />
    </Tab.Navigator>
  )
}

export default DriverTabNavigator
