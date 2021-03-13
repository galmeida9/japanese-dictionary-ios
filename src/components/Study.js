import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StudyMaterial from '../screens/StudyMaterial';
import Charts from '../screens/Charts';

const Stack = createStackNavigator();

export default function Study(props) {
    return (
        <Stack.Navigator initialRouteName="StudyMaterial">
            <Stack.Screen name="StudyMaterial" component={StudyMaterial} options={{headerShown: false}} />
            <Stack.Screen name="Charts" component={Charts} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}

