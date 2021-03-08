import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WordBank from './WordBank';

const Stack = createStackNavigator();

export default function Bank(props) {
    return (
        <Stack.Navigator initialRouteName="WordBank">
            <Stack.Screen name="WordBank" component={WordBank} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}

