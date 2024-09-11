import React, { useMemo, useEffect, useRef, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import BottomSheetTemplate from '@gorhom/bottom-sheet'
import { RegionalDashboard } from './RegionalDashboard'
import {
  GraphData,
  RegionalMinMaxValues,
  RegionalValues,
  CalculationData,
  getDefaultValues,
  getInitialGraphData,
  getMinMaxValues,
  getRegionCalculationData,
} from '../api/requests'
import { getAbbrv, getEnergyAbbrv } from '../util/ValueDictionaries'
import {
  calculateCarbonCurve,
  calculateCarbonReductions,
  calculateEnergyCurve,
  calculateNewGlobalOnReset,
} from '../util/Calculations'
import { DataPoint } from './DataVisualizations/BAUComparison'
import AsyncStorage from '@react-native-async-storage/async-storage';


export interface BottomSheetProps {
  selectedRegion: string
  passGlobalToHome: (energy: number) => void
}

export type FossilReductionData = {
  chn: number
  nam: number
  lam: number
  ind: number
  sea: number
  mea: number
  opa: number
  eur: number
  ssa: number
  nee: number
}

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

/**
 * Contains all sliders, graphs, etc data and functionality relevant to the app Bottom Sheet
 */
export const BottomSheet = ({
  selectedRegion,
  passGlobalToHome,
}: BottomSheetProps) => {
  const snapPoints = useMemo(() => ['12.5%', '25%', '50%', '80%'], [])
  const bottomSheetRef = useRef<BottomSheetTemplate>(null)

  //see api/requests.ts for specific info on structure of data objects
  const [initialSliderValues, setInitialSliderValues] =
    useState<RegionalValues>() //default slider values for every region
  const [dynamicSliderValues, setDynamicSliderValues] =
    useState<RegionalValues>() //storage of user changes to sliders
  const [minMaxValues, setMinMaxValues] = useState<RegionalMinMaxValues>() //min-max values for every slider

  const [initialGraphData, setInitialGraphData] = useState<GraphData>() //default graph data
  const [dynamicGraphData, setDynamicGraphData] = useState<GraphData>() //graph data based on user changes to sliders

  const [dynamicFossilData, setDynamicFossilData] = useState<DataPoint[]>() //carbon budget graph data based on user changes to sliders
  const [fossilReductionData, setFossilReductionData] =
    useState<FossilReductionData>() //carbon reduction data (to be applied to fossil data above)

  const [calculationData, setCalculationData] =
    useState<CalculationData>() //storage of all necessary calculation data for the current region

  const calculateTotalGlobalEnergy = (sliderValues: RegionalValues) => {
    let totalEnergy = 0

    for (const region of regions) {
      const values = sliderValues[region][2]
      const regionEnergy =
        values.solar_gw +
        values.wind_gw +
        values.hydro_gw +
        values.bio_gw +
        values.geo_gw +
        values.nuclear_gw

      totalEnergy += regionEnergy
    }

    return totalEnergy
  }

  const storeData = async (key: string, value: string) => {
    try{
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      console.log(e)
    }
  }

  const initializeFossilData = () => {
    let initialFossilData = []
    initialFossilData.push({year: 2025, value: 33.3})
    initialFossilData.push({year: 2030, value: 31.6})
    for(let i = 2035; i<=2060; i+=5){
      initialFossilData.push({year: i, value: 0})
    }
    initialFossilData = calculateCarbonCurve(0, initialFossilData)
    setDynamicFossilData(initialFossilData)
    storeData("bau-fossil-data", JSON.stringify(initialFossilData))
    storeData("dynamic-fossil-data", JSON.stringify(initialFossilData))

    const initialFossilReductionData = {} as FossilReductionData
    for (const region of regions) {
      initialFossilReductionData[region] = 0
    }
    setFossilReductionData(initialFossilReductionData)
  }

  //pull all initial data
  useEffect(() => {
    getDefaultValues()
      .then((val) => {
        setInitialSliderValues(val)
        setDynamicSliderValues(val)

        const globalEnergy = calculateTotalGlobalEnergy(val)
        passGlobalToHome(globalEnergy)
        storeData("global-energy", globalEnergy.toString())
      })
      .catch((error) => {
        console.error('Error fetching default values:', error)
      })

    getMinMaxValues()
      .then((val) => {
        setMinMaxValues(val)
      })
      .catch(console.error)
    getInitialGraphData()
      .then((val) => {
        setInitialGraphData(val)
        setDynamicGraphData(val)

        storeData("bau-graph-data", JSON.stringify(val.global))
        storeData("dynamic-graph-data", JSON.stringify(val.global))

      })
      .catch(console.error)

    initializeFossilData()
  }, [])

  //update regional calculation data on region select
  useEffect(() => {
    getRegionCalculationData(getAbbrv(selectedRegion))
      .then((val) => {
        setCalculationData(val)
      })
      .catch(console.error)
    
      if(selectedRegion!=="Global"){
        bottomSheetRef.current?.snapToIndex(2) // Snap to 25% when a region is selected
      }else{
        bottomSheetRef.current?.close()
      }
  }, [selectedRegion])

  return (
    <BottomSheetTemplate
      index={-1}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
    >
      {dynamicSliderValues && selectedRegion!=="Global" && ( //don't render regional sheet until slider values load
        <View style={styles.contentContainer}>
            <RegionalDashboard
              minMaxValues={minMaxValues[getAbbrv(selectedRegion)]}
              sliderValues={dynamicSliderValues[getAbbrv(selectedRegion)]}
              currRegion={selectedRegion}
              onSliderChange={(val, technologyChanged) => {
                //on slider change for a region, store changes here to preserve each region changes
                const newSliderValues = {
                  ...dynamicSliderValues,
                  [getAbbrv(selectedRegion)]: [
                    dynamicSliderValues[getAbbrv(selectedRegion)][0],
                    dynamicSliderValues[getAbbrv(selectedRegion)][1],
                    val,
                  ],
                }
                setDynamicSliderValues(newSliderValues)

                const newGlobalEnergy =
                  calculateTotalGlobalEnergy(newSliderValues)
                  
                passGlobalToHome(newGlobalEnergy)
                storeData("global-energy", newGlobalEnergy.toString())

                const {
                  regionalGraphData,
                  globalGraphData,
                } = //calculate new graph (excluding carbon budget) data for current region and global
                  calculateEnergyCurve(
                    val[getEnergyAbbrv(technologyChanged)],
                    technologyChanged,
                    dynamicGraphData[getAbbrv(selectedRegion)],
                    dynamicGraphData.global,
                    calculationData,
                  )
                
                setDynamicGraphData({
                  ...dynamicGraphData,
                  [getAbbrv(selectedRegion)]: regionalGraphData,
                  global: globalGraphData,
                })
                storeData("dynamic-graph-data", JSON.stringify(globalGraphData))

                const {newFossilReduction, newFossilData} = calculateCarbonReductions(
                  //calculate new global carbon budget curve based on new graph data
                  getAbbrv(selectedRegion),
                  calculationData,
                  regionalGraphData,
                  fossilReductionData[getAbbrv(selectedRegion)],
                  dynamicFossilData
                )

                setDynamicFossilData(newFossilData)

                storeData("dynamic-fossil-data", JSON.stringify(newFossilData))

                setFossilReductionData({
                  ...fossilReductionData,
                  [getAbbrv(selectedRegion)]: newFossilReduction,
                })
              }}
              onReset={() => {
                //when reset button is clicked within region
                const newSliderValues = {
                  ...dynamicSliderValues,
                  [getAbbrv(selectedRegion)]:
                    initialSliderValues[getAbbrv(selectedRegion)],
                }
                setDynamicSliderValues(newSliderValues)

                const newGlobalEnergy =
                  calculateTotalGlobalEnergy(newSliderValues)
                passGlobalToHome(newGlobalEnergy)
                storeData("global-energy", newGlobalEnergy.toString())

                const newGlobalGraphData = calculateNewGlobalOnReset(
                  initialGraphData[getAbbrv(selectedRegion)],
                  dynamicGraphData[getAbbrv(selectedRegion)],
                  dynamicGraphData.global,
                )
                setDynamicGraphData({
                  ...dynamicGraphData,
                  [getAbbrv(selectedRegion)]:
                    initialGraphData[getAbbrv(selectedRegion)],
                  global: newGlobalGraphData,
                })
                storeData("dynamic-graph-data", JSON.stringify(newGlobalGraphData))

                const newFossilData = calculateCarbonCurve(0-fossilReductionData[getAbbrv(selectedRegion)], dynamicFossilData)

                setDynamicFossilData(newFossilData)

                storeData("dynamic-fossil-data", JSON.stringify(newFossilData))

                setFossilReductionData({
                  ...fossilReductionData,
                  [getAbbrv(selectedRegion)]: 0
                })
              }}

              initialGraphData={initialGraphData}
              dynamicGraphData={dynamicGraphData}
              sliderDisabled={
                calculationData.region !== getAbbrv(selectedRegion) //don't let sliders be changed until region calculation data is updated
              }
            />
            
        </View>
      )}
    </BottomSheetTemplate>
  )

}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
})
