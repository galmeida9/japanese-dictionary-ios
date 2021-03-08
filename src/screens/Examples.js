import React from 'react';
import { Dimensions, StyleSheet, ScrollView, Text } from 'react-native';
import { Block } from 'galio-framework';
import theme from '../theme';
import GorgeousHeader from "react-native-gorgeous-header";
import { Card, Title, Paragraph } from 'react-native-paper';

const { width, height } = Dimensions.get('screen');

export default function Examples(props) {
    const { navigation, route } = props;

    const makeExtraExampleCard = (value, index) => {
        return (
            <Card style={styles.card} key={index}>
                <Card.Content>
                    <Title style={{ fontSize: 25, textAlign: 'center' }}>{value.english}</Title>
                    <Paragraph style={{ fontSize: 20, textAlign: 'center', marginTop: 10 }}>Kanji: {value.kanji}</Paragraph>
                    <Paragraph style={{ fontSize: 20, textAlign: 'center', marginTop: 10 }}>Kana: {value.kana}</Paragraph>
                </Card.Content>
            </Card>
        );
    }

    return (
        <Block safe flex style={{ backgroundColor: '#fff' }}>
            <GorgeousHeader
                title="Examples"
                subtitle="User case examples of the searched word"
                menuImageSource={require("../../assets/back.png")}
                menuImageStyle={styles.back}
                menuImageOnPress={() => navigation.goBack()}
                searchBarStyle={{ width: 0, height: 0 }}
                subtitleTextStyle={{ paddingBottom: 10 }}
            />

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Block style={styles.container}>
                    {route.params.examples.length > 0 ? (
                        route.params.examples.map((value, index) => {
                            return (makeExtraExampleCard(value, index));
                        })
                    ) : (<Text style={styles.noResults}>No Examples Found</Text>)}
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
    noResults: {
        textAlign: 'center',
        marginTop: height / 4,
        fontSize: 20
    },
    back: {
        height: 30,
        width: 30,
    }
});

