import React from 'react';
import {
    Dimensions, StyleSheet, ScrollView, Platform, TouchableOpacity
} from 'react-native';
import { Text, Block, Button, NavBar, Input, Icon } from 'galio-framework';
import theme from '../theme';
import { ListItem } from 'react-native-elements'

const { width, height } = Dimensions.get('screen');

export default function Search(props) {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState({});

    const { navigation } = props;

    const JishoApi = require('unofficial-jisho-api');
    const jisho = new JishoApi();

    const searchDict = () => {
        console.log(query)
        jisho.searchForPhrase(query.toLowerCase()).then((data) => {
            console.log(data)
            setResults(data);
        });
    }

    return (
        <Block safe flex style={{ backgroundColor: '#fff' }}>
            <NavBar
                title="Japanese Dictionary"
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

            <Block style={{ padding: theme.SIZES.BASE, paddingTop: 0, paddingBottom: 0,}}>
                <Input
                    rounded
                    placeholder="Search Dictionary..."
                    placeholderTextColor={theme.COLORS.INFO}
                    style={{ borderColor: theme.COLORS.INFO }}
                    onChangeText={(text) => { setQuery(text); console.log(text) }}
                    returnKeyType={'search'}
                    onSubmitEditing={searchDict}
                />
            </Block>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Block style={styles.container}>
                    <Block flex>
                        {JSON.stringify(results) == "{}" ? (
                            <Text style={styles.searchMsg}>Search something in the search bar :)</Text>
                        ) : (
                                results["data"].map((value, i) => (
                                    <ListItem key={i} bottomDivider onPress={() => { navigation.navigate("Definition", { word: value["slug"].replace("-1", "") }) }}>
                                        <ListItem.Content>
                                            <ListItem.Title style={{ fontSize: 20 }}>{value["slug"].replace("-1", "")}</ListItem.Title>
                                            <ListItem.Subtitle style={{ marginTop: 5, fontSize: 15 }}>{value["japanese"][0]["reading"]}</ListItem.Subtitle>
                                        </ListItem.Content>
                                        <ListItem.Chevron />
                                    </ListItem>
                                ))
                            )}
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
        marginTop: height / 4
    }
});

