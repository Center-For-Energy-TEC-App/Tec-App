import { router, Stack } from 'expo-router'
import React, { Alert } from 'react-native'
import { HelpButton } from './SVGs/HelpButton'
import { BackArrow } from './SVGs/BackArrow'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const RootLayout = () => {
  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen
          name="pages/Home"
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#1C2B47',
            },
          }}
        />
        <Stack.Screen
          name="pages/GlobalDashboard"
          options={{
            headerShown: true,
            headerBackTitleVisible: false,
            headerShadowVisible: false,
            headerTitle() {
              return <></>
            },
            headerRight() {
              return (
                <HelpButton
                  onPress={() => Alert.alert('Help', 'Information here')}
                />
              )
            },
            headerLeft() {
              return <BackArrow onPress={() => router.back()} />
            },

            contentStyle: {
              backgroundColor: '#FFF',
            },
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  )
}

export default RootLayout
