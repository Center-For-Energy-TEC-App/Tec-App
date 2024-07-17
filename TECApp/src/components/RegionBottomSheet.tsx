import React, { useMemo, useEffect, useRef, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import DistributeRenewables from './DistributeRenewables'
import DataVisualizations from './DataVisualizations'

export interface RegionBottomSheetProps {
  selectedRegion: string
}

const RegionBottomSheet = ({ selectedRegion }: RegionBottomSheetProps) => {
  const snapPoints = useMemo(() => ['10%', '50%', '90%'], [])
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [activeTab, setActiveTab] = useState<'renewables' | 'visualizations'>(
    'renewables',
  )

  useEffect(() => {
    if (selectedRegion) {
      bottomSheetRef.current?.snapToIndex(1) // Snap to 25% when a region is selected
    }
  }, [selectedRegion])

  return (
    <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
      <View style={styles.contentContainer}>
        {selectedRegion ? (
          <View style={styles.regionInfoContainer}>
            <Text style={styles.regionName}>{selectedRegion}</Text>
            <View style={styles.tabContainer}>
              <TouchableOpacity onPress={() => setActiveTab('renewables')}>
                <Text
                  style={
                    activeTab === 'renewables'
                      ? styles.activeTab
                      : styles.inactiveTab
                  }
                >
                  Distribute Renewables
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('visualizations')}>
                <Text
                  style={
                    activeTab === 'visualizations'
                      ? styles.activeTab
                      : styles.inactiveTab
                  }
                >
                  Data Visualizations
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.horizontalLineContainer}>
              <View style={styles.horizontalLine} />
            </View>
            {activeTab === 'renewables' ? (
              <DistributeRenewables />
            ) : (
              <DataVisualizations />
            )}
          </View>
        ) : (
          <Text style={styles.text}>Some text here global yes mwahahah</Text>
        )}
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  regionInfoContainer: {
    flex: 1,
    width: '100%',
    padding: 16,
    alignItems: 'flex-start',
  },
  regionName: {
    color: '#000',
    fontSize: 28,
    fontFamily: 'Brix Sans',
    fontWeight: '400',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 43,
  },
  horizontalLineContainer: {
    width: '95%',
    height: 1,
    backgroundColor: '#ccc',
  },
  horizontalLine: {
    width: '95%',
    height: 1,
    backgroundColor: '#ccc'
  },
  activeTab: {
    fontWeight: '700',
    color: '#266297',
    borderBottomWidth: 2,
    borderBottomColor: '#007BFF',
  },
  inactiveTab: {
    color: '#000',
    fontWeight: '400',
  },
  text: {
    fontSize: 14,
  },
})

export default RegionBottomSheet
