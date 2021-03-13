import React from 'react';
import { Dimensions, StyleSheet, ScrollView, PlatformColor, useColorScheme, Linking } from 'react-native';
import { Block } from 'galio-framework';
import { ListItem } from 'react-native-elements'
import GorgeousHeader from "react-native-gorgeous-header";

const { width } = Dimensions.get('screen');

export default function StudyMaterial(props) {
    const { navigation } = props;

    const dark = useColorScheme() === "dark";

    const materials = [
        {
            title: "Hiragana Chart",
            subtitle: "Chart to help you memorize Hiragana"
        },
        {
            title: "Katakana Chart",
            subtitle: "Chart to help you memorize Katakana"
        },
        {
            title: "Genki Lessons",
            subtitle: "ToKini Andy's Youtube lessons"
        },
        {
            title: "Tae Kims Guide",
            subtitle: "Grammar guide with tutorials and examples"
        }
    ]

    return (
        <Block safe flex style={{ backgroundColor: PlatformColor("systemBackground") }}>
            <GorgeousHeader
                title="Study Material"
                titleTextStyle={{ color: PlatformColor("label"), fontSize: 46, fontWeight: "bold" }}
                subtitle="Material to help you study Japanese"
                subtitleTextStyle={{ color: PlatformColor("secondaryLabel") }}
                menuImageSource={dark ? require("../../assets/menu_dark.png") : require("../../assets/hamburger_menu.png")}
                menuImageStyle={styles.menu}
                menuImageOnPress={() => navigation.openDrawer()}
                searchBarStyle={{ width: 0, height: 0 }}
            />

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Block style={styles.container}>
                    <Block flex>
                        {materials.map((value, i) => {
                            return (
                                <ListItem
                                    key={i}
                                    bottomDivider
                                    onPress={() => { 
                                        switch (i) {
                                            case 0:
                                            case 1:
                                                navigation.navigate("Charts", {content: value.title.split(" ")[0]});
                                                break;
                                            case 2:
                                                Linking.openURL('https://www.youtube.com/playlist?list=PLA_RcUI8km1NMhiEebcbqdlcHv_2ngbO2');
                                                break;
                                            case 3:
                                                Linking.openURL('http://www.guidetojapanese.org/learn/');
                                        }
                                    }}
                                    containerStyle={{ backgroundColor: PlatformColor("systemBackground") }}
                                >
                                    <ListItem.Content>
                                        <ListItem.Title style={{ fontSize: 20, color: PlatformColor("label") }}>{value.title}</ListItem.Title>
                                        <ListItem.Subtitle style={{ marginTop: 5, fontSize: 15, color: PlatformColor("secondaryLabel") }}>{value.subtitle}</ListItem.Subtitle>
                                    </ListItem.Content>
                                    <ListItem.Chevron />
                                </ListItem>
                            );
                        })}
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
});

