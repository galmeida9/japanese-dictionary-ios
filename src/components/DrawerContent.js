import React from 'react';
import { View, StyleSheet, Linking, PlatformColor, useColorScheme } from 'react-native';
import {
    Title,
    Caption,
    Drawer,
    Text,
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import { Icon } from 'galio-framework';
import theme from '../theme';

export default function DrawerContent(props) {
    const dark = useColorScheme() === "dark";

    return (
        <View style={{ flex: 1, backgroundColor: dark ? "#141414" : "white" }}>
            <View style={{ marginLeft: 15 }}>
                <Title style={styles.title}>Japanese Dictionary</Title>
                <Caption style={styles.caption}>Your study companion</Caption>
            </View>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            label="Dictionary"
                            icon={() => (
                                <Icon
                                    name="language"
                                    family="font-awesome"
                                    size={theme.SIZES.BASE}
                                    color={PlatformColor("label")}
                                />
                            )}
                            onPress={() => { props.navigation.navigate('Dictionary') }}
                            labelStyle={{ color: PlatformColor("label") }}
                        />
                        <DrawerItem
                            label="Word Bank"
                            icon={() => (
                                <Icon
                                    name="database"
                                    family="font-awesome"
                                    size={theme.SIZES.BASE}
                                    color={PlatformColor("label")}
                                />
                            )}
                            onPress={() => { props.navigation.navigate('Bank') }}
                            labelStyle={{ color: PlatformColor("label") }}
                        />
                        <DrawerItem
                            label="Practice"
                            icon={() => (
                                <Icon
                                    name="pencil"
                                    family="font-awesome"
                                    size={theme.SIZES.BASE}
                                    color={PlatformColor("label")}
                                />
                            )}
                            onPress={() => { props.navigation.navigate('Practice') }}
                            labelStyle={{ color: PlatformColor("label") }}
                        />
                    </Drawer.Section>
                    <Drawer.Section>
                        <Text style={{ marginLeft: 18, marginTop: 20, color: PlatformColor("label") }}>Settings</Text>
                        <DrawerItem
                            label="Duolingo Login"
                            icon={() => (
                                <Icon
                                    name="sign-in"
                                    family="font-awesome"
                                    size={theme.SIZES.BASE}
                                    color={PlatformColor("label")}
                                />
                            )}
                            onPress={() => { props.navigation.navigate('DuolingoLogin') }}
                            labelStyle={{ color: PlatformColor("label") }}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    label="Made by Gabriel Almeida"
                    icon={() => (
                        <Icon
                            name="heart"
                            family="font-awesome"
                            size={theme.SIZES.BASE}
                            color={PlatformColor("label")}
                        />
                    )}
                    onPress={() => Linking.openURL('http://bit.ly/Gabriel-Almeida')}
                    labelStyle={{ color: PlatformColor("label"), width: 200 }}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 45,
        marginTop: 60,
        fontWeight: 'bold',
        lineHeight: 45,
        color: PlatformColor("label")
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        color: PlatformColor("secondaryLabel")
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});