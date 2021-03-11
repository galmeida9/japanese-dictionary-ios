import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PracticeLevel from '../screens/PracticeLevel';
import PracticeScreen from '../screens/PracticeScreen';

const Stack = createStackNavigator();

export default function Practice(props) {
    return (
        <Stack.Navigator initialRouteName="PracticeLevel">
            <Stack.Screen name="PracticeLevel" component={PracticeLevel} options={{headerShown: false}} />
            <Stack.Screen name="PracticeScreen" component={PracticeScreen} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}

