import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
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
import { TemperatureData } from '../util/Calculations'
import { Tooltip2 } from '../SVGs/TutorialPopups/Tooltip2'
import { Tooltip3 } from '../SVGs/TutorialPopups/Tooltip3'

export default function GlobalDashboard() {
  const [initialGraphData, setInitialGraphData] = useState<RegionData>()
  const [dynamicGraphData, setDynamicGraphData] = useState<RegionData>()

  const [initialFossilData, setInitialFossilData] = useState<DataPoint[]>()
  const [dynamicFossilData, setDynamicFossilData] = useState<DataPoint[]>()

  const [globalEnergy, setGlobalEnergy] = useState<number>()
  const [temperatureData, setTemperatureData] = useState<TemperatureData>()

  const [scrollEnabled, setScrollEnabled] = useState<boolean>(true)
  const [tutorialState, setTutorialState] = useState<number>()

  useEffect(() => {
    getData('bau-graph-data').then((value) => {
      setInitialGraphData(JSON.parse(value))

      getData('dynamic-graph-data').then((value) => {
        setDynamicGraphData(JSON.parse(value))

        getData('bau-fossil-data').then((value) => {
          setInitialFossilData(JSON.parse(value))

          getData('dynamic-fossil-data').then((value) => {
            setDynamicFossilData(JSON.parse(value))

            getData('global-energy').then((value) => {
              setGlobalEnergy(Number(value))

              getData('temperature-data').then((value) => {
                setTemperatureData(JSON.parse(value))

                getData('tutorial').then((value) => {
                  if (value === 'complete') {
                    setTutorialState(11)
                  } else {
                    setTutorialState(6)
                  }
                })
              })
            })
          })
        })
      })
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
        {temperatureData && (
          <>
            <Text style={styles.regionName}>Global Progress</Text>

            <Text style={[styles.body, isIpad && styles.iPadText]}>
              The world aims to keep global warming below 2°C by 2030. We can do
              this through increasing our current renewable capacity from 8 to
              12 TW.
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
              {tutorialState == 6 && (
                <View style={{ position: 'absolute', top: 90, left: 20 }}>
                  <Tooltip2 />
                  <View style={styles.onBoardingButtonWrapper}>
                    <TouchableOpacity
                      onPress={() => setTutorialState(7)}
                      style={styles.onboardingButton}
                    >
                      <Text style={styles.onboardingButtonText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {tutorialState == 7 && (
                <View style={{ position: 'absolute', top: 90, right: -10 }}>
                  <Tooltip3 />
                  <View style={styles.onBoardingButtonWrapper}>
                    <TouchableOpacity
                      onPress={() => setTutorialState(6)}
                      style={styles.onboardingButton}
                    >
                      <Text style={styles.onboardingButtonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setTutorialState(11)}
                      style={styles.onboardingButton}
                    >
                      <Text style={styles.onboardingButtonText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
            {tutorialState == 11 && (
              <>
                <DataVisualizations
                  initialGlobalData={initialGraphData}
                  dynamicGlobalData={dynamicGraphData}
                  initialFossilData={initialFossilData}
                  dynamicFossilData={dynamicFossilData}
                  temperatureData={temperatureData}
                  isInteracting={(interacting) =>
                    setScrollEnabled(!interacting)
                  }
                  region="Global"
                />

                <View style={styles.bottomButtons}>
                  <FeedbackButton
                    onPress={() => {
                      router.push('pages/Feedback')
                    }}
                  />
                  <LearnMoreButton
                    onPress={() => {
                      router.push('pages/LearnMore')
                    }}
                  />
                </View>
              </>
            )}
          </>
        )}
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
    zIndex: 1,
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

  onBoardingButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // backgroundColor: 'red',
    width: 240,
  },

  onboardingButton: {
    backgroundColor: '#266297',
    borderColor: '#1C2B47',
    borderWidth: 1,
    borderRadius: 4,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },

  onboardingButtonText: {
    fontFamily: 'Brix Sans',
    color: 'white',
    fontSize: 16,
  },
})
