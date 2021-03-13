import React, { useContext, useEffect } from 'react';
import { Dimensions, StyleSheet, PlatformColor, useColorScheme, Animated } from 'react-native';
import { Block, Button } from 'galio-framework';
import theme from '../theme';
import GorgeousHeader from "react-native-gorgeous-header";
import WordBankContext from '../components/WordBankContext';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');

export default function FlashCards(props) {
    const [currWord, setCurrWord] = React.useState({ "kanji": "", "hira": "", "english": "" });
    const [animatedValue, setAnimatedValue] = React.useState(new Animated.Value(0));
    const [value, setValue] = React.useState(0);
    const [english, setEnglish] = React.useState("");

    const { navigation } = props;
    const context = useContext(WordBankContext);
    const isFocused = useIsFocused();

    const dark = useColorScheme() === "dark";
    const styles = makeStyle(dark);

    const frontAnimatedStyle = {
        transform: [
            {
                rotateY: animatedValue.interpolate({
                    inputRange: [0, 180],
                    outputRange: ["0deg", "180deg"]
                })
            }
        ]
    }

    const backAnimatedStyle = {
        transform: [
            {
                rotateY: animatedValue.interpolate({
                    inputRange: [0, 180],
                    outputRange: ["180deg", "360deg"]
                })
            }
        ]
    }

    const frontOpacity = animatedValue.interpolate({
        inputRange: [89, 90],
        outputRange: [1, 0]
    })

    const backOpacity = animatedValue.interpolate({
        inputRange: [89, 90],
        outputRange: [0, 1]
    })

    useEffect(() => {
        nextWord();
        animatedValue.addListener(({ value }) => {
            setValue(value);
        })
    }, [isFocused])

    const getRandomWord = () => {
        let index = Math.floor(Math.random() * context.state.length);
        setCurrWord(context.state[index]);
        setEnglish(context.state[index].english.split(",")[0])
    }

    const flipCard = () => {
        if (value >= 90) {
            Animated.spring(animatedValue, {
                toValue: 0,
                friction: 8,
                tension: 10,
                useNativeDriver: true
            }).start();
        }
        else {
            Animated.spring(animatedValue, {
                toValue: 180,
                friction: 8,
                tension: 10,
                useNativeDriver: true
            }).start();
        }
    }

    const nextWord = () => {
        if (value >= 90) {
            flipCard();
        }

        getRandomWord();
    }

    return (
        <Block safe flex style={{ backgroundColor: PlatformColor("systemBackground") }}>
            <GorgeousHeader
                title="Flash Cards"
                titleTextStyle={{ color: PlatformColor("label"), fontSize: 46, fontWeight: "bold" }}
                subtitle="Check if you still remember these words"
                subtitleTextStyle={{ color: PlatformColor("secondaryLabel") }}
                menuImageSource={dark ? require("../../assets/menu_dark.png") : require("../../assets/hamburger_menu.png")}
                menuImageStyle={styles.menu}
                menuImageOnPress={() => navigation.openDrawer()}
                searchBarStyle={{ width: 0, height: 0 }}
            />

            <Block style={styles.container}>
                <Block>
                    <Animated.View style={[frontAnimatedStyle, { opacity: frontOpacity }]}>
                        <Card style={styles.card} key={0} onPress={() => flipCard()}>
                            <Card.Content>
                                {currWord.kanji != currWord.hira ? (
                                    <Title style={{ fontSize: currWord.kanji.length > 4 ? 60 : 80, textAlign: 'center', paddingTop: 80, paddingBottom: 50, color: PlatformColor("label") }}>{currWord.kanji}</Title>
                                ) : (
                                        <Title style={{ fontSize: currWord.hira.length > 4 ? 60 : 80, textAlign: 'center', paddingTop: 80, paddingBottom: 50, color: PlatformColor("label") }}>{currWord.hira}</Title>
                                    )}
                            </Card.Content>
                        </Card>
                    </Animated.View>
                    <Animated.View style={[styles.cardBack, backAnimatedStyle, { opacity: backOpacity }]}>
                        <Card style={styles.card} key={1} onPress={() => flipCard()}>
                            <Card.Content>
                                <Title style={{ fontSize: 30, textAlign: 'center', paddingTop: 20, paddingBottom: 30, color: PlatformColor("label") }}>{currWord.hira}</Title>
                                <Paragraph style={{ fontSize: 30, textAlign: 'center', paddingTop: 30, paddingBottom: 20, color: PlatformColor("label") }}>{english}</Paragraph>
                                <Button
                                    style={{ marginLeft: '25%' }}
                                    round
                                    color="info"
                                    color={dark ? "rgb(10, 132, 255)" : "rgb(0, 122, 255)"}
                                    shadowless
                                    onPress={() => {
                                        if (currWord.kanji.length == 1) {
                                            navigation.navigate("KanjiDefinition", { word: currWord.kanji });
                                        }
                                        else {
                                            navigation.navigate("Definition", { word: currWord.kanji });
                                        }
                                    }}
                                >
                                    Dictionary
                                </Button>
                            </Card.Content>
                        </Card>
                    </Animated.View>
                </Block>
                <Block style={{ flexDirection: "row", marginTop: 140 }}>
                    <Button
                        onlyIcon
                        icon="times"
                        iconFamily="font-awesome"
                        iconSize={30}
                        color={dark ? "rgb(255, 69, 58)" : "rgb(255, 59, 48)"}
                        onPress={nextWord}
                        shadowless
                    >
                    </Button>
                    <Button
                        style={{ marginLeft: 160 }}
                        onlyIcon
                        icon="check"
                        iconFamily="font-awesome"
                        iconSize={30}
                        color={dark ? "rgb(48, 209, 88)" : "rgb(52, 199, 89)"}
                        onPress={nextWord}
                        shadowless
                    >
                    </Button>
                </Block>
            </Block>
        </Block>
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
                width: width,
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
                marginTop: height / 6,
            },
            cardBack: {
                position: 'absolute',
                top: 0,
            },
        })
    );
}
