import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import ProfileScreen from '../screens/main/ProfileScreen';
import SettingsScreen from '../screens/main/SettingsScreen';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }} initialRouteName='Profile'>
            <Stack.Screen name='Profile' component={ProfileScreen} />
            <Stack.Screen name='Settings' component={SettingsScreen} />
        </Stack.Navigator>
    );
};

export default ProfileStack;