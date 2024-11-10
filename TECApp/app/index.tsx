import React, { useEffect, useState } from 'react'
import { Redirect } from 'expo-router'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { checkVersion } from 'react-native-check-version'

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [loaded, error] = useFonts({
    'Brix Sans': require('../assets/fonts/BrixSans.otf'),
  })

  const [needsUpdate, setNeedsUpdate] = useState<boolean>(true)

  const checkNeedsUpdate = async () => {
    const version = await checkVersion({ bundleId: 'com.CER.Tec-App' })
    console.log(version)
    return version
  }

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }

    checkNeedsUpdate().then((version) => {
      if (version.needsUpdate) {
        alert(
          'Please update your app to the latest version in the app store!\n',
        )
        setNeedsUpdate(true)
        return null
      } else {
        setNeedsUpdate(false)
      }
    })
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  if (needsUpdate) {
    return null
  }

  return <Redirect href="/pages/Home" />
}
