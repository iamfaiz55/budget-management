import { Stack } from 'expo-router';
import { Provider } from 'react-native-paper';
import BottomNavigation from '../components/BottomTabs';

export default function HomeLayout() {
    return (
        <Stack
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" />
            <Stack.Screen name="Account" />

            <Stack.Screen name="AddTransaction" />
            {/* <Stack.Screen name="Day" /> */}
            
        </Stack>
    );
}
