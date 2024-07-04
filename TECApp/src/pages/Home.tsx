import { Dimensions, StyleSheet, View } from 'react-native'
import { WorldMap } from '../components/WorldMap'
import { WelcomePopup } from '../components/WelcomePopup'
import React from 'react'
import { Tracker } from '../components/Tracker'

const vw = Dimensions.get('window').width
const vh = Dimensions.get('window').height

export const Home = () => {
  return (
    <View style={mobileStyles.appWrapper}>
      <WelcomePopup />
      <WorldMap />
      <View style={mobileStyles.trackerWrapper}>
        <Tracker type="temperature" />
        <Tracker type="renewable" />
      </View>
    </View>
  )
}

const mobileStyles = StyleSheet.create({
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
