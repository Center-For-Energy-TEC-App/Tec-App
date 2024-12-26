import React, { useEffect, useState } from 'react'
import { Redirect } from 'expo-router'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { checkVersion } from 'react-native-check-version'
import {Alert, Linking, Platform} from "react-native"
import * as ScreenOrientation from "expo-screen-orientation"

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [loaded, error] = useFonts({
    'Brix Sans': require('../assets/fonts/BrixSans.otf'),
  })

  const checkNeedsUpdate = async () => {
    const version = await checkVersion({ bundleId: 'com.CER.Tec-App', currentVersion: "1.0.2"})
    return version
  }

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }

    if(Platform.OS==="ios"){
      checkNeedsUpdate().then((version) => {
        if (version.needsUpdate) {
          Alert.alert("New Update Available",
            'Please update your app to the latest available version in the app store!\n',
            [{text: "Update", onPress: ()=>Linking.openURL("https://apps.apple.com/us/app/triton-energy-climate/id6737405522")}]
          )
          return null
      }
    })
  }}, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  return <Redirect href="/pages/Home" />
}
