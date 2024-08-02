import React, { useMemo, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import BottomSheetTemplate from '@gorhom/bottom-sheet'
import { RegionalDashboard } from './RegionalDashboard'
import { GlobalDashboard } from './GlobalDashboard'
import { getDefaultValues } from '../api/requests'

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

  const [values, setValues] = useState();

  useEffect(() => {

    getDefaultValues({category: 'altered', region: 'global', global_tw:"8"}).then(val=>{
      setValues(val)
    }).catch(console.error)


    if (selectedRegion === 'Global') {
      bottomSheetRef.current.snapToIndex(0)  // Snap to 12.5% for global dashboard
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
      <Text>{values && values["category"]}</Text>
      <View style={styles.contentContainer}>
        {currRegion !== 'Global' ? (
          <RegionalDashboard currRegion={currRegion} />
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
