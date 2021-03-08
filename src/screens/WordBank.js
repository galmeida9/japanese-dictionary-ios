import React, { useContext, useEffect } from 'react';
import { Dimensions, StyleSheet, ScrollView } from 'react-native';
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

    const { navigation } = props;
    const isFocused = useIsFocused()
    const context = useContext(WordBankContext);

    useEffect(() => {
        copyWords();
        setReload(false);
        searchWord();
    }, [isFocused, reload])

    const copyWords = () => {
        let list = [];
        context.state.japanese.forEach((word) => {
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
        context.state.japanese.forEach((word) => {
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
            <Block safe flex style={{ backgroundColor: '#fff' }}>
                <GorgeousHeader
                    title="Word Bank"
                    subtitle="All your saved words"
                    menuImageSource={require("../../assets/hamburger_menu.png")}
                    menuImageStyle={styles.menu}
                    menuImageOnPress={() => navigation.openDrawer()}
                    searchBarStyle={{ width: 0, height: 0 }}
                    profileImageSource={require("../../assets/edit.png")}
                    profileImageStyle={{width: 77, height: 30}}
                    profileImageOnPress={() => { setEdit(!edit) }}
                />

                <Block style={{ padding: theme.SIZES.BASE, paddingBottom: 0, flexDirection: "row" }}>
                    <Input
                        rounded
                        placeholder="Search Word Bank..."
                        placeholderTextColor={theme.COLORS.INFO}
                        style={{ borderColor: theme.COLORS.INFO, justifyContent: 'flex-start', width: width - 160 }}
                        onChangeText={(text) => { setQuery(text) }}
                        returnKeyType={'search'}
                        onSubmitEditing={searchWord}
                        value={query}
                    />
                    <Button round color="info" shadowless size="small" onPress={() => { copyWords(); setQuery("") }}>Clear</Button>
                </Block>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <Block style={styles.container}>
                        <Block flex>
                            {displayed.map((word, i) => {
                                return (
                                    <ListItem key={i} bottomDivider onPress={() => { listFunction(word) }}>
                                        <ListItem.Content>
                                            <ListItem.Title style={{ fontSize: 20 }}>{word["kanji"]}</ListItem.Title>
                                            <ListItem.Subtitle style={{ marginTop: 5, fontSize: 15 }}>{word["english"]}</ListItem.Subtitle>
                                        </ListItem.Content>
                                        {edit ? (<Icon
                                            name="delete"
                                            family="AntDesign"
                                            size={theme.SIZES.BASE}
                                            color="#E90000"
                                        />) : (<ListItem.Chevron />)}
                                    </ListItem>
                                )
                            })}
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

