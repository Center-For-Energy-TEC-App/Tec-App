import React, { useMemo, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, DrawerLayoutAndroidBase } from 'react-native'
import BottomSheetTemplate from '@gorhom/bottom-sheet'
import { RegionalDashboard } from './RegionalDashboard'
import { GlobalDashboard } from './GlobalDashboard'
import {
  GraphData,
  RegionalMinMaxValues,
  RegionalValues,
  RenewableEnergyCalculationData,
  getDefaultValues,
  getInitialGraphData,
  getMinMaxValues,
  getRegionCalculationData,
} from '../api/requests'
import { getAbbrv, getEnergyAbbrv } from '../util/ValueDictionaries'
import { calculateCurve } from '../util/Calculations'

export interface BottomSheetProps {
  selectedRegion: string
  onSwipeDown: () => void
}

export const BottomSheet = ({
  selectedRegion,
  onSwipeDown,
}: BottomSheetProps) => {
  const snapPoints = useMemo(() => ['12.5%', '25%', '50%', '80%'], [])
  const bottomSheetRef = useRef<BottomSheetTemplate>(null)
  const [currRegion, setCurrRegion] = useState(selectedRegion)

  const [regionalDefaultValues, setRegionalDefaultValues] =
    useState<RegionalValues>()
  const [regionalDynamicValues, setRegionalDynamicValues] =
    useState<RegionalValues>()
  const [minMaxValues, setMinMaxValues] = useState<RegionalMinMaxValues>()

  const [initialGraphData, setInitialGraphData] = useState<GraphData>()
  const [dynamicGraphData, setDynamicGraphData] = useState<GraphData>()

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
  }, [])

  useEffect(() => {
    getRegionCalculationData(getAbbrv(currRegion))
      .then((val) => {
        setCalculationData(val)
      })
      .catch(console.error)

    if (selectedRegion === 'Global') {
      bottomSheetRef.current.snapToIndex(0) // Snap to 12.5% for global dashboard
    } else {
      bottomSheetRef.current?.snapToIndex(2) // Snap to 25% when a region is selected
    }
    setCurrRegion(selectedRegion)
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
          {currRegion !== 'Global' ? (
            <RegionalDashboard
              minMaxValues={minMaxValues[getAbbrv(currRegion)]}
              sliderValues={regionalDynamicValues[getAbbrv(currRegion)]}
              currRegion={currRegion}
              onSliderChange={(val, technologyChanged) => {
                setRegionalDynamicValues({
                  ...regionalDynamicValues,
                  [getAbbrv(currRegion)]: [
                    regionalDynamicValues[getAbbrv(currRegion)][0],
                    regionalDynamicValues[getAbbrv(currRegion)][1],
                    val,
                  ],
                })
                setDynamicGraphData({
                  ...dynamicGraphData,
                  [getAbbrv(currRegion)]: calculateCurve(
                    {technology: technologyChanged, value: val[getEnergyAbbrv(technologyChanged)]},
                    dynamicGraphData[getAbbrv(currRegion)],
                    calculationData,
                  ),
                })
              }}
              onReset={() =>
                setRegionalDynamicValues({
                  ...regionalDynamicValues,
                  [getAbbrv(currRegion)]:
                    regionalDefaultValues[getAbbrv(currRegion)],
                })
              }
              initialGraphData={initialGraphData}
              dynamicGraphData={dynamicGraphData}
            />
          ) : (
            <GlobalDashboard
              initialGraphData={initialGraphData}
              dynamicGraphData={dynamicGraphData}
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
