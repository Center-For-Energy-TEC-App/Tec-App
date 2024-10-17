import { router, Stack } from 'expo-router'
import React, { Alert, Platform, Pressable, Text } from 'react-native'
import { HelpButton } from './SVGs/HelpButton'
import { BackArrow } from './SVGs/BackArrow'
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler'

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
            headerBackVisible: false,
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
        <Stack.Screen
          name="pages/Feedback"
          options={{
            headerShown: true,
            headerBackVisible: false,
            headerBackTitleVisible: false,
            headerShadowVisible: false,
            headerTitle() {
              return <></>
            },
            headerLeft() {
              return <BackArrow onPress={() => router.back()} />
            },
            contentStyle: {
              backgroundColor: '#FFF',
            },
          }}
        />
        <Stack.Screen
          name="pages/LearnMore"
          options={{
            headerShown: true,
            headerBackVisible: false,
            headerBackTitleVisible: false,
            headerShadowVisible: false,
            headerTitle() {
              return <></>
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
