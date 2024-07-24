import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import DistributeRenewables from './DistributeRenewables'
import DataVisualizations from './DataVisualizations/DataVisualizations'
import { Tracker } from './Tracker'

export const GlobalDashboard = () => {
  const [activeTab, setActiveTab] = useState<'renewables' | 'visualizations'>(
    'renewables',
  )
  return (
    <View style={styles.regionInfoContainer}>
      <Text style={styles.regionName}>Global Climate Dashboard</Text>
      <Text style={styles.body}>
        Set default global renewable values and keep track of your progress
        towards meeting 2030 climate goals.{' '}
      </Text>
      <Text style={styles.header}>2030 Climate Goals</Text>
      <Text style={styles.body}>
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
        <DataVisualizations region="Global" />
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
})
