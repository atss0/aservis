import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HistoryScreen from '../screens/main/HistoryScreen';
import TripDetailScreen from '../screens/main/TripDetailScreen';

const Stack = createNativeStackNavigator();

const HistoryStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }} initialRouteName='History'>
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="TripDetail" component={TripDetailScreen} />
        </Stack.Navigator>
    );
};

export default HistoryStack;