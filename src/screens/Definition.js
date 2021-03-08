import React, { useEffect, useContext } from 'react';
import { View, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Text, Block, Button } from 'galio-framework';
import theme from '../theme';
import GorgeousHeader from "react-native-gorgeous-header";
import { Card, Title, Paragraph } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import { Root, Toast } from 'popup-ui';
import WordBankContext from '../components/WordBankContext';

const { width, height } = Dimensions.get('screen');

export default function Definition(props) {
    const [item, setItem] = React.useState({});
    const [meanings, setMeanings] = React.useState("");
    const [examples, setExamples] = React.useState([]);
    const [jlpt, setJlpt] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [wordBank, setWordBank] = React.useState(false);

    const JishoApi = require('unofficial-jisho-api');
    const jisho = new JishoApi();

    const { navigation, route } = props;
    const context = useContext(WordBankContext);

    useEffect(() => {
        performSearch();
        getWords();
    }, [])

    const performSearch = async () => {
        setLoading(true);
        let data = await jisho.searchForPhrase(route.params.word);
        let data2 = await jisho.searchForExamples(route.params.word);

        const item = JSON.parse(JSON.stringify(data, null, 2));
        const examples = JSON.parse(JSON.stringify(data2, null, 2));

        const spltMeaning = item.data[0].senses[0].english_definitions;
        if (spltMeaning.length > 3) {
            var newMeaning = "";
            for (var i = 0; i < 3; i++) {
                newMeaning += i == 2 ? spltMeaning[i] : spltMeaning[i] + ",";
            }

            setMeanings(newMeaning);
        }
        else {
            setMeanings(spltMeaning.join(", "));
        }

        if (item.data[0].jlpt.length > 0) {
            setJlpt(item.data[0].jlpt[0].toUpperCase());
        }

        setItem(item.data[0]);
        setExamples(examples.results);
        setLoading(false)
    }

    const getWords = async () => {
        if (context.state.japanese.filter(el => route.params.word == el.kanji).length > 0) {
            setWordBank(true);
        }
    }

    const addToWordBank = () => {
        let word = {
            "kanji": route.params.word,
            "hira": item.japanese[0].reading,
            "english": item.senses[0].english_definitions[0]
        }

        context.addValue(word);
        setWordBank(true);
    }

    const makeExampleCard = (example, index) => {
        return (
            <Card style={styles.card} key={index}>
                <Card.Content>
                    <Paragraph style={{ fontSize: 15, textAlign: 'center' }}>{example.parts_of_speech}</Paragraph>
                    <Title style={{ fontSize: 30, textAlign: 'center' }}>{example.english_definitions.join(", ")}</Title>
                </Card.Content>
            </Card>
        );
    }

    return (
        <Root>
            <Block safe flex style={{ backgroundColor: '#fff' }}>
                <GorgeousHeader
                    title="Word Definition"
                    subtitle="Definition and Examples"
                    menuImageSource={require("../../assets/back.png")}
                    menuImageStyle={styles.back}
                    menuImageOnPress={() => navigation.goBack()}
                    searchBarStyle={{ width: 0, height: 0 }}
                    subtitleTextStyle={{ paddingBottom: 10 }}
                />

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {loading ? (
                        <Spinner
                            visible={loading}
                            textContent={'Loading...'}
                            textStyle={styles.spinnerTextStyle}
                        />
                    ) : (
                            <Block style={styles.container}>
                                <Text style={{ fontSize: width / (route.params.word).length - 10, marginLeft: 10 }}>{route.params.word}</Text>
                                <Text style={{ fontSize: 25, marginLeft: 10, marginTop: 10 }}>{meanings}</Text>
                                {item.japanese != null && route.params.word != item.japanese[0].reading ? (
                                    <Text style={{ fontSize: 25, marginTop: 10, marginLeft: 10 }}>{item.japanese[0].reading}</Text>
                                ) : null}
                                <Text style={{ justifyContent: 'flex-end', fontSize: 20, marginTop: 10, marginLeft: 10 }}>{jlpt}</Text>
                                <View style={{ flexDirection: "row", marginTop: 20 }}>
                                    {wordBank ? (
                                        <Button round color="success" shadowless size="large">In Word Bank</Button>
                                    ) : (
                                            <Button round color="warning" shadowless size="large" onPress={() => {
                                                addToWordBank();
                                                Toast.show({
                                                    title: 'Added to Word Bank',
                                                    text: 'This word was added to your Word Bank.',
                                                    color: theme.COLORS.SUCCESS,
                                                    timing: 4000
                                                });
                                            }}>Add to Word Bank</Button>
                                        )}
                                </View>
                                <Block flex space="between" style={styles.cards}>
                                    {JSON.stringify(item) != "{}" ? (
                                        item.senses.map((value, index) => {
                                            return (makeExampleCard(value, index))
                                        })
                                    ) : <Text />}
                                </Block>
                                <Button round color="info" shadowless size="large" onPress={() => { navigation.navigate("Examples", { examples: examples }) }}>Show Examples</Button>
                            </Block>
                        )}
                </ScrollView>
            </Block>
        </Root>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 14,
        justifyContent: 'flex-start',
        backgroundColor: theme.COLORS.WHITE,
        width: width,
    },
    cards: {
        flex: 1,
        backgroundColor: theme.COLORS.WHITE,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    card: {
        borderWidth: 0,
        backgroundColor: theme.COLORS.WHITE,
        width: width - theme.SIZES.BASE * 2,
        marginVertical: theme.SIZES.BASE * 0.875,
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    modal: {
        position: 'absolute',
        padding: 20,
        top: 100,
        width: width - 40,
        height: height - 500
    },
    gif: {
        resizeMode: 'stretch',
        width: width - 40,
        height: height - 500
    },
    back: {
        height: 30,
        width: 30,
    }
});

