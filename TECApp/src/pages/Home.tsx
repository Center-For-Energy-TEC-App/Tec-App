import { WorldMap } from '../components/WorldMap'
import CountryBottomSheet from '../components/CountryBottomSheet'
import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export const Home = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
  }
  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
    <View style={styles.container}>
      <WorldMap onSelectCountry={handleCountrySelect} />
      <CountryBottomSheet selectedCountry={selectedCountry ?? ''} />
    </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gestureHandler: {
    flex: 1,
    justifyContent: 'flex-end',
  },
})
