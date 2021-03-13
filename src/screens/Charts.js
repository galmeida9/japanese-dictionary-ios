import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, ScrollView, PlatformColor, useColorScheme } from 'react-native';
import { Block } from 'galio-framework';
import GorgeousHeader from "react-native-gorgeous-header";
import { Card, Title, Paragraph } from 'react-native-paper';
import theme from '../theme';

const { width } = Dimensions.get('screen');

export default function StudyMaterial(props) {
    const [content, setContent] = React.useState([]);
    const [dakuon, setDakuon] = React.useState([]);

    const { navigation, route } = props;
    const dark = useColorScheme() === "dark";

    const allContent = {
        hiragana: [
            ["あ", "い", "う", "え", "お"],
            ["か", "き", "く", "け", "こ"],
            ["さ", "し", "す", "せ", "そ"],
            ["た", "ち", "つ", "て", "と"],
            ["な", "に", "ぬ", "ね", "の"],
            ["は", "ひ", "ふ", "へ", "ほ"],
            ["ま", "み", "む", "め", "も"],
            ["や", "　", "ゆ", "　", "よ"],
            ["ら", "り", "る", "れ", "ろ"],
            ["わ", "　", "　", "　", "を"],
            ["ん", "　", "　", "　", "　"],
        ],
        katakana: [
            ["ア", "イ", "ウ", "エ", "オ"],
            ["カ", "キ", "ク", "ケ", "コ"],
            ["サ", "シ", "ク", "ケ", "コ"],
            ["タ", "チ", "ス", "セ", "ソ"],
            ["ナ", "ニ", "ヌ", "ネ", "ノ"],
            ["ハ", "ヒ", "フ", "ヘ", "ホ"],
            ["マ", "ミ", "ム", "メ", "モ"],
            ["ヤ", "　", "ユ", "　", "ヨ"],
            ["ラ", "リ", "ル", "レ", "ロ"],
            ["ワ", "　", "　", "　", "ヲ"],
            ["ン", "　", "　", "　", "　"],
        ],
        hiraDakuon: [
            ["が", "ぎ", "ぐ", "げ", "ご"],
            ["ざ", "じ", "ず", "ぜ", "ぞ"],
            ["だ", "ぢ", "づ", "で", "ど"],
            ["ば", "び", "ぶ", "べ", "ぼ"],
            ["パ", "ぴ", "ぷ", "ぺ", "ぽ"],
        ],
        kataDakuon: [
            ["ガ", "ギ", "グ", "ゲ", "ゴ"],
            ["ザ", "ジ", "ズ", "ゼ", "ゾ"],
            ["ダ", "ヂ", "ヅ", "デ", "ド"],
            ["バ", "ビ", "ブ", "ベ", "ボ"],
            ["パ", "ピ", "プ", "ペ", "ポ"],
        ],
    };

    const translation = [
        ["a", "i", "u", "e", "o"],
        ["ka", "ki", "ku", "ke", "ko"],
        ["sa", "shi", "su", "se", "so"],
        ["ta", "chi", "tsu", "te", "to"],
        ["na", "ni", "nu", "ne", "no"],
        ["ha", "hi", "fu", "he", "ho"],
        ["ma", "mi", "mu", "me", "mo"],
        ["ya", " ", "yu", " ", "yo"],
        ["ra", "ri", "ru", "re", "ro"],
        ["wa", " ", " ", " ", "wo"],
        ["n", " ", " ", " ", " "],
    ];

    const transDakuon = [
        ["ga", "gi", "gu", "ge", "go"],
        ["za", "ji", "zu", "ze", "zo"],
        ["da", "ji", "zu", "de", "do"],
        ["ba", "bi", "bu", "be", "bo"],
        ["pa", "pi", "pu", "pe", "po"],
    ];

    useEffect(() => {
        route.params.content == "Hiragana" ? setContent(allContent.hiragana) : setContent(allContent.katakana);
        route.params.content == "Hiragana" ? setDakuon(allContent.hiraDakuon) : setDakuon(allContent.kataDakuon);
    }, [])

    const printCards = (dataArray, engTranslation) => {
        return (
            dataArray.map((row, i) => {
                return (
                    <Block style={{ flexDirection: "row" }} key={i}>
                        {row.map((item, j) => {
                            return (
                                <Card style={[styles.card, { backgroundColor: dark ? "#141414" : "white", }]} key={item == "　" ? i + j : item}>
                                    <Card.Content>
                                        <Title style={{ fontSize: 30, textAlign: 'center', paddingBottom: 50, color: PlatformColor("label") }}>{item}</Title>
                                        <Paragraph style={{ fontSize: 15, textAlign: 'center', marginTop: -20, color: PlatformColor("secondaryLabel") }}>{engTranslation[i][j]}</Paragraph>
                                    </Card.Content>
                                </Card>
                            );
                        })}
                    </Block>
                );
            })
        );
    }

    return (
        <Block safe flex style={{ backgroundColor: PlatformColor("systemBackground") }}>
            <GorgeousHeader
                title={route.params.content}
                titleTextStyle={{ color: PlatformColor("label"), fontSize: 46, fontWeight: "bold" }}
                subtitle={route.params.content + " chart"}
                subtitleTextStyle={{ color: PlatformColor("secondaryLabel"), paddingBottom: 10 }}
                menuImageSource={require("../../assets/back.png")}
                menuImageStyle={styles.back}
                menuImageOnPress={() => navigation.goBack()}
                searchBarStyle={{ width: 0, height: 0 }}
            />

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Block style={styles.container}>
                    <Block flex style={styles.cards}>
                        {printCards(content, translation)}
                    </Block>
                    <Title style={{ fontSize: 30, marginLeft: 10, marginTop: 10, color: PlatformColor("label") }}>Dakuon</Title>
                    <Block flex style={styles.cards}>
                        {printCards(dakuon, transDakuon)}
                    </Block>
                </Block>
            </ScrollView>
        </Block>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 14,
        justifyContent: 'flex-start',
        backgroundColor: PlatformColor("systemBackground"),
        width: width
    },
    back: {
        height: 30,
        width: 30,
    },
    card: {
        borderWidth: 0,
        width: 60,
        height: 80,
        marginVertical: theme.SIZES.BASE * 0.875,
        marginRight: 5,
        marginLeft: 5
    },
    cards: {
        flex: 1,
        backgroundColor: PlatformColor("systemBackground"),
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
});

