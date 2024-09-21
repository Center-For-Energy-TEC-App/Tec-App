import { Dimensions, StyleSheet, View, Alert } from 'react-native'
import { WorldMap } from '../components/WorldMap'
import { BottomSheet } from '../components/BottomSheet'
import { WelcomePopup } from '../components/WelcomePopup'
import React, { useState, useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Tracker } from '../components/Tracker'
import { captureRef } from 'react-native-view-shot'
import { PdfExportButton } from "../SVGs/PdfExportButton"
import * as Print from 'expo-print'
import * as FileSystem from 'expo-file-system'

const vw = Dimensions.get('window').width
const vh = Dimensions.get('window').height

export const Home = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('Global')
  const [totalGlobalEnergy, setTotalGlobalEnergy] = useState<number>(0)
  const slidersRef = useRef<View>(null);
  const bauRef = useRef<View>(null);
  const regionalComparisonRef = useRef<View>(null);
  const technologyComparisonRef = useRef<View>(null);



  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region)
  }

  const handleGlobalEnergyChange = (energy: number) => {
    setTotalGlobalEnergy(energy)
  }
  const generatePDF = async () => {
    try {
        // Capture the Distribute Renewables view
        const slidersUri = await captureRef(slidersRef.current, {
          format: 'png',
          quality: 1,
          result: 'data-uri',
        });

        const bauUri = await captureRef(bauRef.current, {
          format: 'png',
          quality: 1,
          result: 'data-uri',
        });
  
        const regionalComparisonUri = await captureRef(regionalComparisonRef.current, {
          format: 'png',
          quality: 1,
          result: 'data-uri',
        });

        const technologyComparisonUri = await captureRef(technologyComparisonRef.current, {
          format: 'png',
          quality: 1,
          result: 'data-uri',
        });

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
                }
              </style>
            </head>
            <body>
            <img src="${slidersUri}" />
            <img src="${bauUri}" />
            <img src="${regionalComparisonUri}" />
            <img src="${technologyComparisonUri}" />
            </body>
          </html>
        `

        const { uri: pdfUri } = await Print.printToFileAsync({
          html: htmlContent,
        })

        const fileName = `Sliders_and_Visualizations.pdf`
        const newFilePath = `${FileSystem.documentDirectory}${fileName}`

        await FileSystem.moveAsync({
          from: pdfUri,
          to: newFilePath,
        })

        Alert.alert(`PDF saved at: ${newFilePath}`)
      } catch (error) {
        console.error('Error capturing or exporting PDF:', error)
      }
    
  }

  return (
    <View style={mobileStyles.appWrapper}>
      <GestureHandlerRootView style={mobileStyles.gestureHandler}>
        <WelcomePopup />
        <WorldMap onSelectCountry={handleRegionSelect} />
        <BottomSheet
          selectedRegion={selectedRegion}
          onSwipeDown={() => setSelectedRegion('Global')}
          passGlobalToHome={handleGlobalEnergyChange}
          slidersRef={slidersRef}
          bauRef={bauRef}
          regionalComparisonRef={regionalComparisonRef}
          technologyComparisonRef={technologyComparisonRef}
        />
        <View style={mobileStyles.trackerWrapper}>
          <Tracker type="temperature" />
          <Tracker type="renewable" totalGlobalEnergy={totalGlobalEnergy}/>
          <PdfExportButton onPress={generatePDF}></PdfExportButton>
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
