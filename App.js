import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import Home from './src/components/Home';
import Bank from './src/components/Bank';
import DuolingoLogin from './src/screens/DuolingoLogin';
import Practice from './src/components/Practice';
import FlashCardsWrapper from './src/components/FlashCardsWrapper';
import Study from './src/components/Study';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './src/components/DrawerContent';
import WordBankContext from './src/components/WordBankContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import theme from './src/theme';

const Drawer = createDrawerNavigator();

export default function App() {
    const [words, setWords] = React.useState([]);
    const [wrongWords, setWrongWords] = React.useState([]);

    useEffect(() => {
        readFile();
    }, [])

    const readFile = async () => {
        try {
            let newWords = await AsyncStorage.getItem("words");
            let newWrongWords = await AsyncStorage.getItem("wrongWords");
            console.log(newWrongWords)

            if (newWords !== null) {
                setWords(JSON.parse(newWords));
            }

            if (newWrongWords !== null) {
                setWrongWords(JSON.parse(newWrongWords));
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

    const writeWrongWords = async () => {
        try {
            await AsyncStorage.setItem("wrongWords", JSON.stringify(wrongWords));
            setWrongWords(wrongWords);
        } catch (err) {
            alert(err)
        }
    }

    const addWord = async (word) => {
        words.unshift(word);
        await writeWords();
    }

    const addWrongWord = async (word) => {
        wrongWords.unshift(word);
        await writeWrongWords();
    }

    const removeWord = async (kanji) => {
        let wordsCopy = words;
        let index = wordsCopy.map(e => e.kanji).indexOf(kanji)
        if (index != -1) {
            words.splice(index, 1);
            await writeWords();
        }
    }

    const removeWrongWord = async (kanji) => {
        let wordsCopy = wrongWords;
        let index = wordsCopy.map(e => e.kanji).indexOf(kanji)
        if (index != -1) {
            wrongWords.splice(index, 1);
            await writeWrongWords();
        }
    }

    const checkWordBank = (kanji) => {
        if (words.filter(el => kanji == el.kanji).length > 0) {
            return true;
        }

        return false;
    }

    const checkWrongWords = (kanji) => {
        if (wrongWords.filter(el => kanji == el.kanji).length > 0) {
            return true;
        }

        return false;
    }

    return (
        <WordBankContext.Provider
            value={{
                state: words,
                wrong: wrongWords,
                addValue: addWord,
                addWrong: addWrongWord,
                removeValue: removeWord,
                removeWrong: removeWrongWord,
                checkWord: checkWordBank,
                checkWrong: checkWrongWords
            }}
        >
            <NavigationContainer theme={Appearance.getColorScheme() === "dark" ? theme.DarkTheme : theme.LightTheme}>
                <StatusBar style="auto" />
                <Drawer.Navigator initialRouteName="Dictionary" drawerContent={(props) => <DrawerContent {...props} />}>
                    <Drawer.Screen name="Dictionary" component={Home} />
                    <Drawer.Screen name="Bank" component={Bank} />
                    <Drawer.Screen name="DuolingoLogin" component={DuolingoLogin} />
                    <Drawer.Screen name="FlashCardsWrapper" component={FlashCardsWrapper} />
                    <Drawer.Screen name="Practice" component={Practice} />
                    <Drawer.Screen name="Study" component={Study} />
                </Drawer.Navigator>
            </NavigationContainer>
        </WordBankContext.Provider>
    );
}
