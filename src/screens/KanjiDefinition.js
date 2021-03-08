import React, { useEffect, useContext } from 'react';
import { View, Dimensions, StyleSheet, ScrollView, Image, Text } from 'react-native';
import { Block, Button } from 'galio-framework';
import theme from '../theme';
import GorgeousHeader from "react-native-gorgeous-header";
import { Card, Title, Paragraph, Modal, Portal, Provider } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import WordBankContext from '../components/WordBankContext';
import { Root, Toast } from 'popup-ui';

const { width, height } = Dimensions.get('screen');

export default function KanjiDefinition(props) {
    const [item, setItem] = React.useState({});
    const [meanings, setMeanings] = React.useState("");
    const [examples, setExamples] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [strokes, setStrokes] = React.useState(false);
    const [wordBank, setWordBank] = React.useState(false);

    const context = useContext(WordBankContext);

    const JishoApi = require('unofficial-jisho-api');
    const jisho = new JishoApi();

    const { navigation, route } = props;

    useEffect(() => {
        performSearch();
        getWords();
    }, [])

    const performSearch = async () => {
        setLoading(true);
        let data = await jisho.searchForKanji(route.params.word);
        let data2 = await jisho.searchForExamples(route.params.word);

        const newItem = JSON.parse(JSON.stringify(data, null, 2));
        const newExamples = JSON.parse(JSON.stringify(data2, null, 2));

        const spltMeaning = newItem.meaning.split(",");
        if (spltMeaning.length > 3) {
            var newMeaning = "";
            for (var i = 0; i < 3; i++) {
                newMeaning += i == 2 ? spltMeaning[i] : spltMeaning[i] + ",";
            }

            setMeanings(newMeaning);
        }
        else {
            setMeanings(newItem.meaning);
        }

        setItem(newItem);
        setExamples(newExamples.results);
        setLoading(false)
    }

    const addToWordBank = () => {
        let word = {
            "kanji": route.params.word,
            "hira": item.kunyomi[0],
            "english": item.meaning
        }

        context.addValue(word);
        setWordBank(true);
    }

    const getWords = async () => {
        if (context.state.japanese.filter(el => route.params.word == el.kanji).length > 0) {
            setWordBank(true);
        }
    }

    const makeExampleCard = (example, index) => {
        return (
            <Card style={styles.card} key={index}>
                <Card.Content>
                    <Title style={{ fontSize: 30, textAlign: 'center' }}>{example.example}</Title>
                    <Paragraph style={{ fontSize: 15, textAlign: 'center' }}>{example.reading}</Paragraph>
                    <Paragraph style={{ fontSize: 15, textAlign: 'center' }}>{example.meaning}</Paragraph>
                </Card.Content>
            </Card>
        );
    }

    const showModal = () => setStrokes(true);
    const hideModal = () => setStrokes(false);

    return (
        <Root>
            <Block safe flex style={{ backgroundColor: '#fff' }}>
                <GorgeousHeader
                    title="Kanji Definition"
                    subtitle="Definition, Stroke Order and Examples"
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
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ justifyContent: 'flex-start', fontSize: 150 }}>{route.params.word}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ justifyContent: 'flex-end', fontSize: 35 }}>{meanings}</Text>
                                        {item.kunyomi != null ? (<Text style={{ justifyContent: 'flex-end', fontSize: 25, marginTop: 10 }}>{item.kunyomi[0]}</Text>) : (<Text />)}
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ justifyContent: 'flex-start', fontSize: 20, marginLeft: 25 }}>{item.strokeCount} strokes</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ justifyContent: 'flex-end', fontSize: 20 }}>JLPT {item.jlptLevel}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: 20 }}>
                                    {wordBank ? (
                                        <Button round color="success" shadowless>In Word Bank</Button>
                                    ) : (
                                            <Button round color="warning" shadowless onPress={() => {
                                                addToWordBank();
                                                Toast.show({
                                                    title: 'Added to Word Bank',
                                                    text: 'This word was added to your Word Bank.',
                                                    color: '#2ecc71',
                                                    timing: 4000
                                                });
                                            }}>Add to Word Bank</Button>
                                        )}
                                    <Button round color="theme" shadowless onPress={showModal}>Stroke Order</Button>
                                </View>
                                <Block flex space="between" style={styles.cards}>
                                    {JSON.stringify(item) != "{}" ? (
                                        item.kunyomiExamples.map((value, index) => {
                                            return (makeExampleCard(value, index))
                                        })
                                    ) : <Text />}
                                </Block>
                                <Button round color="info" shadowless size="large" onPress={() => { navigation.navigate("Examples", { examples: examples }) }}>Show Examples</Button>
                                <Provider>
                                    <Portal>
                                        <Modal visible={strokes} onDismiss={hideModal} contentContainerStyle={styles.modal}>
                                            {item.strokeOrderGifUri != null ? (<Image source={{ uri: item.strokeOrderGifUri }} style={styles.gif} />) : null}
                                        </Modal>
                                    </Portal>
                                </Provider>
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

