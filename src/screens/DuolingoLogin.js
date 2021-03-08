import React, { useContext } from 'react';
import { Dimensions, StyleSheet, ScrollView, Image } from 'react-native';
import { Block, Input, Button, Icon } from 'galio-framework';
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
    const [totalWords, setTotalWords] = React.useState(0);
    const [totalImp, setTotalImp] = React.useState(-1);
    const [loading, setLoading] = React.useState(false);

    const { navigation } = props;
    const context = useContext(WordBankContext);

    const JishoApi = require('unofficial-jisho-api');
    const jisho = new JishoApi();

    const login = () => {
        const duo = new DuoAPI({ username, password });

        duo.login().then((response) => {
            if (!response.hasOwnProperty("failure")) {
                Toast.show({
                    title: 'Login Successfully',
                    text: 'Finding your Duolingo learned words and importing them.',
                    color: theme.COLORS.SUCCESS,
                    timing: 4000
                });

                duo.getLearnedWords().then((words) => {
                    setTotalWords(words.length);
                    addDuoWords(words);
                })
            }
            else {
                Toast.show({
                    title: 'Failed to Login',
                    text: 'Please check your username and password, and try again.',
                    color: theme.COLORS.ERROR,
                    timing: 4000
                });
            }
        })
    }

    const addDuoWords = async (list) => {
        setLoading(true);
        let imported = 0;
        for (let i = 0; i < list.length; i++) {
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

            setProgress(Math.floor(i / (list.length - 1) * 100));
        }

        setTotalImp(imported);
        setLoading(false);

        Popup.show({
            type: 'Success',
            title: 'Import complete',
            button: true,
            textBody: `Found ${totalWords} and imported ${totalImp} new words to your Word Bank`,
            buttonText: 'Ok',
            callback: () => Popup.hide()
        })
    }

    return (
        <Root>
            <Block safe flex style={{ backgroundColor: '#fff' }}>
                <GorgeousHeader
                    title="Duoling Login"
                    subtitle="Import all your yours to your Word Bank"
                    menuImageSource={require("../../assets/hamburger_menu.png")}
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
                            placeholderTextColor={theme.COLORS.BLACK}
                            style={{ borderColor: theme.COLORS.BLACK }}
                            onChangeText={(text) => { setUsername(text) }}
                            returnKeyType={'next'}
                            clearButtonMode="always"
                        />
                        <Input
                            rounded
                            password
                            viewPass
                            placeholder="Password"
                            placeholderTextColor={theme.COLORS.BLACK}
                            style={{ borderColor: theme.COLORS.BLACK }}
                            onChangeText={(text) => { setPasswords(text) }}
                            returnKeyType={'go'}
                            onSubmitEditing={login}
                        />
                        <Button round color="success" shadowless size="large" onPress={login}>Log In</Button>
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
        backgroundColor: theme.COLORS.WHITE,
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

