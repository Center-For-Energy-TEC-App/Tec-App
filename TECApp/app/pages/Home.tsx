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
import { removeData } from '../util/Caching'
import { ExportButton } from '../SVGs/ExportButton'
import { captureRef } from 'react-native-view-shot'
import * as Print from 'expo-print'
import * as FileSystem from 'expo-file-system'
import { Host, Portal } from 'react-native-portalize'
import { TemperatureData } from '../util/Calculations'
import { Tooltip1 } from '../SVGs/TutorialPopups/Tooltip1'
import { Tooltip4 } from '../SVGs/TutorialPopups/Tooltip4'
import { Tooltip6 } from '../SVGs/TutorialPopups/Tooltip6'

const vw = Dimensions.get('window').width
const vh = Dimensions.get('window').height

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string>('Global')
  const [totalGlobalEnergy, setTotalGlobalEnergy] = useState<number>(0)
  const [temperatureData, setTemperatureData] = useState<TemperatureData>()

  const [refreshTutorial, setRefreshTutorial] = useState<boolean>(true)
  const [tutorialState, setTutorialState] = useState<number>()

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region)
    if (tutorialState == 8) setTutorialState(9)
  }

  const slidersRef = useRef<View>(null)
  const bauRef = useRef<View>(null)
  const regionalComparisonRef = useRef<View>(null)
  const technologyComparisonRef = useRef<View>(null)

  // Helper function to pause for UI updates
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const generatePDF = async () => {
    try {
      let capturedURIs = []
      const regions = [
        'chn',
        'nam',
        'lam',
        'ind',
        'sea',
        'mea',
        'opa',
        'eur',
        'ssa',
        'nee',
      ]

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

        const regionalComparisonUri = await captureRef(
          regionalComparisonRef.current,
          {
            format: 'png',
            quality: 1,
            result: 'data-uri',
          },
        )

        const technologyComparisonUri = await captureRef(
          technologyComparisonRef.current,
          {
            format: 'png',
            quality: 1,
            result: 'data-uri',
          },
        )

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
                `,
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
      <Host>
        <View style={mobileStyles.appWrapper}>
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
              slidersRef={slidersRef}
              bauRef={bauRef}
              regionalComparisonRef={regionalComparisonRef}
              technologyComparisonRef={technologyComparisonRef}
            />
          </Portal>
          <View style={mobileStyles.trackerWrapper}>
            <Tracker type="temperature" temperatureData={temperatureData} />
            <Tracker type="renewable" totalGlobalEnergy={totalGlobalEnergy} />
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
            {tutorialState == 5 && (
              <View style={{ position: 'absolute', top: 75, left: -150 }}>
                <Tooltip1 />
              </View>
            )}
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
          {tutorialState == 8 && (
            <View style={{ position: 'absolute', top: vh * 0.5 }}>
              <Tooltip4 />
            </View>
          )}
          {tutorialState == 10 && (
            <View
              style={{ position: 'absolute', bottom: vh * 0.03 + 65, right: 0 }}
            >
              <Tooltip6 />
              <TouchableOpacity
                onPress={() => setTutorialState(11)}
                style={mobileStyles.onboardingButton}
              >
                <Text style={mobileStyles.onboardingButtonText}>Finish</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={mobileStyles.exportButton}>
            <ExportButton onPress={() => alert('export')} />
          </View>
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
    top: vh * 0.07 + 75,
    left: '3%',
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
  onboardingButton: {
    position: 'relative',
    top: 10,
    left: 50,
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
