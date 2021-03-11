import React, { useContext, useEffect } from 'react';
import { Dimensions, StyleSheet, ScrollView, PlatformColor, useColorScheme } from 'react-native';
import { Block, Input } from 'galio-framework';
import theme from '../theme';
import GorgeousHeader from "react-native-gorgeous-header";
import WordBankContext from '../components/WordBankContext';
import { Root, Toast, Popup } from 'popup-ui';
import { Card, Title, Paragraph } from 'react-native-paper';

const { width } = Dimensions.get('screen');

export default function PracticeScreen(props) {
    const [currWord, setCurrWord] = React.useState({ "kanji": "", "hira": "", "english": "" });
    const [score, setScore] = React.useState(0);
    const [wordList, setWordList] = React.useState([]);
    const [answer, setAnswer] = React.useState("");
    const [finished, setFinished] = React.useState(false);

    const { navigation, route } = props;
    const context = useContext(WordBankContext);

    const dark = useColorScheme() === "dark";
    const styles = makeStyle(dark);

    useEffect(() => {
        copyList();
    }, [])

    const copyList = () => {
        let list = [];
        for (var i = 0; i < route.params.level; i++) {
            list.push(context.state[Math.floor(Math.random() * context.state.length)]);
        }

        setWordList(list);
        getRandomWord(list);
    }

    const getRandomWord = (list) => {
        let index = Math.floor(Math.random() * list.length);
        setCurrWord(list[index]);

        if (list.length > 2) {
            list.splice(index, 1);
            setWordList(list);
        }
        else if (list.length == 2) {
            list = [list[list.length - 1 - index]]
            setWordList(list);
        }
        else if (list.length == 1) {
            list = []
            setWordList(list);
        }
    }

    const checkInput = () => {
        if (answer != "") {
            if ((currWord.kanji != currWord.hira && answer == currWord.kanji)
                || (currWord.kanji == currWord.hira && answer == currWord.english.split(" ")[0])) {
                let s = score + 1
                setScore(s);

                if (wordList.length > 0) {
                    Toast.show({
                        title: 'Correct answer!',
                        text: 'You wrote the correct answer',
                        color: theme.COLORS.SUCCESS,
                        timing: 2000
                    });
                }
            }
            else {
                let correctResp;
                if (currWord.kanji == currWord.hira) {
                    correctResp = currWord.english;
                }
                else {
                    correctResp = currWord.hira;
                }

                Toast.show({
                    title: 'Wrong answer',
                    text: `The correct answer was: ${correctResp}`,
                    color: theme.COLORS.ERROR,
                    timing: 4000
                });
            }

            if (wordList.length > 0) {
                getRandomWord(wordList);
            }
            else {
                setFinished(true);
            }
            setAnswer("");
        }
    }

    const showScore = () => {
        let finalScore = Math.floor(score / route.params.level * 100);
        var type;
        if (finalScore > 50) {
            type = "Success"
        }
        else {
            type = "Danger"
        }

        return (
            Popup.show({
                type: type,
                title: 'Training Complete',
                button: true,
                textBody: `You got a score of ${finalScore}%`,
                buttonText: 'Ok',
                callback: () => { Popup.hide(); navigation.goBack(); }
            })
        );
    }

    return (
        <Root>
            <Block safe flex style={{ backgroundColor: PlatformColor("systemBackground") }}>
                <GorgeousHeader
                    title="Practice"
                    titleTextStyle={{ color: PlatformColor("label"), fontSize: 46, fontWeight: "bold" }}
                    subtitle="Practice your learned words"
                    subtitleTextStyle={{ color: PlatformColor("secondaryLabel") }}
                    menuImageSource={require("../../assets/back.png")}
                    menuImageStyle={styles.back}
                    menuImageOnPress={() => navigation.goBack()}
                    searchBarStyle={{ width: 0, height: 0 }}
                />

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <Block style={styles.container}>
                        <Card style={styles.card} key={0}>
                            <Card.Content>
                                {currWord.kanji != currWord.hira ? (
                                    <Paragraph style={{ fontSize: 15, textAlign: 'center', color: PlatformColor("label") }}>Write the following kanji</Paragraph>
                                ) : (
                                        <Paragraph style={{ fontSize: 15, textAlign: 'center', color: PlatformColor("label") }}>Write the meaning of this word</Paragraph>
                                    )}
                                {currWord.kanji != currWord.hira ? (
                                    <Title style={{ fontSize: currWord.kanji.length > 4 ? 60 : 80, textAlign: 'center', paddingTop: 80, paddingBottom: 50, color: PlatformColor("label") }}>{currWord.kanji}</Title>
                                ) : (
                                        <Title style={{ fontSize: currWord.hira.length > 4 ? 60 : 80, textAlign: 'center', paddingTop: 80, paddingBottom: 50 , color: PlatformColor("label")}}>{currWord.hira}</Title>
                                    )}
                                <Input
                                    rounded
                                    placeholder="Type answer"
                                    placeholderTextColor={PlatformColor("label")}
                                    style={{ borderColor: PlatformColor("label") }}
                                    bgColor={dark ? "#141414" : "white"}
                                    color={PlatformColor("label")}
                                    onChangeText={(text) => { setAnswer(text.toLowerCase()) }}
                                    returnKeyType={'next'}
                                    onSubmitEditing={checkInput}
                                    clearButtonMode="always"
                                    autoCapitalize='none'
                                    value={answer}
                                />
                            </Card.Content>
                        </Card>
                        {finished ? showScore() : null}
                    </Block>
                </ScrollView>
            </Block>
        </Root>
    );
}

const makeStyle = (dark) => {
    return (
        StyleSheet.create({
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
            card: {
                borderWidth: 0,
                backgroundColor: dark ? "#141414" : "white",
                width: width - theme.SIZES.BASE * 2,
                marginVertical: theme.SIZES.BASE * 0.875,
            },
        })
    );
}
