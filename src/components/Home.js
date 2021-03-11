import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Search from '../screens/Search';
import KanjiDefinition from '../screens/KanjiDefinition';
import Definition from '../screens/Definition';
import Examples from '../screens/Examples';
import { useTheme } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function Home(props) {
    const { colors } = useTheme();
    return (
        <Stack.Navigator initialRouteName="Japanese Dictionary">
            <Stack.Screen name="Japanese Dictionary" component={Search} options={{headerShown: false}} initialParams={{theme: colors}} />
            <Stack.Screen name="KanjiDefinition" component={KanjiDefinition} options={{headerShown: false}} />
            <Stack.Screen name="Definition" component={Definition} options={{headerShown: false}} />
            <Stack.Screen name="Examples" component={Examples} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}

