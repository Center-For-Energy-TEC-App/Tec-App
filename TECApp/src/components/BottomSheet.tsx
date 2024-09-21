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
  getInitialGraphData,
  getMinMaxValues,
  getRegionCalculationData,
} from '../api/requests'
import { getAbbrv, getEnergyAbbrv } from '../util/ValueDictionaries'
import { calculateCurve } from '../util/Calculations'

export interface BottomSheetProps {
  selectedRegion: string
  onSwipeDown: () => void
  passGlobalToHome: (energy: number) => void
  slidersRef: React.RefObject<View>
  bauRef: React.RefObject<View>
  regionalComparisonRef: React.RefObject<View>
  technologyComparisonRef: React.RefObject<View>
}

export const BottomSheet = ({
  selectedRegion,
  onSwipeDown,
  passGlobalToHome,
  slidersRef,
  bauRef,
  regionalComparisonRef,
  technologyComparisonRef
}: BottomSheetProps) => {
  const snapPoints = useMemo(() => ['12.5%', '25%', '50%', '80%'], [])
  const bottomSheetRef = useRef<BottomSheetTemplate>(null)

  const [regionalDefaultValues, setRegionalDefaultValues] =
    useState<RegionalValues>()
  const [regionalDynamicValues, setRegionalDynamicValues] =
    useState<RegionalValues>()
  const [minMaxValues, setMinMaxValues] = useState<RegionalMinMaxValues>()

  const [totalGlobalEnergy, setTotalGlobalEnergy] = useState<number>(0)

  const calculateTotalGlobalEnergy = (regions: RegionalValues) => {
    let totalEnergy = 0

    Object.entries(regions).forEach(([regionKey, regionArray]) => {
      if (regionKey !== 'global' && regionArray.length > 0) {
        const region = regionArray[regionArray.length - 1] // Only use the latest value

        const regionEnergy =
          region.solar_gw +
          region.wind_gw +
          region.hydro_gw +
          region.bio_gw +
          region.geo_gw +
          region.nuclear_gw

        totalEnergy += regionEnergy
      }
    })
    passGlobalToHome(totalEnergy) // Pass up to Home
    setTotalGlobalEnergy(totalEnergy) // Update total global energy
    return totalEnergy
  }

  const [initialGraphData, setInitialGraphData] = useState<GraphData>()
  const [dynamicGraphData, setDynamicGraphData] = useState<GraphData>()

  const [calculationData, setCalculationData] =
    useState<RenewableEnergyCalculationData>()

  useEffect(() => {
    getDefaultValues()
      .then((val) => {
        setRegionalDefaultValues(val)
        setRegionalDynamicValues(val)

        const defaultValues: RegionalValues = {
          chn: [],
          nam: [],
          lam: [],
          ind: [],
          sea: [],
          mea: [],
          opa: [],
          eur: [],
          ssa: [],
          nee: [],
        }

        Object.entries(val).forEach(([regionKey, regionArray]) => {
          if (
            regionKey !== 'global' &&
            Array.isArray(regionArray) &&
            regionArray.length > 0
          ) {
            defaultValues[regionKey as keyof RegionalValues] = [regionArray[1]] // Adjust index based on use case
          }
        })
        const initialGlobalEnergy = calculateTotalGlobalEnergy(defaultValues)
        setTotalGlobalEnergy(initialGlobalEnergy)
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
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    getRegionCalculationData(getAbbrv(selectedRegion))
      .then((val) => {
        setCalculationData(val)
      })
      .catch(console.error)

    if (selectedRegion === 'Global') {
      bottomSheetRef.current?.snapToIndex(0) // Snap to 12.5% for global dashboard
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
        bottomSheetRef.current?.snapToIndex(0)
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
              slidersRef={slidersRef}
              bauRef={bauRef}
              regionalComparisonRef={regionalComparisonRef}
              technologyComparisonRef={technologyComparisonRef}
              onSliderChange={(val, technologyChanged) => {
                setRegionalDynamicValues({
                  ...regionalDynamicValues,
                  [getAbbrv(selectedRegion)]: [
                    regionalDynamicValues[getAbbrv(selectedRegion)][0],
                    regionalDynamicValues[getAbbrv(selectedRegion)][1],
                    val,
                  ],
                })
                setDynamicGraphData({
                  ...dynamicGraphData,
                  [getAbbrv(selectedRegion)]: calculateCurve(
                    {
                      technology: technologyChanged,
                      value: val[getEnergyAbbrv(technologyChanged)],
                    },
                    dynamicGraphData[getAbbrv(selectedRegion)],
                    calculationData,
                  ),
                })       

              const updatedGlobalEnergy = calculateTotalGlobalEnergy({
                ...regionalDynamicValues,
                [getAbbrv(selectedRegion)]: [
                  regionalDynamicValues[getAbbrv(selectedRegion)][0],
                  regionalDynamicValues[getAbbrv(selectedRegion)][1],
                  val,
                ],
              });
              passGlobalToHome(updatedGlobalEnergy);
              setTotalGlobalEnergy(updatedGlobalEnergy);
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
                })
                const updatedGlobalEnergy = calculateTotalGlobalEnergy({
                  ...regionalDynamicValues,
                  [getAbbrv(selectedRegion)]: regionalDefaultValues[getAbbrv(selectedRegion)],
                });
                passGlobalToHome(updatedGlobalEnergy);
                setTotalGlobalEnergy(updatedGlobalEnergy);

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
              totalGlobalEnergy={totalGlobalEnergy}
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
