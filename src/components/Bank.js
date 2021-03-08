import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WordBank from '../screens/WordBank';
import KanjiDefinition from '../screens/KanjiDefinition'
import Definition from '../screens/Definition'
import Examples from '../screens/Examples'

const Stack = createStackNavigator();

export default function Bank(props) {
    return (
        <Stack.Navigator initialRouteName="WordBank">
            <Stack.Screen name="WordBank" component={WordBank} options={{headerShown: false}} />
            <Stack.Screen name="KanjiDefinition" component={KanjiDefinition} options={{headerShown: false}} />
            <Stack.Screen name="Definition" component={Definition} options={{headerShown: false}} />
            <Stack.Screen name="Examples" component={Examples} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}

