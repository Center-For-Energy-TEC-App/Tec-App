import {
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { WorldMap } from '../components/WorldMap'
import { BottomSheet } from '../components/BottomSheet'
import { Tutorial } from '../components/Tutorial'
import React, { useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Tracker } from '../components/Tracker'
import { GlobalDashboardButton } from '../SVGs/GlobalDashboardButton'
import { router } from 'expo-router'
import { removeData } from '../util/Caching'

const vw = Dimensions.get('window').width
const vh = Dimensions.get('window').height

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string>('Global')
  const [totalGlobalEnergy, setTotalGlobalEnergy] = useState<number>(0)
  const [temperatureData, setTemperatureData] = useState<{
    yearAtDegree: number[]
    degreeAtYear: number[]
  }>()

  const [refreshTutorial, setRefreshTutorial] = useState<boolean>(true)
  const [tutorialState, setTutorialState] = useState<number>(0)

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region)
    setTutorialState(7)
  }

  return (
    <GestureHandlerRootView style={mobileStyles.gestureHandler}>
      <View style={mobileStyles.appWrapper}>
        <Tutorial refresh={refreshTutorial} state={tutorialState} />
        <WorldMap onSelectCountry={handleRegionSelect} />
        <BottomSheet
          selectedRegion={selectedRegion}
          passGlobalToHome={(energy) => setTotalGlobalEnergy(energy)}
          passTemperatureToHome={(temperature) =>
            setTemperatureData(temperature)
          }
        />
        <View style={mobileStyles.trackerWrapper}>
          <Tracker type="temperature" temperatureData={temperatureData} />
          <Tracker type="renewable" totalGlobalEnergy={totalGlobalEnergy} />
        </View>
        <View style={mobileStyles.dashboardButton}>
          <GlobalDashboardButton
            onPress={() => {
              router.push('/pages/GlobalDashboard')
              setTutorialState(6)
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            removeData('tutorial').then(() => {
              setTutorialState(0)
              setRefreshTutorial(!refreshTutorial)
            })
          }}
          style={mobileStyles.resetTutorial}
        >
          <Text>View Tutorial</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
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
  dashboardButton: {
    position: 'absolute',
    top: '6.5%',
    right: '5%',
    // right: 0,
  },
  resetTutorial: {
    position: 'absolute',
    top: '16%',
    left: '3%',
    backgroundColor: 'white',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
})
