import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import GoogleIcon from './GoogleIcon';

const GoogleLoginButton = ({ onPress, loading = false, disabled = false }: any) => {
    return (
        <TouchableRipple
            onPress={loading || disabled ? undefined : onPress}
            style={[styles.button, disabled && styles.disabledButton]}
            rippleColor="rgba(0, 0, 0, .1)"
            borderless={false}
        >
            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator size="small" color="#000" />
                ) : (
                    <>
                        <GoogleIcon width={20} height={20} />
                        <Text style={styles.text}>Sign in with Google</Text>
                    </>
                )}
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
    disabledButton: {
        opacity: 0.6,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#333',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 10,
    },
});
