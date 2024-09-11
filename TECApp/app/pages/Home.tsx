import { Dimensions, StyleSheet, View } from 'react-native'
import { WorldMap } from '../components/WorldMap'
import { BottomSheet } from '../components/BottomSheet'
import { WelcomePopup } from '../components/WelcomePopup'
import React, { useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Tracker } from '../components/Tracker'
import { GlobalDashboardButton } from '../SVGs/GlobalDashboardButton'
import {router} from "expo-router"

const vw = Dimensions.get('window').width
const vh = Dimensions.get('window').height

export default function Home () {
  const [selectedRegion, setSelectedRegion] = useState<string>('Global')
  const [totalGlobalEnergy, setTotalGlobalEnergy] = useState<number>(0)

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region)
  }

  const handleGlobalEnergyChange = (energy: number) => {
    setTotalGlobalEnergy(energy)
  }

  return (
    <View style={mobileStyles.appWrapper}>
      <GestureHandlerRootView style={mobileStyles.gestureHandler}>
        <WelcomePopup />
        <WorldMap onSelectCountry={handleRegionSelect} />
        <BottomSheet
          selectedRegion={selectedRegion}
          passGlobalToHome={handleGlobalEnergyChange}
        />
        <View style={mobileStyles.trackerWrapper}>
          <Tracker type="temperature" />
          <Tracker type="renewable" totalGlobalEnergy={totalGlobalEnergy} />
        </View>
        <View style={mobileStyles.dashboardButton}>
        <GlobalDashboardButton onPress={()=>router.push('/pages/GlobalDashboard')}/>
        {/* <GlobalDashboardButtonV2 /> */}
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
    alignItems: 'center',
    gap: 15,
  },
  dashboardButton:{
    position: 'absolute',
    top: '6.5%',
    right: "5%",
    // right: 0,
  }
})