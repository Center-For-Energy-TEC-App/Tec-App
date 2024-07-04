import { Dimensions, StyleSheet, View } from 'react-native'
import { WorldMap } from '../components/WorldMap'
import { WelcomePopup } from '../components/WelcomePopup'
import React from 'react'

const vw = Dimensions.get('window').width
const vh = Dimensions.get('window').height

export const Home = () => {
  return (
    <View style={mobileStyles.appWrapper}>
      <WelcomePopup />
      <WorldMap />
    </View>
  )
}

const mobileStyles = StyleSheet.create({
  appWrapper: {
    width: vw,
    height: vh,
  },
})
