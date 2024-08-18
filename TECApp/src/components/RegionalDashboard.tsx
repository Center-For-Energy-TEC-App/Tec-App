import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Platform, Dimensions, TouchableOpacity } from 'react-native'
import DistributeRenewables from './DistributeRenewables'
import DataVisualizations from './DataVisualizations/DataVisualizations'
import { DefaultValues, GraphData, MinMaxValues } from '../api/requests'

type RegionalDashboardProps = {
  currRegion: string
  sliderValues: DefaultValues
  minMaxValues: MinMaxValues
  onSliderChange: (val: DefaultValues, technologyChanged: string) => void
  onReset: () => void
  initialGraphData: GraphData
  dynamicGraphData: GraphData
  sliderDisabled: boolean
}

export const RegionalDashboard = ({
  currRegion,
  sliderValues,
  minMaxValues,
  onSliderChange,
  onReset,
  initialGraphData,
  dynamicGraphData,
  sliderDisabled,
}: RegionalDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'renewables' | 'visualizations'>(
    'renewables',
  )

  const deviceType = () => {
    const { width, height } = Dimensions.get('window')
    return Platform.OS === 'ios' && (width >= 1024 || height >= 1366) ? 'ipad' : 'iphone'
  }

  const isIpad = deviceType() === 'ipad'

  useEffect(() => {
    setActiveTab('renewables')
  }, [currRegion])

  return (
    <View style={styles.regionInfoContainer}>
      <Text style={styles.regionName}>{currRegion}</Text>
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
                ? [styles.activeTab, isIpad && styles.iPadText]
                : [styles.inactiveTab, isIpad && styles.iPadText]
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
                ? [styles.activeTab, isIpad && styles.iPadText]
                : [styles.inactiveTab, isIpad && styles.iPadText]
              }
            >
              Data Visualizations
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.horizontalLine} />
      {activeTab === 'renewables' ? (
        <DistributeRenewables
          values={sliderValues}
          minMaxValues={minMaxValues}
          onSliderChange={onSliderChange}
          onReset={onReset}
          disabled={sliderDisabled}
        />
      ) : (
        <DataVisualizations
          initialData={initialGraphData}
          dynamicData={dynamicGraphData}
          region={currRegion}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
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
  iPadText: {
    fontSize: 18,
  },
})
