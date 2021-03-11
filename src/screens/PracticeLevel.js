import React, { useContext, useEffect } from 'react';
import { Dimensions, StyleSheet, ScrollView, Text, PlatformColor, useColorScheme } from 'react-native';
import { Block } from 'galio-framework';
import { ListItem } from 'react-native-elements'
import GorgeousHeader from "react-native-gorgeous-header";
import WordBankContext from '../components/WordBankContext';
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');

export default function PracticeLevel(props) {
    const { navigation } = props;
    const context = useContext(WordBankContext);
    const isFocused = useIsFocused();

    const dark = useColorScheme() === "dark";

    const level = [10, 15, 20, 25, 30, 35, 40, 45, 50];

    useEffect(() => {
        // Force Component to reload to get the latest context info
    }, [isFocused])

    return (
        <Block safe flex style={{ backgroundColor: PlatformColor("systemBackground") }}>
            <GorgeousHeader
                title="Practice"
                titleTextStyle={{ color: PlatformColor("label"), fontSize: 46, fontWeight: "bold" }}
                subtitle="Choose the number of words to train"
                subtitleTextStyle={{ color: PlatformColor("secondaryLabel")}}
                menuImageSource={dark ? require("../../assets/menu_dark.png") : require("../../assets/hamburger_menu.png")}
                menuImageStyle={styles.menu}
                menuImageOnPress={() => navigation.openDrawer()}
                searchBarStyle={{ width: 0, height: 0 }}
            />

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Block style={styles.container}>
                    <Block flex>
                        {level.map((value, i) => {
                            if (context.state.length > value) {
                                return (
                                    <ListItem key={i} bottomDivider onPress={() => { navigation.navigate("PracticeScreen", { level: value }) }}>
                                        <ListItem.Content>
                                            <ListItem.Title style={{ fontSize: 20 }}>{value}</ListItem.Title>
                                            <ListItem.Subtitle style={{ marginTop: 5, fontSize: 15 }}>Practice {value} words</ListItem.Subtitle>
                                        </ListItem.Content>
                                        <ListItem.Chevron />
                                    </ListItem>
                                );
                            }
                        })}
                        {context.state.length == 0 ? (
                            <Text style={styles.noWords}>Add words to your Word Bank to start practicing</Text>
                        ) : null}
                        {context.state.length < level[0] && context.state.length > 0 ? (
                            <ListItem
                                key={0}
                                bottomDivider
                                onPress={() => { navigation.navigate("PracticeScreen", { level: context.state.length }) }}
                                containerStyle={{ backgroundColor: PlatformColor("systemBackground") }}
                            >
                                <ListItem.Content>
                                    <ListItem.Title style={{ fontSize: 20, color: PlatformColor("label") }}>{context.state.length}</ListItem.Title>
                                    <ListItem.Subtitle style={{ marginTop: 5, fontSize: 15, color: PlatformColor("label") }}>Practice {context.state.length} words</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                        ) : null}
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
    menu: {
        height: 40,
        width: 30
    },
    noWords: {
        textAlign: 'center',
        marginTop: height / 4,
        color: PlatformColor("label")
    },
});

