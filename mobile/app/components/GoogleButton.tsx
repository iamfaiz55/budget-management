import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import GoogleIcon from './GoogleIcon';

const GoogleLoginButton = ({ onPress }: any) => {
    return (
        <TouchableRipple
            onPress={onPress}
            style={styles.button}
            rippleColor="rgba(0, 0, 0, .1)"
            borderless={false}
        >
            <View style={styles.content}>
                <GoogleIcon width={20} height={20} />
                <Text style={styles.text}>Sign in with Google</Text>
            </View>
        </TouchableRipple>
    );
};

export default GoogleLoginButton;

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        backgroundColor: '#f9f9f9',
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginTop: 10,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 12,
    },
    text: {
        color: '#333',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 10,
    },
});
