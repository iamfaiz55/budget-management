import { useEffect, useState } from "react";
import { Image, StyleSheet, View, Animated } from "react-native";
import { TextInput, Text, Button } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { useSignInMutation } from "@/redux/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
    const router = useRouter();
    const [signIn, { isLoading, isSuccess, isError, error }] = useSignInMutation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const fadeAnim = useState(new Animated.Value(0))[0]; // Animation effect

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem("authToken");
            if (token) router.replace("/");
        };
        checkAuth();
    }, []);

    useEffect(() => {
        if (isSuccess) {
            console.log("Login successful");
            router.replace("/");
        }
        if(isError){
            console.log("isError", error);
            
        }

    }, [isSuccess, isError]);

    const handleLogin =  () => {
        try {
             signIn({ email, password })
        } catch (err) {
            console.error(err);
        }
    };
    

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                <Image
                    style={styles.logo}
                    source={{ uri: "https://cdn-icons-png.flaticon.com/512/2331/2331949.png" }} // Budget-related icon
                />
            </Animated.View>

            <Text style={styles.title}>Welcome Back! Manage Your Finances Easily</Text>

            <Animated.View style={[styles.form, { opacity: fadeAnim }]}>
                <TextInput
                    mode="outlined"
                    label="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="email" />}
                    style={styles.input}
                />
                <TextInput
                    mode="outlined"
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    left={<TextInput.Icon icon="lock" />}
                    style={styles.input}
                />

                <Text style={styles.forgotPassword}>Forgot Password?</Text>

                <Button
                    mode="contained"
                    loading={isLoading}
                    onPress={handleLogin}
                    disabled={isLoading}
                    style={styles.button}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </Button>

                <Link href={"/authentication/Register"} style={styles.haveAnAccount}>
                    Create Account
                </Link>

                {/* <Link href={"/screens/Expenses"} style={styles.trackExpenses}>
                    Track Your Expenses
                </Link> */}
            </Animated.View>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#E3F2FD", // Light Green Finance Theme
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#1976D2", // Dark Green for Finance Theme
    },
    form: {
        backgroundColor: "white",
        padding: 25,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        transform: [{ translateY: 10 }],
    },
    input: {
        backgroundColor: "white",
        marginBottom: 10,
        borderRadius: 10,
    },
    forgotPassword: {
        textAlign: "right",
        color: "#42A5F5", 
        marginVertical: 5,
    },
    haveAnAccount: {
        textAlign: "center",
        color: "#42A5F5",
        marginVertical: 5,
    },
    trackExpenses: {
        textAlign: "center",
        color: "#42A5F5", 
        marginVertical: 5,
    },
    button: {
        marginTop: 10,
        backgroundColor: "#42A5F5",
        borderRadius: 10,
        paddingVertical: 8,
    },
});
