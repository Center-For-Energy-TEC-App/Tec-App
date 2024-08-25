import React, { useMemo, useEffect, useRef, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import BottomSheetTemplate from '@gorhom/bottom-sheet'
import { RegionalDashboard } from './RegionalDashboard'
import { GlobalDashboard } from './GlobalDashboard'
import {
  GraphData,
  RegionalMinMaxValues,
  RegionalValues,
  RenewableEnergyCalculationData,
  getDefaultValues,
  getInitialFossilData,
  getInitialGraphData,
  getMinMaxValues,
  getRegionCalculationData,
} from '../api/requests'
import { getAbbrv, getEnergyAbbrv } from '../util/ValueDictionaries'
import {
  calculateCarbonReductions,
  calculateEnergyCurve,
  calculateNewGlobalOnReset,
} from '../util/Calculations'
import { DataPoint } from './DataVisualizations/BAUComparison'

export interface BottomSheetProps {
  selectedRegion: string
  onSwipeDown: () => void
}

export type FossilReductionData = {
  chn: DataPoint[]
  nam: DataPoint[]
  lam: DataPoint[]
  ind: DataPoint[]
  sea: DataPoint[]
  mea: DataPoint[]
  opa: DataPoint[]
  eur: DataPoint[]
  ssa: DataPoint[]
  nee: DataPoint[]
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
  onSwipeDown,
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

  const [initialFossilData, setInitialFossilData] = useState<DataPoint[]>() //default carbon budget graph data
  const [dynamicFossilData, setDynamicFossilData] = useState<DataPoint[]>() //carbon budget graph data based on user changes to sliders
  const [fossilReductionData, setFossilReductionData] =
    useState<FossilReductionData>() //carbon reduction data (to be applied to fossil data above)

  const [calculationData, setCalculationData] =
    useState<RenewableEnergyCalculationData>() //storage of all necessary calculation data for the current region

  //pull all initial data
  useEffect(() => {
    getDefaultValues()
      .then((val) => {
        console.log('finished')
        setInitialSliderValues(val)
        setDynamicSliderValues(val)
      })
      .catch(console.error)
    getMinMaxValues()
      .then((val) => {
        setMinMaxValues(val)
      })
      .catch(console.error)
    getInitialGraphData()
      .then((val) => {
        setInitialGraphData(val)
        setDynamicGraphData(val)
      })
      .catch(console.error)
    getInitialFossilData().then((val) => {
      setInitialFossilData(val)
      setDynamicFossilData(val)
    })

    const initialFossilReductionData = {} as FossilReductionData
    for (const region of regions) {
      initialFossilReductionData[region] = [
        { year: 2025, value: 0 },
        { year: 2026, value: 0 },
        { year: 2027, value: 0 },
        { year: 2028, value: 0 },
        { year: 2029, value: 0 },
        { year: 2030, value: 0 },
      ]
    }
    setFossilReductionData(initialFossilReductionData)
  }, [])

  //update regional calculation data on region select
  useEffect(() => {
    getRegionCalculationData(getAbbrv(selectedRegion))
      .then((val) => {
        setCalculationData(val)
      })
      .catch(console.error)

    if (selectedRegion === 'Global') {
      bottomSheetRef.current.snapToIndex(0) // Snap to 12.5% for global dashboard
    } else {
      bottomSheetRef.current?.snapToIndex(2) // Snap to 25% when a region is selected
    }
  }, [selectedRegion])

  return (
    <BottomSheetTemplate
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={() => {
        bottomSheetRef.current.snapToIndex(0)
        onSwipeDown()
      }}
    >
      {dynamicSliderValues && (           //don't render regional sheet until slider values load
        <View style={styles.contentContainer}>
          {selectedRegion !== 'Global' ? (
            <RegionalDashboard
              minMaxValues={minMaxValues[getAbbrv(selectedRegion)]}
              sliderValues={dynamicSliderValues[getAbbrv(selectedRegion)]}
              currRegion={selectedRegion}
              onSliderChange={(val, technologyChanged) => {   //on slider change for a region, store changes here to preserve each region changes
                setDynamicSliderValues({
                  ...dynamicSliderValues,
                  [getAbbrv(selectedRegion)]: [
                    dynamicSliderValues[getAbbrv(selectedRegion)][0],
                    dynamicSliderValues[getAbbrv(selectedRegion)][1],
                    val,
                  ],
                })
                const { regionalGraphData, globalGraphData } =  //calculate new graph (excluding carbon budget) data for current region and global
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

                const newRegionFossilReductionData = calculateCarbonReductions( //calculate new global carbon reduction based on new graph data
                  getAbbrv(selectedRegion),
                  calculationData,
                  regionalGraphData,
                )

                const newFossilData = JSON.parse(
                  JSON.stringify(dynamicFossilData),    //deep copy
                )
                for (let i = 0; i < newRegionFossilReductionData.length; i++) {  //apply new reductions to fossil data
                  newFossilData[i + 1].value -=
                    newRegionFossilReductionData[i].value -
                    fossilReductionData[getAbbrv(selectedRegion)][i].value
                }
                //graph extrapolation to 2060
                newFossilData[7].value =
                  newFossilData[6].value > 30
                    ? newFossilData[6].value * 0.82
                    : newFossilData[6].value >= 25
                      ? newFossilData[6].value * 0.71
                      : newFossilData[6].value * 0.6
                newFossilData[8].value =
                  newFossilData[6].value > 30
                    ? newFossilData[7].value * 0.71
                    : newFossilData[6].value >= 25
                      ? newFossilData[7].value * 0.58
                      : newFossilData[7].value * 0.5
                newFossilData[9].value =
                  newFossilData[6].value > 30
                    ? newFossilData[8].value * 0.542
                    : newFossilData[6].value >= 25
                      ? newFossilData[8].value * 0.436
                      : newFossilData[8].value * 0.33

                setDynamicFossilData(newFossilData)

                setFossilReductionData({
                  ...fossilReductionData,
                  [getAbbrv(selectedRegion)]: newRegionFossilReductionData,
                })
              }}
              onReset={() => {  //when reset button is clicked within region
                setDynamicSliderValues({
                  ...dynamicSliderValues,
                  [getAbbrv(selectedRegion)]:
                    initialSliderValues[getAbbrv(selectedRegion)],
                })
                setDynamicGraphData({
                  ...dynamicGraphData,
                  [getAbbrv(selectedRegion)]:
                    initialGraphData[getAbbrv(selectedRegion)],
                  global: calculateNewGlobalOnReset(
                    initialGraphData[getAbbrv(selectedRegion)],
                    dynamicGraphData[getAbbrv(selectedRegion)],
                    dynamicGraphData.global,
                  ),
                })

                const newFossilData = JSON.parse(
                  JSON.stringify(dynamicFossilData),
                )
                for (let i = 0; i < 6; i++) {
                  newFossilData[i + 1].value +=
                    fossilReductionData[getAbbrv(selectedRegion)][i].value
                }

                newFossilData[7].value =
                  newFossilData[6].value > 30
                    ? newFossilData[6].value * 0.82
                    : newFossilData[6].value >= 25
                      ? newFossilData[6].value * 0.71
                      : newFossilData[6].value * 0.6
                newFossilData[8].value =
                  newFossilData[6].value > 30
                    ? newFossilData[7].value * 0.71
                    : newFossilData[6].value >= 25
                      ? newFossilData[7].value * 0.58
                      : newFossilData[7].value * 0.5
                newFossilData[9].value =
                  newFossilData[6].value > 30
                    ? newFossilData[8].value * 0.542
                    : newFossilData[6].value >= 25
                      ? newFossilData[8].value * 0.436
                      : newFossilData[7].value * 0.33

                setDynamicFossilData(newFossilData)

                setFossilReductionData({
                  ...fossilReductionData,
                  [getAbbrv(selectedRegion)]: [
                    { year: 2025, value: 0 },
                    { year: 2026, value: 0 },
                    { year: 2027, value: 0 },
                    { year: 2028, value: 0 },
                    { year: 2029, value: 0 },
                    { year: 2030, value: 0 },
                  ],
                })
              }}
              initialGraphData={initialGraphData}
              dynamicGraphData={dynamicGraphData}
              sliderDisabled={
                calculationData.region !== getAbbrv(selectedRegion) //don't let sliders be changed until region calculation data is updated
              }
            />
          ) : (
            <GlobalDashboard
              initialGraphData={initialGraphData}
              dynamicGraphData={dynamicGraphData}
              dynamicFossilData={dynamicFossilData}
              initialFossilData={initialFossilData}
            />
          )}
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
