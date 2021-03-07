import React from 'react';
import { Dimensions, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Text, Block, Input } from 'galio-framework';
import theme from '../theme';
import { ListItem } from 'react-native-elements'
import Spinner from 'react-native-loading-spinner-overlay';
import GorgeousHeader from "react-native-gorgeous-header";

const { width, height } = Dimensions.get('screen');

export default function Search(props) {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    const { navigation } = props;

    const JishoApi = require('unofficial-jisho-api');
    const jisho = new JishoApi();

    const searchDict = () => {
        setLoading(true);
        jisho.searchForPhrase(query.toLowerCase()).then((data) => {
            setResults(data);
            setLoading(false);
        });
    }

    const openDefinition = (value) => {
        if (value["slug"].length == 1) {
            navigation.navigate("KanjiDefinition", { word: value["slug"].replace("-1", "") });
        }
        else {
            navigation.navigate("Definition", { word: value["slug"].replace("-1", "") })
        }
    }

    const dataToDisplay = () => {
        if (JSON.stringify(results) == "{}" && !loading) {
            return (
                <Text style={styles.searchMsg}>Search something in the search bar :)</Text>
            );
        }
        else if (loading) {
            return (
                <Spinner
                    visible={loading}
                    textContent={'Searching...'}
                    textStyle={styles.spinnerTextStyle}
                />
            );
        }
        else if (results["data"].length == 0) {
            return (
                <Block>
                    <Text style={styles.noResults}>No Results Found</Text>
                    <Text style={{ marginTop: 10, textAlign: 'center' }}>You can search in english, hiragana, katakana, kanji and in romanji</Text>
                </Block>
            );
        }
        else {
            return (
                results["data"].map((value, i) => (
                    <ListItem key={i} bottomDivider onPress={() => { openDefinition(value) }}>
                        <ListItem.Content>
                            <ListItem.Title style={{ fontSize: 20 }}>{value["slug"].replace("-1", "")}</ListItem.Title>
                            <ListItem.Subtitle style={{ marginTop: 5, fontSize: 15 }}>{value["japanese"][0]["reading"]}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                ))
            );
        }
    }

    return (
        <Block safe flex style={{ backgroundColor: '#fff' }}>
            <GorgeousHeader
                title="Dictionary"
                subtitle="Japanese Dictionary"
                menuImageSource={require("../../assets/hamburger_menu.png")}
                menuImageStyle={styles.menu}
                menuImageOnPress={() => navigation.openDrawer()}
                searchBarStyle={{width: 0, height: 0}}
            />

            <Block style={{ padding: theme.SIZES.BASE, paddingBottom: 0, }}>
                <Input
                    rounded
                    placeholder="Search Dictionary..."
                    placeholderTextColor={theme.COLORS.INFO}
                    style={{ borderColor: theme.COLORS.INFO }}
                    onChangeText={(text) => { setQuery(text); }}
                    returnKeyType={'search'}
                    onSubmitEditing={searchDict}
                />
            </Block>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Block style={styles.container}>
                    <Block flex>
                        {dataToDisplay()}
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
        backgroundColor: theme.COLORS.WHITE,
        width: width
    },
    searchMsg: {
        textAlign: 'center',
        marginTop: height / 4,
    },
    noResults: {
        textAlign: 'center',
        marginTop: height / 4,
        fontSize: 25
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    menu: {
        height: 40,
        width: 30
    }
});

