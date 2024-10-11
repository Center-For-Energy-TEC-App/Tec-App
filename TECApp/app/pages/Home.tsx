import {
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert
} from 'react-native'
import { WorldMap } from '../components/WorldMap'
import { BottomSheet } from '../components/BottomSheet'
import { Tutorial } from '../components/Tutorial'
import React, { useState, useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Tracker } from '../components/Tracker'
import { GlobalDashboardButton } from '../SVGs/GlobalDashboardButton'
import { router } from 'expo-router'
import { removeData } from '../util/Caching'
import { captureRef } from 'react-native-view-shot'
import * as Print from 'expo-print'
import * as FileSystem from 'expo-file-system'


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

  const slidersRef = useRef<View>(null)
  const bauRef = useRef<View>(null)
  const regionalComparisonRef = useRef<View>(null)
  const technologyComparisonRef = useRef<View>(null)

  // Helper function to pause for UI updates
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const generatePDF = async () => {
    try {
      let capturedURIs = []
      const regions = ['chn', 'nam', 'lam', 'ind', 'sea', 'mea', 'opa', 'eur', 'ssa', 'nee']


      for (const region of regions) {
        setSelectedRegion(region)  
        await delay(1000)          

        const slidersUri = await captureRef(slidersRef.current, {
          format: 'png',
          quality: 1,
          result: 'data-uri',
        })

        const bauUri = await captureRef(bauRef.current, {
          format: 'png',
          quality: 1,
          result: 'data-uri',
        })

        const regionalComparisonUri = await captureRef(regionalComparisonRef.current, {
          format: 'png',
          quality: 1,
          result: 'data-uri',
        })

        const technologyComparisonUri = await captureRef(technologyComparisonRef.current, {
          format: 'png',
          quality: 1,
          result: 'data-uri',
        })


        capturedURIs.push({
          region,
          slidersUri,
          bauUri,
          regionalComparisonUri,
          technologyComparisonUri,
        })
      }

      const htmlContent = `
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 10;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                background-color: black;
              }
              img {
                max-width: 100%;
                height: auto;
                margin-bottom: 30px;
              }
              h1 {
                color: white;
                text-align: center;
              }
            </style>
          </head>
          <body>
            ${capturedURIs
              .map(
                (data) => `
                  <h1>${data.region.toUpperCase()} Region</h1>
                  <img src="${data.slidersUri}" />
                  <img src="${data.bauUri}" />
                  <img src="${data.regionalComparisonUri}" />
                  <img src="${data.technologyComparisonUri}" />
                `
              )
              .join('')}
          </body>
        </html>
      `

    
      const { uri: pdfUri } = await Print.printToFileAsync({
        html: htmlContent,
      })


      const fileName = 'Renewable_Energy_Visualizations.pdf'
      const newFilePath = `${FileSystem.documentDirectory}${fileName}`

      await FileSystem.moveAsync({
        from: pdfUri,
        to: newFilePath,
      })

      Alert.alert(`PDF saved at: ${newFilePath}`)
    } catch (error) {
      console.error('Error generating or exporting PDF:', error)
    }
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
          slidersRef={slidersRef}
          bauRef={bauRef}
          regionalComparisonRef={regionalComparisonRef}
          technologyComparisonRef={technologyComparisonRef}
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
