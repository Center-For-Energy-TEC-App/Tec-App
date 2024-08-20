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

export const BottomSheet = ({
  selectedRegion,
  onSwipeDown,
}: BottomSheetProps) => {
  const snapPoints = useMemo(() => ['12.5%', '25%', '50%', '80%'], [])
  const bottomSheetRef = useRef<BottomSheetTemplate>(null)

  const [regionalDefaultValues, setRegionalDefaultValues] =
    useState<RegionalValues>()
  const [regionalDynamicValues, setRegionalDynamicValues] =
    useState<RegionalValues>()
  const [minMaxValues, setMinMaxValues] = useState<RegionalMinMaxValues>()

  const [initialGraphData, setInitialGraphData] = useState<GraphData>()
  const [dynamicGraphData, setDynamicGraphData] = useState<GraphData>()

  const [initialFossilData, setInitialFossilData] = useState<DataPoint[]>()
  const [dynamicFossilData, setDynamicFossilData] = useState<DataPoint[]>()
  const [fossilReductionData, setFossilReductionData] =
    useState<FossilReductionData>()

  const [calculationData, setCalculationData] =
    useState<RenewableEnergyCalculationData>()

  useEffect(() => {
    getDefaultValues()
      .then((val) => {
        setRegionalDefaultValues(val)
        setRegionalDynamicValues(val)
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
      console.log(val)
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
        { year: 2040, value: 0 },
        { year: 2050, value: 0 },
        { year: 2060, value: 0 },

      ]
    }
    setFossilReductionData(initialFossilReductionData)
  }, [])

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
      {regionalDynamicValues && (
        <View style={styles.contentContainer}>
          {selectedRegion !== 'Global' ? (
            <RegionalDashboard
              minMaxValues={minMaxValues[getAbbrv(selectedRegion)]}
              sliderValues={regionalDynamicValues[getAbbrv(selectedRegion)]}
              currRegion={selectedRegion}
              onSliderChange={(val, technologyChanged) => {
                setRegionalDynamicValues({
                  ...regionalDynamicValues,
                  [getAbbrv(selectedRegion)]: [
                    regionalDynamicValues[getAbbrv(selectedRegion)][0],
                    regionalDynamicValues[getAbbrv(selectedRegion)][1],
                    val,
                  ],
                })
                const { regional, global } = calculateEnergyCurve(
                  {
                    technology: technologyChanged,
                    value: val[getEnergyAbbrv(technologyChanged)],
                  },
                  dynamicGraphData[getAbbrv(selectedRegion)],
                  dynamicGraphData.global,
                  calculationData,
                )
                setDynamicGraphData({
                  ...dynamicGraphData,
                  [getAbbrv(selectedRegion)]: regional,
                  global: global,
                })

                const newRegionFossilReductionData = calculateCarbonReductions(
                  getAbbrv(selectedRegion),
                  calculationData,
                  regional,
                )

                const newFossilData = JSON.parse(JSON.stringify(dynamicFossilData))
                for (let i = 1; i < dynamicFossilData.length; i++) {
                  newFossilData[i].value -=
                    newRegionFossilReductionData[i - 1].value -
                    fossilReductionData[getAbbrv(selectedRegion)][i - 1].value
                }
             
                setDynamicFossilData(newFossilData)

                setFossilReductionData({
                  ...fossilReductionData,
                  [getAbbrv(selectedRegion)]: newRegionFossilReductionData,
                })
              }}
              onReset={() => {
                setRegionalDynamicValues({
                  ...regionalDynamicValues,
                  [getAbbrv(selectedRegion)]:
                    regionalDefaultValues[getAbbrv(selectedRegion)],
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

                const newFossilData = JSON.parse(JSON.stringify(dynamicFossilData))
                for (let i = 1; i < dynamicFossilData.length; i++) {
                  newFossilData[i].value +=
                    fossilReductionData[getAbbrv(selectedRegion)][i - 1].value
                }

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
                    { year: 2040, value: 0 },
                    { year: 2050, value: 0 },
                    { year: 2060, value: 0 },

                  ],
                })
              }}
              initialGraphData={initialGraphData}
              dynamicGraphData={dynamicGraphData}
              sliderDisabled={
                calculationData.region !== getAbbrv(selectedRegion)
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
