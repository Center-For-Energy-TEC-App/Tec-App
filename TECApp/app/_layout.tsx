import { Stack } from "expo-router"

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="pages/Home"
            options={{
                headerShown: false,
                contentStyle:{
                    backgroundColor: "#1C2B47"
                }
            }}
            />
        </Stack>
    )
}

export default RootLayout