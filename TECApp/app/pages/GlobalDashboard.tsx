import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Dimensions, Platform, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Tracker } from '../components/Tracker'
import { DataPoint } from '../components/DataVisualizations/BAUComparison'
import DataVisualizations from '../components/DataVisualizations/DataVisualizations'
import { RegionData } from '../api/requests'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { FeedbackButton } from '../SVGs/FeedbackButton'
import { LearnMoreButton } from '../SVGs/LearnMoreButton'
import { getData } from '../util/Caching'
import { router } from 'expo-router'

export default function GlobalDashboard() {
  const [initialGraphData, setInitialGraphData] = useState<RegionData>()
  const [dynamicGraphData, setDynamicGraphData] = useState<RegionData>()

  const [initialFossilData, setInitialFossilData] = useState<DataPoint[]>()
  const [dynamicFossilData, setDynamicFossilData] = useState<DataPoint[]>()

  const [globalEnergy, setGlobalEnergy] = useState<number>()
  const [temperatureData, setTemperatureData] = useState<{
    yearAtDegree: number[]
    degreeAtYear: number[]
  }>()

  const [scrollEnabled, setScrollEnabled] = useState<boolean>(true)

  useEffect(() => {
    getData('bau-graph-data').then((value) => {
      setInitialGraphData(JSON.parse(value))
    })
    getData('dynamic-graph-data').then((value) => {
      setDynamicGraphData(JSON.parse(value))
    })
    getData('bau-fossil-data').then((value) => {
      setInitialFossilData(JSON.parse(value))
    })
    getData('dynamic-fossil-data').then((value) => {
      setDynamicFossilData(JSON.parse(value))
    })
    getData('global-energy').then((value) => {
      setGlobalEnergy(Number(value))
    })
    getData('temperature-data').then((value) => {
      setTemperatureData(JSON.parse(value))
    })
  }, [])

  const deviceType = () => {
    const { width, height } = Dimensions.get('window')
    return Platform.OS === 'ios' && (width >= 1024 || height >= 1366)
      ? 'ipad'
      : 'iphone'
  }

  const isIpad = deviceType() === 'ipad'
  return (
    <GestureHandlerRootView>
      <ScrollView
        style={styles.regionInfoContainer}
        contentContainerStyle={{ alignItems: 'flex-start' }}
        scrollEnabled={scrollEnabled}
      >
        {initialGraphData &&
          dynamicGraphData &&
          initialFossilData &&
          dynamicFossilData &&
          temperatureData && (
            <>
              <Text style={styles.regionName}>Global Progress</Text>

              <Text style={[styles.body, isIpad && styles.iPadText]}>
                The world aims to keep global warming below 2°C by 2030. We can
                do this through increasing our current renewable capacity from 8
                to 12 TW.
              </Text>
              <View style={styles.trackersWrapper}>
                <Tracker
                  type="temperature"
                  dashboard
                  temperatureData={temperatureData}
                />
                <Tracker
                  type="renewable"
                  dashboard
                  totalGlobalEnergy={globalEnergy}
                />
              </View>

              <DataVisualizations
                initialGlobalData={initialGraphData}
                dynamicGlobalData={dynamicGraphData}
                initialFossilData={initialFossilData}
                dynamicFossilData={dynamicFossilData}
                temperatureData={temperatureData}
                isInteracting={(interacting) => setScrollEnabled(!interacting)}
                region="Global"
              />
            </>
          )}
        <View style={styles.bottomButtons}>
          <FeedbackButton
            onPress={() => {
              router.push('pages/Feedback')
            }}
          />
          <LearnMoreButton
            onPress={() => {
              alert('Learn More')
            }}
          />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  regionInfoContainer: {
    flex: 1,
    width: '100%',
    padding: 16,
  },
  regionName: {
    color: '#000',
    fontSize: 28,
    fontFamily: 'Brix Sans',
    fontWeight: '400',
    paddingBottom: 10,
  },

  body: {
    fontFamily: 'Roboto',
    fontSize: 14,
  },

  trackersWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    marginTop: 32,
  },

  iPadText: {
    fontSize: 18,
  },

  bottomButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 50,
  },
})
