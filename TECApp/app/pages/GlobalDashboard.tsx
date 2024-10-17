import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet } from 'react-native'
import {
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Tracker } from '../components/Tracker'
import { DataPoint } from '../components/DataVisualizations/BAUComparison'
import DataVisualizations from '../components/DataVisualizations/DataVisualizations'
import { GraphData, RegionData } from '../api/requests'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ExportButton } from '../SVGs/ExportButton'
import { FeedbackButton } from '../SVGs/FeedbackButton'
import { LearnMoreButton } from '../SVGs/LearnMoreButton'
import { getData } from '../util/Caching'
import { captureRef } from 'react-native-view-shot'
import * as Print from 'expo-print'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { useLocalSearchParams } from 'expo-router'


export default function GlobalDashboard() {
  const [isRendered, setIsRendered] = useState(false)
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

  const carbonBudgetRef = useRef(null)
  const bauComparisonRef = useRef(null)
  const technologyComparisonRef = useRef(null)
  const trackerRef = useRef(null)
  const { export: exportFlag } = useLocalSearchParams<{ export?: string }>()

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

  useEffect(() => {
    if (isRendered && exportFlag === 'true') {
      handleExport()
    }
  }, [isRendered, exportFlag])

  const deviceType = () => {
    const { width, height } = Dimensions.get('window')
    return Platform.OS === 'ios' && (width >= 1024 || height >= 1366)
      ? 'ipad'
      : 'iphone'
  }

  const isIpad = deviceType() === 'ipad'

  const handleExport = async () => {
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
      const trackerUri = await captureRef(trackerRef, {
        format: 'png',
        quality: 1,
      })

      const html = `
<div style="width: 100%; padding: 5px; font-family: Arial, sans-serif; text-align: center; box-sizing: border-box;">
  <!-- Flexbox container for title and logo -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h1 style="font-size: 24px;">Your Global Carbon Scenario</h1>
    <img src="TECApp/app/pages/CERLogo.png" style="height: 50px;" alt="CER Logo"/>
  </div>
<hr>
  <p style="font-size: 16px; margin-bottom: 20px; color: #1C2B47">
    The world aims to keep global warming below 2&deg; by 2030. Here's your scenario for how this can be done!
  </p>
  
  <div style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 5px; margin-bottom: 5px;">
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
    <p style="color: #266297; font-size: 14px; text-align:center; font-style: bold">Results of your changes:</p>
     <img src="${trackerUri}" style="width: 260px; height: 65px;" alt="Tracker Data"/>
     <p style="color: #266297; font-size: 14px; text-align:center; font-style: bold">Region's Renewable Energy Contribution:</p>
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
      // I'm lowkey unsure how to specifcy file paths like this, also
      // I feel like we would need some perms to actually download stuff and specify
      // the path onto the user's device?
      const filePath = `${FileSystem.documentDirectory}TECRenewableEnergyPlan.pdf`

      // Move the file to the filePath specified above
      await FileSystem.moveAsync({
        from: uri,
        to: filePath,
      })

      // In case you want to see if the file was saved / tell the user using an alert
      // console.log('PDF successfully saved to:', filePath)
      // Alert.alert(`PDF exported successfully to ${filePath}`)

      // Opens the file in a viewer / allow share option
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
      } else {
        Alert.alert("Sharing is not available on this device.");
      }

    } catch (error) {
      console.error('Failed to capture screenshot and export PDF', error)
      Alert.alert('Failed to export PDF.')
    }
  }

  return (
    <GestureHandlerRootView>
      <ScrollView
        style={styles.regionInfoContainer}
        contentContainerStyle={{ alignItems: 'flex-start' }}
        scrollEnabled={scrollEnabled}
        onLayout={() => setIsRendered(true)}
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
              <View ref={trackerRef} style={styles.trackersWrapper}>
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
                bauRef={bauComparisonRef}
                carbonRef={carbonBudgetRef}
                technologyRef={technologyComparisonRef}
              />
            </>
          )}
        <View style={styles.bottomButtons}>
          <FeedbackButton
            onPress={() => {
              alert('Feedback')
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
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 50,
  },
})
