import React, { useMemo, useEffect, useRef, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import BottomSheetTemplate from '@gorhom/bottom-sheet'
import { RegionalDashboard } from './RegionalDashboard'
import {
  GraphData,
  RegionalMinMaxValues,
  CalculationData,
  getDefaultValues,
  getInitialGraphData,
  getMinMaxValues,
  getCalculationData,
  DefaultValues,
} from '../api/requests'
import { getAbbrv } from '../util/ValueDictionaries'
import {
  TemperatureData,
  calculateCarbonCurve,
  calculateCarbonReductions,
  calculateEnergyCurve,
  calculateInitialCoalGasOil,
  calculateNewGlobalOnReset,
  calculateRegionalCoalGasOil,
  calculateTemperature,
} from '../util/Calculations'
import { DataPoint } from './DataVisualizations/BAUComparison'
import { storeData } from '../util/Caching'
import { RandomNumberGenerationSource } from 'd3'

export interface BottomSheetProps {
  selectedRegion: string
  passGlobalToHome: (energy: number) => void
  passTemperatureToHome: (temperature: TemperatureData) => void
  tutorialState: number
  setTutorialState: (state: number) => void
  onSwipeDown: () => void
}

export type FossilReductionData = {
  chn: number[]
  nam: number[]
  lam: number[]
  ind: number[]
  sea: number[]
  mea: number[]
  opa: number[]
  eur: number[]
  ssa: number[]
  nee: number[]
}

export type CoalGasOil = {
  coal: number
  gas: number
  oil: number
}

export type CoalGasOilData = {
  chn: CoalGasOil
  nam: CoalGasOil
  lam: CoalGasOil
  ind: CoalGasOil
  sea: CoalGasOil
  mea: CoalGasOil
  opa: CoalGasOil
  eur: CoalGasOil
  ssa: CoalGasOil
  nee: CoalGasOil
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
  passTemperatureToHome,
  tutorialState,
  setTutorialState,
  onSwipeDown,
}: BottomSheetProps) => {
  const snapPoints = useMemo(() => ['12.5%', '25%', '50%', '80%'], [])
  const bottomSheetRef = useRef<BottomSheetTemplate>(null)

  //see api/requests.ts for specific info on structure of data objects
  const [initialSliderValues, setInitialSliderValues] =
    useState<DefaultValues>() //default slider values for every region
  const [dynamicSliderValues, setDynamicSliderValues] =
    useState<DefaultValues>() //storage of user changes to sliders
  const [minMaxValues, setMinMaxValues] = useState<RegionalMinMaxValues>() //min-max values for every slider

  const [initialGraphData, setInitialGraphData] = useState<GraphData>() //default graph data
  const [dynamicGraphData, setDynamicGraphData] = useState<GraphData>() //graph data based on user changes to sliders

  const [dynamicFossilData, setDynamicFossilData] = useState<DataPoint[]>() //carbon budget graph data based on user changes to sliders
  const [fossilReductionData, setFossilReductionData] =
    useState<FossilReductionData>() //carbon reduction data (to be applied to fossil data above)

  const [calculationData, setCalculationData] = useState<CalculationData>() //storage of all necessary calculation data for the current region'

  const [coalGasOil, setCoalGasOil] = useState<CoalGasOilData>()

  const calculateTotalGlobalEnergy = (sliderValues: DefaultValues) => {
    let totalEnergy = 0

    for (const region of regions) {
      const values = sliderValues[region].dynamic
      const regionEnergy =
        values.solar +
        values.wind +
        values.hydropower +
        values.biomass +
        values.geothermal +
        values.nuclear

      totalEnergy += regionEnergy
    }

    return totalEnergy
  }

  const initializeFossilData = (
    initialGraphData: GraphData,
    calculationData: CalculationData,
  ) => {
    let initialFossilData = []
    initialFossilData.push({ year: 2025, value: 33.29 + (3.8205 + 5.0 - 0.07) })
    initialFossilData.push({ year: 2030, value: 31.6 + (3.815 + 5.0 - 0.19) })
    for (let i = 2035; i <= 2060; i += 5) {
      initialFossilData.push({ year: i, value: 0 })
    }
    initialFossilData = calculateCarbonCurve(0, initialFossilData)
    setDynamicFossilData(initialFossilData)
    storeData('bau-fossil-data', JSON.stringify(initialFossilData))
    storeData('dynamic-fossil-data', JSON.stringify(initialFossilData))

    const initialFossilReductionData = {} as FossilReductionData
    for (const region of regions) {
      initialFossilReductionData[region] = [0, 0, 0, 0, 0, 0]
    }
    setFossilReductionData(initialFossilReductionData)

    const temperatureData = calculateTemperature(initialFossilData)
    passTemperatureToHome(temperatureData)
    storeData('temperature-data', JSON.stringify(temperatureData))

    const initialCoalGasOil = calculateInitialCoalGasOil(
      calculationData,
      initialGraphData,
    )
    setCoalGasOil(initialCoalGasOil)
  }

  //pull all initial data
  useEffect(() => {
    getDefaultValues()
      .then((val) => {
        setInitialSliderValues(val)
        setDynamicSliderValues(val)

        const globalEnergy = calculateTotalGlobalEnergy(val)
        passGlobalToHome(globalEnergy)
        storeData('global-energy', globalEnergy.toString())

        getMinMaxValues()
          .then((val) => {
            setMinMaxValues(val)

            getInitialGraphData()
              .then((val) => {
                setInitialGraphData(val)
                setDynamicGraphData(val)

                storeData('bau-graph-data', JSON.stringify(val.global))
                storeData('dynamic-graph-data', JSON.stringify(val.global))

                getCalculationData()
                  .then((val2) => {
                    setCalculationData(val2)
                    initializeFossilData(val, val2)
                  })
                  .catch(console.error)
              })
              .catch(console.error)
          })
          .catch(console.error)
      })
      .catch(console.error)
  }, [])

  //update regional calculation data on region select
  useEffect(() => {
    if (selectedRegion !== 'Global') {
      bottomSheetRef.current?.snapToIndex(3) // Snap to 80% when a region is selected
    } else {
      bottomSheetRef.current?.close()
    }
  }, [selectedRegion])

  return (
    <BottomSheetTemplate
      index={-1}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableHandlePanningGesture
      enableContentPanningGesture
      enablePanDownToClose
      onClose={onSwipeDown}
    >
      {dynamicFossilData &&
      fossilReductionData &&
      coalGasOil &&
      calculationData && //don't render regional sheet until all values load
      selectedRegion !== 'Global' ? (
        <View style={styles.contentContainer}>
          <RegionalDashboard
            minMaxValues={minMaxValues[getAbbrv(selectedRegion)]}
            sliderValues={dynamicSliderValues[getAbbrv(selectedRegion)]}
            tutorialState={tutorialState}
            setTutorialState={setTutorialState}
            currRegion={selectedRegion}
            onSliderChange={(val, technologyChanged) => {
              //on slider change for a region, store changes here to preserve each region changes
              const newSliderValues = {
                ...dynamicSliderValues,
                [getAbbrv(selectedRegion)]: {
                  ...dynamicSliderValues[getAbbrv(selectedRegion)],
                  dynamic: val,
                },
              }
              setDynamicSliderValues(newSliderValues)

              const newGlobalEnergy =
                calculateTotalGlobalEnergy(newSliderValues)

              passGlobalToHome(newGlobalEnergy)
              storeData('global-energy', newGlobalEnergy.toString())

              const {
                regionalGraphData,
                globalGraphData,
              } = //calculate new graph (excluding carbon budget) data for current region and global
                calculateEnergyCurve(
                  val[technologyChanged],
                  technologyChanged,
                  dynamicGraphData[getAbbrv(selectedRegion)],
                  dynamicGraphData.global,
                  calculationData[getAbbrv(selectedRegion)],
                )

              setDynamicGraphData({
                ...dynamicGraphData,
                [getAbbrv(selectedRegion)]: regionalGraphData,
                global: globalGraphData,
              })
              storeData('dynamic-graph-data', JSON.stringify(globalGraphData))

              const newFossilReduction = calculateCarbonReductions(
                getAbbrv(selectedRegion),
                calculationData[getAbbrv(selectedRegion)],
                regionalGraphData,
              )

              const newFossilData = calculateCarbonCurve(
                newFossilReduction[5] -
                  fossilReductionData[getAbbrv(selectedRegion)][5],
                dynamicFossilData,
              )

              setDynamicFossilData(newFossilData)

              storeData('dynamic-fossil-data', JSON.stringify(newFossilData))

              setFossilReductionData({
                ...fossilReductionData,
                [getAbbrv(selectedRegion)]: newFossilReduction,
              })

              const temperatureData = calculateTemperature(newFossilData)
              passTemperatureToHome(temperatureData)
              storeData('temperature-data', JSON.stringify(temperatureData))
              setCoalGasOil({
                ...coalGasOil,
                [getAbbrv(selectedRegion)]: calculateRegionalCoalGasOil(
                  calculationData[getAbbrv(selectedRegion)],
                  regionalGraphData,
                  getAbbrv(selectedRegion),
                ),
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
              storeData('global-energy', newGlobalEnergy.toString())

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
              storeData(
                'dynamic-graph-data',
                JSON.stringify(newGlobalGraphData),
              )

              const newFossilData = calculateCarbonCurve(
                0 - fossilReductionData[getAbbrv(selectedRegion)][5],
                dynamicFossilData,
              )

              setDynamicFossilData(newFossilData)

              storeData('dynamic-fossil-data', JSON.stringify(newFossilData))

              setFossilReductionData({
                ...fossilReductionData,
                [getAbbrv(selectedRegion)]: [0, 0, 0, 0, 0, 0],
              })

              const temperatureData = calculateTemperature(newFossilData)
              passTemperatureToHome(temperatureData)
              storeData('temperature-data', JSON.stringify(temperatureData))
              setCoalGasOil({
                ...coalGasOil,
                [getAbbrv(selectedRegion)]: calculateRegionalCoalGasOil(
                  calculationData[getAbbrv(selectedRegion)],
                  initialGraphData[getAbbrv(selectedRegion)],
                  getAbbrv(selectedRegion),
                ),
              })
            }}
            initialGraphData={initialGraphData}
            dynamicGraphData={dynamicGraphData}
            sliderDisabled={
              calculationData[getAbbrv(selectedRegion)].region !==
              getAbbrv(selectedRegion) //don't let sliders be changed until region calculation data is updated
            }
            coalGasOil={coalGasOil[getAbbrv(selectedRegion)]}
            carbonReduction={fossilReductionData[
              getAbbrv(selectedRegion)
            ].reduce((a, b) => a + b, 0)}
            calculationData={calculationData[getAbbrv(selectedRegion)]}
          />
        </View>
      ) : (
        <></>
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
    zIndex: 3,
  },
})
