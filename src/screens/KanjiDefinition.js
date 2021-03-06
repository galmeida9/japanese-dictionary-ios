import React, { useEffect } from 'react';
import { View, Dimensions, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Text, Block, Button, NavBar, Icon } from 'galio-framework';
import theme from '../theme';

const { width, height } = Dimensions.get('screen');

export default function KanjiDefinition(props) {
    const [item, setItem] = React.useState({});
    const [meanings, setMeanings] = React.useState("");
    const [examples, setExamples] = React.useState([]);

    const JishoApi = require('unofficial-jisho-api');
    const jisho = new JishoApi();

    const { navigation, route } = props;

    useEffect(() => {
        performSearch();
    }, [])

    const performSearch = async () => {
        let data = await jisho.searchForKanji(route.params.word);
        let data2 = await jisho.searchForExamples(route.params.word);

        const item = JSON.parse(JSON.stringify(data, null, 2));
        const examples = JSON.parse(JSON.stringify(data2, null, 2));

        const spltMeaning = item.meaning.split(",");
        if (spltMeaning.length > 3) {
            var newMeaning = "";
            for (var i = 0; i < 3; i++) {
                newMeaning += i == 2? spltMeaning[i] : spltMeaning[i] + ",";
            }

            setMeanings(newMeaning);
        }
        else {
            setMeanings(item.meaning);
        }

        setItem(item);
        setExamples(examples.results);
    }

    return (
        <Block safe flex style={{ backgroundColor: '#fff' }}>
            <NavBar
                title="Kanji Definition"
                left={(
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Icon
                            name="menu"
                            family="feather"
                            size={theme.SIZES.BASE}
                            color={theme.COLORS.ICON}
                        />
                    </TouchableOpacity>
                )}
                style={Platform.OS === 'android' ? { marginTop: theme.SIZES.BASE } : null}
            />

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Block style={styles.container}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ justifyContent: 'flex-start', fontSize: 150 }}>{route.params.word}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ justifyContent: 'flex-end', fontSize: 35 }}>{meanings}</Text>
                            { item.kunyomi != null ? (<Text style={{ justifyContent: 'flex-end', fontSize: 25, marginTop: 10 }}>{item.kunyomi[0]}</Text>) : (<Text/>) }
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
                </Block>
            </ScrollView>
        </Block>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 14,
        justifyContent: 'flex-start',
        backgroundColor: theme.COLORS.WHITE,
        width: width,
    },
});

