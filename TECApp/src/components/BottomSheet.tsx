import React, { useMemo, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import BottomSheetTemplate from '@gorhom/bottom-sheet'
import { RegionalDashboard } from './RegionalDashboard'
import { GlobalDashboard } from './GlobalDashboard'
import { getDefaultValues, getMinMaxValues } from '../api/requests'

export type DefaultValues = {
  category: string
  global_tw: string
  regional_gw?: number
  solar_gw: number
  wind_gw: number
  hydro_gw: number
  geo_gw: number
  bio_gw: number
  nuclear_gw: number
}

export type RegionalValues = {
  chn: DefaultValues[]
  nam: DefaultValues[]
  lam: DefaultValues[]
  ind: DefaultValues[]
  sea: DefaultValues[]
  mea: DefaultValues[]
  opa: DefaultValues[]
  eur: DefaultValues[]
  nee: DefaultValues[]
}

export type MinMaxValues = {
  min: {
    solar: string
    wind: string
    hydropower: string
    geothermal: string
    biomass: string
    nuclear: string
  }
  max: {
    solar: string
    wind: string
    hydropower: string
    geothermal: string
    biomass: string
    nuclear: string
  }
}

export type RegionalMinMaxValues = {
  chn: MinMaxValues
  nam: MinMaxValues
  lam: MinMaxValues
  ind: MinMaxValues
  sea: MinMaxValues
  mea: MinMaxValues
  opa: MinMaxValues
  eur: MinMaxValues
  nee: MinMaxValues
}

const abbrvMap = {
  'North America': 'nam',
  'Latin America': 'lam',
  Europe: 'eur',
  'Sub-Saharan Africa': 'ssa',
  'Middle East & N. Africa': 'mea',
  'North East Eurasia': 'nee',
  'Greater China': 'chn',
  'Indian Subcontinent': 'ind',
  'South East Asia': 'sea',
  'OECD Pacific': 'opa',
}

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

  useEffect(() => {
    getDefaultValues({ global_tw: '10' })
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
  }, [])

  useEffect(() => {
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
      <View style={styles.contentContainer}>
        {currRegion !== 'Global' ? (
          <RegionalDashboard
            minMaxValues={minMaxValues[abbrvMap[currRegion]]}
            sliderValues={regionalDynamicValues[abbrvMap[currRegion]]}
            currRegion={currRegion}
            onSliderChange={(val) =>
              setRegionalDynamicValues({
                ...regionalDynamicValues,
                [abbrvMap[currRegion]]: [
                  regionalDynamicValues[abbrvMap[currRegion]][0],
                  regionalDynamicValues[abbrvMap[currRegion]][1],
                  val,
                ],
              })
            }
            onReset={() =>
              setRegionalDynamicValues({
                ...regionalDynamicValues,
                [abbrvMap[currRegion]]:
                  regionalDefaultValues[abbrvMap[currRegion]],
              })
            }
          />
        ) : (
          <GlobalDashboard />
        )}
      </View>
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
