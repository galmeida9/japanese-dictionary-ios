import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Search from '../screens/Search';
import KanjiDefinition from '../screens/KanjiDefinition'
import Definition from '../screens/Definition'
import Examples from '../screens/Examples'

const Stack = createStackNavigator();

export default function Home(props) {
    return (
        <Stack.Navigator initialRouteName="Japanese Dictionary">
            <Stack.Screen name="Japanese Dictionary" component={Search} options={{headerShown: false}} />
            <Stack.Screen name="KanjiDefinition" component={KanjiDefinition} options={{headerShown: false}} />
            <Stack.Screen name="Definition" component={Definition} options={{headerShown: false}} />
            <Stack.Screen name="Examples" component={Examples} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}

