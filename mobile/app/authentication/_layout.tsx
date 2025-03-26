import { Stack } from 'expo-router';

export default function HomeLayout() {
    return (
        <Stack
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" />
            <Stack.Screen name="Splash" />
            <Stack.Screen name="Register" />
        </Stack>
    );
}
