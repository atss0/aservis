import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import NotificationsScreen from '../screens/main/NotificationsScreen';
import NotificationDetailScreen from '../screens/main/NotificationDetailScreen';

const Stack = createNativeStackNavigator();

const NotificationsStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }} initialRouteName='Notification'>
            <Stack.Screen name='Notification' component={NotificationsScreen} />
            <Stack.Screen name='NotificationDetail' component={NotificationDetailScreen} />
        </Stack.Navigator>
    );
};

export default NotificationsStack;