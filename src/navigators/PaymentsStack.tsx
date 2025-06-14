import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import PaymentsScreen from '../screens/main/PaymentsScreen';
import PaymentDetailScreen from '../screens/main/PaymentDetailScreen';

const Stack = createNativeStackNavigator();

const PaymentsStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }} initialRouteName='Payments'>
            <Stack.Screen name='Payments' component={PaymentsScreen} />
            <Stack.Screen name='PaymentDetail' component={PaymentDetailScreen} />
        </Stack.Navigator>
    );
};

export default PaymentsStack;