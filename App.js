import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import Home from './src/screens/Home';
import Bank from './src/screens/Bank';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './src/components/DrawerContent';
import WordBankContext from './src/components/WordBankContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

export default function App() {
    const [words, setWords] = React.useState({ "japanese": [], "highscore": 0, "dark": false });
    // const [currTheme, setCurrTheme] = React.useState(lightTheme);

    useEffect(() => {
        readFile();
    }, [])

    const readFile = async () => {
        try {
            let newWords = await AsyncStorage.getItem("words");

            if (newWords !== null) {
                setWords(JSON.parse(newWords));
            }
        } catch (err) {
            alert(err);
        }
    }

    const writeWords = async () => {
        try {
            await AsyncStorage.setItem("words", JSON.stringify(words));
            setWords(words);
        } catch (err) {
            alert(err)
        }
    }

    const addWord = async (word) => {
        words.japanese.unshift(word);
        await writeWords();
    }

    const removeWord = async (kanji) => {
        let wordsCopy = words.japanese;
        let index = wordsCopy.map(e => e.kanji).indexOf(kanji)
        if (index != -1) {
            words.japanese.splice(index, 1);
            await writeWords();
        }
    }

    const setHighScore = async (value) => {
        words.highscore = value;
        await writeWords();
    }

    const setTheme = async (bool) => {
        words.dark = bool;
        await writeWords();
    }

    const checkWordBank = (kanji) => {
        if (words.japanese.filter(el => kanji == el.kanji).length > 0) {
            return true;
        }

        return false;
    }
    return (
        <WordBankContext.Provider
            value={{ state: words, addValue: addWord, removeValue: removeWord, setScore: setHighScore, setTheme: setTheme, checkWord: checkWordBank }}
        >
            <NavigationContainer>
                <StatusBar style="auto" />
                <Drawer.Navigator initialRouteName="Dictionary" drawerContent={(props) => <DrawerContent {...props} />}>
                    <Drawer.Screen name="Dictionary" component={Home} />
                    <Drawer.Screen name="Bank" component={Bank} />
                </Drawer.Navigator>
            </NavigationContainer>
        </WordBankContext.Provider>
    );
}
