import React, { useContext } from 'react';
import { Dimensions, StyleSheet, ScrollView, Image, PlatformColor, useColorScheme, Text } from 'react-native';
import { Block, Input, Button } from 'galio-framework';
import theme from '../theme';
import GorgeousHeader from "react-native-gorgeous-header";
import WordBankContext from '../components/WordBankContext';
import { Root, Toast, Popup } from 'popup-ui';
import DuoAPI from '../DuoAPI';
import Spinner from 'react-native-loading-spinner-overlay';

const { width, height } = Dimensions.get('screen');

export default function DuolingoLogin(props) {
    const [username, setUsername] = React.useState("");
    const [password, setPasswords] = React.useState("");
    const [progress, setProgress] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const { navigation } = props;
    const context = useContext(WordBankContext);

    const dark = useColorScheme() === "dark";

    const JishoApi = require('unofficial-jisho-api');
    const jisho = new JishoApi();

    const login = () => {
        const duo = new DuoAPI({ username, password });

        duo.login().then((response) => {
            if (!response.hasOwnProperty("failure")) {
                Toast.show({
                    title: 'Login Successfully',
                    text: 'Finding your Duolingo learned words and importing them.',
                    color: PlatformColor("systemGreen"),
                    timing: 4000
                });

                duo.getLearnedWords().then((words) => {
                    addDuoWords(words);
                })
            }
            else {
                Toast.show({
                    title: 'Failed to Login',
                    text: 'Please check your username and password, and try again.',
                    color: PlatformColor("systemRed"),
                    timing: 4000
                });
            }
        })
    }

    const addDuoWords = async (list) => {
        setLoading(true);
        let imported = 0;
        for (let i = list.length-1; i >= 0; i--) {
            let word = list[i];
            if (!context.checkWord(word)) {
                if (word.length == 1) {
                    let data = await jisho.searchForKanji(word);
                    let item = JSON.parse(JSON.stringify(data, null, 2));

                    if (item.found) {
                        imported++;
                        let newWord = {
                            "kanji": word,
                            "hira": item.kunyomi[0],
                            "english": item.meaning
                        }

                        context.addValue(newWord);
                    }
                }
                else {
                    let data = await jisho.searchForPhrase(word);
                    let item = JSON.parse(JSON.stringify(data, null, 2));

                    if (item.meta.status == 200 && item.data.length > 0) {
                        imported++;
                        let newWord = {
                            "kanji": word,
                            "hira": item.data[0].japanese[0].reading,
                            "english": item.data[0].senses[0].english_definitions[0]
                        }

                        context.addValue(newWord);
                    }
                }
            }

            setProgress(100-Math.floor(i / (list.length - 1) * 100));
        }

        setLoading(false);

        Popup.show({
            type: 'Success',
            title: 'Import complete',
            button: true,
            textBody: `Found ${list.length} and imported ${imported} new words to your Word Bank`,
            buttonText: 'Ok',
            callback: () => Popup.hide()
        })
    }

    return (
        <Root>
            <Block safe flex style={{ backgroundColor: PlatformColor("systemBackground") }}>
                <GorgeousHeader
                    title="Duolingo Login"
                    titleTextStyle={{ color: PlatformColor("label"), fontSize: 46, fontWeight: "bold" }}
                    subtitle="Import your learned words from Duolingo"
                    subtitleTextStyle={{ color: PlatformColor("secondaryLabel") }}
                    menuImageSource={dark ? require("../../assets/menu_dark.png") : require("../../assets/hamburger_menu.png")}
                    menuImageStyle={styles.menu}
                    menuImageOnPress={() => navigation.openDrawer()}
                    searchBarStyle={{ width: 0, height: 0 }}
                />

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <Spinner
                        visible={loading}
                        textContent={"Importing " + progress + "%"}
                        textStyle={styles.spinnerTextStyle}
                    />
                    <Block style={styles.container}>
                        <Image source={require("../../assets/duolingo.png")} style={styles.duo} />
                        <Input
                            rounded
                            placeholder="Username"
                            placeholderTextColor={dark ? "white" : "black"}
                            style={{ borderColor: dark ? "white" : "black" }}
                            bgColor={dark ? "black" : "white"}
                            color={dark ? "white" : "black"}
                            onChangeText={(text) => { setUsername(text) }}
                            returnKeyType={'next'}
                            clearButtonMode="always"
                            autoCapitalize='none'
                        />
                        <Input
                            rounded
                            password
                            viewPass
                            placeholder="Password"
                            placeholderTextColor={dark ? "white" : "black"}
                            style={{ borderColor: dark ? "white" : "black" }}
                            bgColor={dark ? "black" : "white"}
                            color={dark ? "white" : "black"}
                            onChangeText={(text) => { setPasswords(text) }}
                            returnKeyType={'go'}
                            onSubmitEditing={login}
                            autoCapitalize='none'
                        />
                        <Button round color={dark ? "rgb(48, 209, 88)" : "rgb(52, 199, 89)"} shadowless size="large" onPress={login}>Log In</Button>
                        <Text style={{ color: PlatformColor("label"), textAlign: 'center', marginTop: 10 }}>
                            This process can take a while if a lot of words need to be imported
                        </Text>
                    </Block>
                </ScrollView>
            </Block>
        </Root>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 14,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PlatformColor("systemBackground"),
        width: width
    },
    menu: {
        height: 40,
        width: 30
    },
    duo: {
        width: 150,
        height: 150,
        marginTop: 20
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
});
