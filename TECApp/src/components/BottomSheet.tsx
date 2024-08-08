import React, { useMemo, useEffect, useRef, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import BottomSheetTemplate from '@gorhom/bottom-sheet'
import { RegionalDashboard } from './RegionalDashboard'
import { GlobalDashboard } from './GlobalDashboard'
import { getDefaultValues, getInitialGraphData, getMinMaxValues } from '../api/requests'
import { DataPoint } from './DataVisualizations/BAUComparison'
import { getAbbrv } from '../util/ValueDictionaries'

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


export type RegionData = {
  solar: DataPoint[]
  wind: DataPoint[]
  hydropower: DataPoint[]
  geothermal: DataPoint[]
  biomass: DataPoint[]
  nuclear: DataPoint[]
  total: DataPoint[]
}

export type GraphData = {   
  global: RegionData
  chn: RegionData
  nam: RegionData
  lam: RegionData
  ind: RegionData
  sea: RegionData
  mea: RegionData
  opa: RegionData
  eur: RegionData
  ssa: RegionData
  nee: RegionData
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

  const [initialGraphData, setInitialGraphData] = useState<GraphData>()
  const [dynamicGraphData, setDynamicGraphData] = useState<GraphData>()

  useEffect(() => {
    getDefaultValues()
      .then((val) => {
        setRegionalDefaultValues(val)
        setRegionalDynamicValues(val)
        console.log(val)
      })
      .catch(console.error)
    getMinMaxValues()
      .then((val) => {
        setMinMaxValues(val)
      })
      .catch(console.error)
    getInitialGraphData().then((val)=>{
      setInitialGraphData(val)
      setDynamicGraphData(val)
    }).catch(console.error)
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
      {regionalDynamicValues &&
      <View style={styles.contentContainer}>
        {currRegion !== 'Global' ? (
          <RegionalDashboard
            minMaxValues={minMaxValues[getAbbrv(currRegion)]}
            sliderValues={regionalDynamicValues[getAbbrv(currRegion)]}
            currRegion={currRegion}
            onSliderChange={(val) =>
              setRegionalDynamicValues({
                ...regionalDynamicValues,
                [getAbbrv(currRegion)]: [
                  regionalDynamicValues[getAbbrv(currRegion)][0],
                  regionalDynamicValues[getAbbrv(currRegion)][1],
                  val,
                ],
              })
            }
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
          <GlobalDashboard initialGraphData={initialGraphData} dynamicGraphData={dynamicGraphData}/>
        )}
      </View>
    }
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
