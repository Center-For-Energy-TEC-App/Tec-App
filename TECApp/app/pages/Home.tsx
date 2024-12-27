import {
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native'
import { WorldMap } from '../components/WorldMap'
import { BottomSheet } from '../components/BottomSheet'
import { Tutorial } from '../components/Tutorial'
import React, { useState, useRef, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Tracker } from '../components/Tracker'
import { GlobalDashboardButton } from '../SVGs/GlobalDashboardButton'
import { router } from 'expo-router'
import { getData, removeData } from '../util/Caching'
import { ExportButton } from '../SVGs/ExportButton'
//@ts-ignore
import CERLogo from '../../assets/CERLogo.png'
import { Asset } from 'expo-asset'
import * as Clipboard from 'expo-clipboard'
import * as ScreenOrientation from 'expo-screen-orientation'

// Export PDF
import DataVisualizations from '../components/DataVisualizations/DataVisualizations'
import { captureRef } from 'react-native-view-shot'
import * as Print from 'expo-print'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { RegionData } from '../api/requests'
import { DataPoint } from '../components/DataVisualizations/ForecastComparison'
import { Host, Portal } from 'react-native-portalize'
import { TemperatureData } from '../util/Calculations'
import { Tooltip1 } from '../SVGs/TutorialPopups/Tooltip1'
import { Tooltip4 } from '../SVGs/TutorialPopups/Tooltip4'
import { Tooltip6 } from '../SVGs/TutorialPopups/Tooltip6'
import { FeedbackButton } from '../SVGs/FeedbackButton'
import { Tooltip7 } from '../SVGs/TutorialPopups/Tooltip7'

/**
 * Main page container
 */
export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string>('Global')
  const [totalGlobalEnergy, setTotalGlobalEnergy] = useState<number>(0)
  const [temperatureData, setTemperatureData] = useState<TemperatureData>()

  const [refreshTutorial, setRefreshTutorial] = useState<boolean>(true)
  const [tutorialState, setTutorialState] = useState<number>(0)

  const [initialGraphData, setInitialGraphData] = useState<RegionData>()
  const [dynamicGraphData, setDynamicGraphData] = useState<RegionData>()

  const [initialFossilData, setInitialFossilData] = useState<DataPoint[]>()
  const [dynamicFossilData, setDynamicFossilData] = useState<DataPoint[]>()
  const [isRendered, setIsRendered] = useState(false)

  const carbonBudgetRef = useRef(null)
  const bauComparisonRef = useRef(null)
  const technologyComparisonRef = useRef(null)

  useEffect(() => {
    // Fetch data initially when component loads
    fetchData()
  }, [])

  // Function to fetch all data and update state
  const fetchData = async () => {
    try {
      const bauGraphData = await getData('bau-graph-data')
      const dynamicGraphData = await getData('dynamic-graph-data')
      const bauFossilData = await getData('bau-fossil-data')
      const dynamicFossilData = await getData('dynamic-fossil-data')
      const globalEnergy = await getData('global-energy')
      const tempData = await getData('temperature-data')

      setInitialGraphData(JSON.parse(bauGraphData))
      setDynamicGraphData(JSON.parse(dynamicGraphData))
      setInitialFossilData(JSON.parse(bauFossilData))
      setDynamicFossilData(JSON.parse(dynamicFossilData))
      setTotalGlobalEnergy(Number(globalEnergy))
      setTemperatureData(JSON.parse(tempData))
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  /**
   * Large method for handling share-your-plan file export
   */
  const handleExport = async () => {
    // Re-fetch the data before exporting
    await fetchData()

    if (!isRendered) {
      Alert.alert('Layout is not yet ready for export.')
      return
    }
    try {
      const bauUri = await captureRef(bauComparisonRef, {
        format: 'png',
        quality: 0.8,
      })
      const carbonUri = await captureRef(carbonBudgetRef, {
        format: 'png',
        quality: 0.8,
      })
      const techUri = await captureRef(technologyComparisonRef, {
        format: 'png',
        quality: 0.8,
      })

      const asset = Asset.fromModule(CERLogo)

      await asset.downloadAsync()

      const logo_uri = asset.localUri || asset.uri

      const data = await FileSystem.readAsStringAsync(logo_uri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      const imageData = 'data:image/png;base64,' + data

      // Change width to 612 and height by 792
      const html = `
      <div style="width: 100%; padding: 5px; font-family: Arial, sans-serif; text-align: center; box-sizing: border-box; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h1 style="font-size: 20px;">Your Global Carbon Scenario</h1>
          <img src=${imageData} style="height: 35px;" alt="CER Logo"/>
        </div>
      <hr>
        <p style="font-size: 16px; margin-bottom: 15px; color: #1C2B47">
          The world aims to keep global warming below 2&deg; by 2030. Here's your scenario for how this can be done!
        </p>
            
        <div style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; column-gap: 5px; row-gap: 15px; margin-bottom: 5px;">
          <div style="grid-area: 1 / 1 / 2 / 2;">
            <img src="${bauUri}" style="width: 211px; height: 194px;" alt="BAU Comparison"/>
            <h3 style="font-size: 14px; text-align: center; font-style: bold; margin-bottom: 0; color:#266297">BAU Comparison</h3>
            <p style="font-size: 12px; text-align: center; margin-top: 2px;">See how your manipulated data compares to the business-as-usual (BAU) data. The BAU data represents the projected renewable capacity levels from now
            to 2030 without any interventions</p>
          </div>
          <div style="grid-area: 1 / 2 / 2 / 3;">
            <img src="${carbonUri}" style="width: 211px; height: 194px;" alt="Carbon Budget"/>
            <h3 style="font-size: 14px; text-align: center; font-style: bold; margin-bottom: 0; color:#266297">Carbon Budget</h3>
            <p style="font-size: 12px; text-align: center; margin-top: 2px;">This graph shows the resulting emissions in gigatons (GT) of your manipulated global renewables over time. The area under the curve shows the amount of emissions you’re allowed to emit before exceeding the global temperature threshold.
          </p>
          </div>
          <div style="grid-area: 2 / 1 / 3 / 2;">
            <img src="${techUri}" style="width: 183px; height: 189px;" alt="Technology Comparison"/>
            <h3 style="font-size: 14px; text-align: center; font-style: bold; margin-bottom: 0; color:#266297">Technology Comparison</h3>
            <p style="font-size: 12px; text-align: center; margin-top: 2px;">See which energy technologies were the most impactful in achieving the goal of 12 TW of Renewable Energy.</p>
          </div>
          <div style="grid-area: 2 / 2 / 3 / 3;">
          <h3 style="color: #266297; font-size: 14px; text-align:center; font-style: bold;">Results of your changes:</h3>

<div style="padding-left: 35px; display: flex; flex-direction: row; align-items: center; gap: 15px;">
  
  <div style="display: flex; flex-direction: column; align-items: center; margin-top: 10px">
    <h4 style="font-size: 14px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; width: 150px; text-align: center; margin-bottom: 0px">
      +1.5&deg;C by ${temperatureData['1.5Year']}
    </h4>
    <h4 style="font-size: 14px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; width: 150px; text-align: center; margin-top: 0px; margin-bottom: 0px">
      +1.8&deg;C by ${temperatureData['1.8Year']}
    </h4>
    <h4 style="font-size: 14px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; width: 150px; text-align: center; margin-top: 0px">
      +2.0&deg;C by ${temperatureData['2.0Year']}
    </h4>
  </div>

  <div style="display: flex; flex-direction: column; align-items: center; margin-top: 10px">
    <h4 style="font-size: 14px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; width: 150px; text-align: center; margin-bottom: 0px">
      ${(totalGlobalEnergy / 1000).toFixed(1)} TW of power by 2030
    </h4>
    <h4 style="font-size: 14px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; width: 150px; text-align: center; margin-top: 0px">
      ${((totalGlobalEnergy / 1000 / 12) * 100).toFixed(0)}% of 12 TW Goal
    </h4>
  </div>
</div>
          
           </div>

          </div>
        </div>
      </div>
      `

      // Generate PDF. URI points to location of the newly created file
      const { uri } = await Print.printToFileAsync({
        html,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      })

      // Specify a file path using documentDirectory
      const filePath = `${FileSystem.documentDirectory}TECRenewableEnergyPlan.pdf`

      // Move the file to the filePath specified above
      await FileSystem.moveAsync({
        from: uri,
        to: filePath,
      })
      // console.log('PDF successfully saved to:', filePath)

      Alert.alert(
        'PDF exported successfully!',
        'Please help us out by emailing your 2030 plan to cer.tecdeveloper@gmail.com',
        [
          {
            text: 'Copy Email',
            onPress: () => Clipboard.setString('cer.tecdeveloper@gmail.com'),
          },
          { text: 'OK' },
        ],
      )

      // Opens the file in a viewer / allow share option
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath)
      } else {
        Alert.alert('Sharing is not available on this device.')
      }
    } catch (error) {
      console.error('Failed to capture screenshot and export PDF', error)
      Alert.alert('Failed to export PDF.')
    }
  }

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region)
    if (tutorialState == 8) setTutorialState(9)
  }

  return (
    <GestureHandlerRootView style={mobileStyles.gestureHandler}>
      <Host>
        <View
          style={mobileStyles.appWrapper}
          onLayout={() => setIsRendered(true)}
        >
          <Tutorial
            refresh={refreshTutorial}
            state={tutorialState}
            sendStateHome={setTutorialState}
          />
          <WorldMap onSelectCountry={handleRegionSelect} />
          <Portal>
            <BottomSheet
              selectedRegion={selectedRegion}
              passGlobalToHome={(energy) => setTotalGlobalEnergy(energy)}
              passTemperatureToHome={(temperature) =>
                setTemperatureData(temperature)
              }
              tutorialState={tutorialState}
              setTutorialState={setTutorialState}
              onSwipeDown={() => setSelectedRegion('Global')}
            />
          </Portal>
          <View style={mobileStyles.trackerWrapper} collapsable={false}>
            <Tracker type="temperature" temperatureData={temperatureData} />
            <Tracker type="renewable" totalGlobalEnergy={totalGlobalEnergy} />
            <TouchableOpacity
              onPress={() => {
                removeData('tutorial').then(() => {
                  setTutorialState(0)
                  setSelectedRegion('Global')
                  setRefreshTutorial(!refreshTutorial)
                })
              }}
              style={mobileStyles.resetTutorial}
            >
              <Text>View Tutorial</Text>
            </TouchableOpacity>
          </View>
          <View style={mobileStyles.dashboardButton}>
            <GlobalDashboardButton
              glow={tutorialState == 5}
              onPress={() => {
                router.push('/pages/GlobalDashboard')
                setTimeout(() => {
                  if (tutorialState == 5) setTutorialState(8)
                }, 1000)
              }}
            ></GlobalDashboardButton>
            {tutorialState == 5 ? (
              <View style={{ position: 'absolute', top: 75, left: -150 }}>
                <Tooltip1 />
              </View>
            ) : (
              <></>
            )}
          </View>
          {tutorialState == 8 ? (
            <View style={{ position: 'absolute', top: '50%', left: '35%' }}>
              <Tooltip4 />
            </View>
          ) : (
            <></>
          )}
          <View style={mobileStyles.feedbackButton}>
            <FeedbackButton onPress={() => router.push('pages/Feedback')} />
          </View>
          <View style={mobileStyles.exportButton}>
            <ExportButton onPress={handleExport} />
            {tutorialState == 11 ? (
              <View
                style={{
                  position: 'absolute',
                  bottom: 50,
                  right: 17,
                }}
              >
                <Tooltip7 />
                <TouchableOpacity
                  onPress={() => setTutorialState(12)}
                  style={mobileStyles.onboardingButton}
                >
                  <Text style={mobileStyles.onboardingButtonText}>Finish</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <></>
            )}
          </View>

          {/* Data-visuzalitions component that we render entirely off-screen so we can show graphs in exported pdfs */}
          {initialGraphData &&
            dynamicGraphData &&
            initialFossilData &&
            dynamicFossilData &&
            temperatureData && (
              <View style={mobileStyles.hidden}>
                <DataVisualizations
                  initialGlobalData={initialGraphData}
                  dynamicGlobalData={dynamicGraphData}
                  initialFossilData={initialFossilData}
                  dynamicFossilData={dynamicFossilData}
                  temperatureData={temperatureData}
                  region="Global"
                  bauRef={bauComparisonRef}
                  carbonRef={carbonBudgetRef}
                  technologyRef={technologyComparisonRef}
                  isInteracting={() => {}}
                />
              </View>
            )}
        </View>
      </Host>
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
    width: '100%',
    height: '100%',
  },

  trackerWrapper: {
    position: 'absolute',
    top: '6%',
    left: '3%',
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
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
    top: 80,
    left: 2,
    backgroundColor: 'white',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  exportButton: {
    position: 'absolute',
    right: '3%',
    bottom: '3%',
  },

  feedbackButton: {
    position: 'absolute',
    left: '3%',
    bottom: '3%',
  },

  hidden: {
    position: 'absolute',
    top: -9999,
    left: -9999,
  },

  onboardingButton: {
    position: 'relative',
    top: 10,
    left: 50,
    backgroundColor: '#266297',
    borderColor: '#1C2B47',
    borderWidth: 1,
    borderRadius: 4,
    maxWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  onboardingButtonText: {
    fontFamily: 'Brix Sans',
    color: 'white',
    fontSize: 16,
  },
})
