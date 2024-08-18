import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native'
import DistributeRenewables from './DistributeRenewables'
import DataVisualizations from './DataVisualizations/DataVisualizations'
import { Tracker } from './Tracker'
import { ScrollView } from 'react-native-gesture-handler'
import { GraphData } from '../api/requests'

type GlobalDashboardProps = {
  initialGraphData: GraphData
  dynamicGraphData: GraphData
}

export const GlobalDashboard = ({
  initialGraphData,
  dynamicGraphData,
}: GlobalDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'renewables' | 'visualizations'>(
    'renewables',
  )
  const deviceType = () => {
    const { width, height } = Dimensions.get('window')
    return Platform.OS === 'ios' && (width >= 1024 || height >= 1366)
      ? 'ipad'
      : 'iphone'
  }

  const isIpad = deviceType() === 'ipad'
  return (
    <ScrollView
      style={styles.regionInfoContainer}
      contentContainerStyle={{ alignItems: 'flex-start' }}
    >
      <Text style={styles.regionName}>Global Climate Dashboard</Text>
      <Text style={[styles.body, isIpad&&styles.iPadText]}>
        Set default global renewable values and keep track of your progress
        towards meeting 2030 climate goals.{' '}
      </Text>
      <Text style={styles.header}>2030 Climate Goals</Text>
      <Text style={[styles.body, isIpad&&styles.iPadText]}>
        The world aims to keep global warming below 2°C by 2030. We can do this
        through increasing our current renewable capacity from 8 to 12 TW.{' '}
      </Text>
      <View style={styles.trackersWrapper}>
        <Tracker type="temperature" dashboard />
        <Tracker type="renewable" dashboard />
      </View>
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
        // <DistributeRenewables defaultValues={null}/>
        <></>
      ) : (
        <DataVisualizations
          initialData={initialGraphData}
          dynamicData={dynamicGraphData}
          region="Global"
        />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  regionInfoContainer: {
    flex: 1,
    width: '100%',
  },
  regionName: {
    color: '#000',
    fontSize: 28,
    fontFamily: 'Brix Sans',
    fontWeight: '400',
    paddingBottom: 10,
  },
  header: {
    fontFamily: 'Brix Sans',
    fontSize: 24,
    paddingTop: 30,
    paddingBottom: 10,
  },
  body: {
    fontFamily: 'Roboto',
    fontSize: 14,
  },

  trackersWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    marginTop: 16,
    marginBottom: 32,
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
    fontSize: 18
  },
})
