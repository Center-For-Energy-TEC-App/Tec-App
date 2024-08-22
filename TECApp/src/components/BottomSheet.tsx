import React, { useMemo, useEffect, useRef, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import BottomSheetTemplate from '@gorhom/bottom-sheet'
import { RegionalDashboard } from './RegionalDashboard'
import { GlobalDashboard } from './GlobalDashboard'
import { getDefaultValues, getMinMaxValues } from '../api/requests'

export type DefaultValues = {
  region: string
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
  ssa: DefaultValues[]
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
  passGlobalToHome: (energy: number) => void
}

export const BottomSheet = ({
  selectedRegion,
  onSwipeDown,
  passGlobalToHome
}: BottomSheetProps) => {
  const snapPoints = useMemo(() => ['12.5%', '25%', '50%', '80%'], [])
  const bottomSheetRef = useRef<BottomSheetTemplate>(null)
  const [currRegion, setCurrRegion] = useState(selectedRegion)

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
      .catch((error) => {
        console.error('Error fetching min/max values:', error)
      })
  }, [])

  useEffect(() => {
    if (selectedRegion === 'Global') {
      bottomSheetRef.current?.snapToIndex(0) // Snap to 12.5% for global dashboard
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
        bottomSheetRef.current?.snapToIndex(0)
        onSwipeDown()
      }}
    >
      <View style={styles.contentContainer}>
        {currRegion !== 'Global' ? (
          <RegionalDashboard
            minMaxValues={minMaxValues && minMaxValues[abbrvMap[currRegion]]}
            sliderValues={regionalDynamicValues && regionalDynamicValues[abbrvMap[currRegion]]}
            currRegion={currRegion}
            onSliderChange={(val) => {
              setRegionalDynamicValues({
                ...regionalDynamicValues,
                [abbrvMap[currRegion]]: [
                  regionalDynamicValues[abbrvMap[currRegion]][0],
                  regionalDynamicValues[abbrvMap[currRegion]][1],
                  val,
                ],
              })
              
              const updatedGlobalEnergy = calculateTotalGlobalEnergy({
                ...regionalDynamicValues,
                [abbrvMap[currRegion]]: [
                  regionalDynamicValues[abbrvMap[currRegion]][0],
                  regionalDynamicValues[abbrvMap[currRegion]][1],
                  val,
                ],
              })
              passGlobalToHome(updatedGlobalEnergy)
              setTotalGlobalEnergy(updatedGlobalEnergy)
            }}
            onReset={() => {
              setRegionalDynamicValues({
                ...regionalDynamicValues,
                [abbrvMap[currRegion]]:
                  regionalDefaultValues[abbrvMap[currRegion]],
              })

              const updatedGlobalEnergy = calculateTotalGlobalEnergy({
                ...regionalDynamicValues,
                [abbrvMap[currRegion]]:
                  regionalDefaultValues[abbrvMap[currRegion]],
              })
              passGlobalToHome(updatedGlobalEnergy)
              setTotalGlobalEnergy(updatedGlobalEnergy)
            }}
          />
        ) : (
          <GlobalDashboard totalGlobalEnergy={totalGlobalEnergy} />
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
