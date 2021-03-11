import React, { useContext, useEffect } from 'react';
import { Dimensions, StyleSheet, ScrollView, Text, PlatformColor, useColorScheme } from 'react-native';
import { Block, Input, Button, Icon } from 'galio-framework';
import theme from '../theme';
import { ListItem } from 'react-native-elements'
import GorgeousHeader from "react-native-gorgeous-header";
import WordBankContext from '../components/WordBankContext';
import { useIsFocused } from '@react-navigation/native';
import { Root, Toast } from 'popup-ui';

const { width, height } = Dimensions.get('screen');

export default function WordBank(props) {
    const [query, setQuery] = React.useState("");
    const [displayed, setDisplayed] = React.useState([]);
    const [edit, setEdit] = React.useState(false);
    const [reload, setReload] = React.useState(false);
    const [maxItems, setMaxItems] = React.useState(50);

    const { navigation } = props;

    const dark = useColorScheme() === "dark";

    const isFocused = useIsFocused();
    const context = useContext(WordBankContext);

    useEffect(() => {
        setMaxItems(50);
        copyWords();
        setReload(false);
        searchWord();
    }, [isFocused, reload])

    const copyWords = () => {
        let list = [];
        context.state.forEach((word) => {
            list.push(word);
        });

        setDisplayed(list);
    }

    const openDefinition = (value) => {
        var searchQuery = value["kanji"]

        if (value["kanji"].length == 1) {
            navigation.navigate("KanjiDefinition", { word: searchQuery });
        }
        else {
            navigation.navigate("Definition", { word: searchQuery })
        }
    }

    const searchWord = () => {
        let newQuery = query.toLowerCase();
        let newList = [];
        context.state.forEach((word) => {
            if (word.kanji.includes(newQuery) || (word.hira != null && word.hira.includes(newQuery)) || word.english.includes(newQuery)) {
                newList.push(word);
            }
        });

        setDisplayed(newList);
    }

    const listFunction = (word) => {
        if (edit) {
            context.removeValue(word["kanji"]);

            let wordsCopy = displayed;
            let index = wordsCopy.map(e => e.kanji).indexOf(word["kanji"])
            if (index != -1) {
                displayed.splice(index, 1);
            }
            setDisplayed(displayed);
            setReload(true);

            Toast.show({
                title: 'Removed word from Word Bank',
                text: 'This word was been removed from your Word Bank.',
                color: theme.COLORS.SUCCESS,
                timing: 4000
            });
        }
        else {
            openDefinition(word)
        }
    }

    return (
        <Root>
            <Block safe flex style={{ backgroundColor: PlatformColor("systemBackground") }}>
                <GorgeousHeader
                    title="Word Bank"
                    titleTextStyle={{ color: PlatformColor("label"), fontSize: 46, fontWeight: "bold" }}
                    subtitle="All your saved words"
                    subtitleTextStyle={{ color: PlatformColor("secondaryLabel") }}
                    menuImageSource={dark ? require("../../assets/menu_dark.png") : require("../../assets/hamburger_menu.png")}
                    menuImageStyle={styles.menu}
                    menuImageOnPress={() => navigation.openDrawer()}
                    searchBarStyle={{ width: 0, height: 0 }}
                    profileImageSource={require("../../assets/edit.png")}
                    profileImageStyle={{ width: 77, height: 30 }}
                    profileImageOnPress={() => { setEdit(!edit) }}
                />

                <Block style={{ padding: theme.SIZES.BASE, paddingBottom: 0, flexDirection: "row" }}>
                    <Input
                        rounded
                        placeholder="Search Word Bank..."
                        placeholderTextColor={PlatformColor("systemBlue")}
                        style={{ borderColor: PlatformColor("systemBlue"), justifyContent: 'flex-start', width: width - 160 }}
                        bgColor={PlatformColor("systemBackground")}
                        color={PlatformColor("label")}
                        onChangeText={(text) => { setQuery(text) }}
                        returnKeyType={'search'}
                        onSubmitEditing={searchWord}
                        value={query}
                        autoCapitalize='none'
                    />
                    <Button round color={dark ? "rgb(10, 132, 255)" : "rgb(0, 122, 255)"} shadowless size="small" onPress={() => { copyWords(); setQuery("") }}>Clear</Button>
                </Block>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <Block style={styles.container}>
                        <Block flex>
                            {displayed.map((word, i) => {
                                if (i < maxItems) {
                                    return (
                                        <ListItem key={i} bottomDivider onPress={() => { listFunction(word) }} containerStyle={{ backgroundColor: PlatformColor("systemBackground") }}>
                                            <ListItem.Content>
                                                <ListItem.Title style={{ fontSize: 20, color: PlatformColor("label") }}>{word["kanji"]}</ListItem.Title>
                                                <ListItem.Subtitle style={{ marginTop: 5, fontSize: 15, color: PlatformColor("label") }}>{word["english"]}</ListItem.Subtitle>
                                            </ListItem.Content>
                                            {edit ? (<Icon
                                                name="delete"
                                                family="AntDesign"
                                                size={theme.SIZES.BASE}
                                                color="#E90000"
                                            />) : (<ListItem.Chevron />)}
                                        </ListItem>
                                    )
                                }
                            })}
                            {displayed.length > 50 ? (
                                <Button
                                    round
                                    color={dark ? "rgb(10, 132, 255)" : "rgb(0, 122, 255)"}
                                    shadowless
                                    size="large"
                                    style={{ marginTop: 20 }}
                                    onPress={() => { setMaxItems(maxItems + 50) }}
                                >
                                    Load More
                                </Button>
                            ) : null}
                            <Text style={{ textAlign: 'center', marginTop: 10, color: PlatformColor("label") }}>{context.state.length} words</Text>
                        </Block>
                    </Block>
                </ScrollView>
            </Block>
        </Root>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 14,
        justifyContent: 'flex-start',
        backgroundColor: PlatformColor("systemBackground"),
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

