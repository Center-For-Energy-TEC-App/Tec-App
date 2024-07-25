import React, { useMemo, useEffect, useRef, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import DistributeRenewables from './DistributeRenewables'
import DataVisualizations from './DataVisualizations'

export interface RegionBottomSheetProps {
  selectedRegion: string
}

const RegionBottomSheet = ({ selectedRegion }: RegionBottomSheetProps) => {
  const snapPoints = useMemo(() => ['10%', '25%', '50%', '80%'], [])
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
                <View
                  style={
                    activeTab === 'renewables'
                      ? styles.activeTabWrapper
                      : styles.inactiveTabWrapper
                  }
                >
                  <Text
                    style={
                      activeTab === 'renewables'
                        ? styles.activeTab
                        : styles.inactiveTab
                    }
                  >
                    Distribute Renewables
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('visualizations')}>
                <View
                  style={
                    activeTab === 'visualizations'
                      ? styles.activeTabWrapper
                      : styles.inactiveTabWrapper
                  }
                >
                  <Text
                    style={
                      activeTab === 'visualizations'
                        ? styles.activeTab
                        : styles.inactiveTab
                    }
                  >
                    Data Visualizations
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.horizontalLine} />
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
    alignItems: 'flex-start',
  },
  regionName: {
    color: '#000',
    fontSize: 28,
    fontFamily: 'Brix Sans',
    fontWeight: '400',
    paddingBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 43,
  },
  horizontalLine: {
    width: '95%',
    height: 1,
    backgroundColor: '#ccc',
  },
  activeTab: {
    fontWeight: '400',
    color: '#266297',
    fontSize: 16,
    paddingBottom: 4,
  },
  inactiveTab: {
    color: '#000',
    fontWeight: '400',
    fontSize: 16,
  },
  activeTabWrapper: {
    borderBottomWidth: 2,
    borderBottomColor: '#266297',
  },
  inactiveTabWrapper: {
    borderBottomWidth: 0,
  },
  text: {
    fontSize: 14,
  },
})

export default RegionBottomSheet
