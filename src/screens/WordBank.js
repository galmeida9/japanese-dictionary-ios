import React from 'react';
import { Dimensions, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Text, Block, Input } from 'galio-framework';
import theme from '../theme';
import { ListItem } from 'react-native-elements'
import Spinner from 'react-native-loading-spinner-overlay';
import GorgeousHeader from "react-native-gorgeous-header";

const { width, height } = Dimensions.get('screen');

export default function WordBank(props) {
    const { navigation } = props;

    return (
        <Block safe flex style={{ backgroundColor: '#fff' }}>
            <GorgeousHeader
                title="Word Bank"
                subtitle="All your saved words"
                menuImageSource={require("../../assets/hamburger_menu.png")}
                menuImageStyle={styles.menu}
                menuImageOnPress={() => navigation.openDrawer()}
                searchBarStyle={{ width: 0, height: 0 }}
            />

            <Block style={{ padding: theme.SIZES.BASE, paddingBottom: 0, }}>
                <Input
                    rounded
                    placeholder="Search Word Bank..."
                    placeholderTextColor={theme.COLORS.INFO}
                    style={{ borderColor: theme.COLORS.INFO }}
                    onChangeText={(text) => {  }}
                    returnKeyType={'search'}
                    onSubmitEditing={console.log()}
                />
            </Block>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Block style={styles.container}>
                    <Block flex>
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

