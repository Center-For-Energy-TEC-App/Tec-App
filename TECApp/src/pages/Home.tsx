import { Dimensions, StyleSheet, View } from 'react-native'
import { WorldMap } from '../components/WorldMap'
import RegionBottomSheet from '../components/RegionBottomSheet'
import { WelcomePopup } from '../components/WelcomePopup'
import React, { useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Tracker } from '../components/Tracker'

const vw = Dimensions.get('window').width
const vh = Dimensions.get('window').height

export const Home = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region)
  }

  return (
    <View style={mobileStyles.appWrapper}>
      <GestureHandlerRootView style={mobileStyles.gestureHandler}>
        <WelcomePopup />
        <WorldMap onSelectCountry={handleRegionSelect} />
        <RegionBottomSheet selectedRegion={selectedRegion ?? ''} />
        <View style={mobileStyles.trackerWrapper}>
          <Tracker type="temperature" />
          <Tracker type="renewable" />
        </View>
      </GestureHandlerRootView>
    </View>
  )
}

const mobileStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gestureHandler: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  appWrapper: {
    width: vw,
    height: vh,
  },

  trackerWrapper: {
    position: 'absolute',
    top: '6%',
    left: '3%',
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
  },
})
