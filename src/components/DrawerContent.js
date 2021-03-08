import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import {
    useTheme,
    Title,
    Caption,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import { Icon } from 'galio-framework';
import theme from '../theme';

export default function DrawerContent(props) {

    const paperTheme = useTheme();

    return (
        <View style={{ flex: 1 }}>
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
                                    color={theme.COLORS.ICON}
                                />
                            )}
                            onPress={() => { props.navigation.navigate('Dictionary') }}
                        />
                        <DrawerItem
                            label="Word Bank"
                            icon={() => (
                                <Icon
                                    name="database"
                                    family="font-awesome"
                                    size={theme.SIZES.BASE}
                                    color={theme.COLORS.ICON}
                                />
                            )}
                            onPress={() => {  }}
                        />
                        <DrawerItem
                            label="Practice"
                            icon={() => (
                                <Icon
                                    name="pencil"
                                    family="font-awesome"
                                    size={theme.SIZES.BASE}
                                    color={theme.COLORS.ICON}
                                />
                            )}
                            onPress={() => {  }}
                        />
                    </Drawer.Section>
                    <Drawer.Section title="Settings">
                        <TouchableRipple>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View>
                                    <Switch value={paperTheme.dark} />
                                </View>
                            </View>
                        </TouchableRipple>
                        <DrawerItem
                            label="Duolingo Login"
                            icon={() => (
                                <Icon
                                    name="sign-in"
                                    family="font-awesome"
                                    size={theme.SIZES.BASE}
                                    color={theme.COLORS.ICON}
                                />
                            )}
                            onPress={() => {  }}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    label="Made by Gabriel Almeida"
                    icon={() => (
                        <Icon
                            name="copyright"
                            family="font-awesome"
                            size={theme.SIZES.BASE}
                            color={theme.COLORS.ICON}
                        />
                    )}
                    onPress={() => Linking.openURL('http://bit.ly/Gabriel-Almeida')}
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
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
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