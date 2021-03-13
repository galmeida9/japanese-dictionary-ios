import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FlashCards from '../screens/FlashCards';
import KanjiDefinition from '../screens/KanjiDefinition';
import Definition from '../screens/Definition';
import Examples from '../screens/Examples';

const Stack = createStackNavigator();

export default function FlashCardsWrapper(props) {
    return (
        <Stack.Navigator initialRouteName="FlashCards">
            <Stack.Screen name="FlashCards" component={FlashCards} options={{headerShown: false}} />
            <Stack.Screen name="KanjiDefinition" component={KanjiDefinition} options={{headerShown: false}} />
            <Stack.Screen name="Definition" component={Definition} options={{headerShown: false}} />
            <Stack.Screen name="Examples" component={Examples} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}

