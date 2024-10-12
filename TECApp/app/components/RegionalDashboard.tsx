import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native'
import DistributeRenewables from './DistributeRenewables'
import DataVisualizations from './DataVisualizations/DataVisualizations'
import { DefaultValues, GraphData, MinMaxValues } from '../api/requests'
import { ToolTipIcon } from '../SVGs/DistributeRenewablesIcons/ToolTipIcon'

type RegionalDashboardProps = {
  currRegion: string
  sliderValues: DefaultValues
  minMaxValues: MinMaxValues
  onSliderChange: (val: DefaultValues, technologyChanged: string) => void
  onReset: () => void
  initialGraphData: GraphData
  dynamicGraphData: GraphData
  sliderDisabled: boolean
  slidersRef: React.RefObject<View>
  bauRef: React.RefObject<View>
  regionalComparisonRef: React.RefObject<View>
  technologyComparisonRef: React.RefObject<View>
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
  slidersRef,
  bauRef,
  regionalComparisonRef,
  technologyComparisonRef,
}: RegionalDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'renewables' | 'visualizations'>(
    'renewables',
  )

  const [modal, setModal] = useState<boolean>(false)

  useEffect(() => {
    setActiveTab('renewables')
  }, [currRegion])

  const deviceType = () => {
    const { width, height } = Dimensions.get('window')
    return Platform.OS === 'ios' && (width >= 1024 || height >= 1366)
      ? 'ipad'
      : 'iphone'
  }

  const isIpad = deviceType() === 'ipad'

  const renderTooltip = (text: string) => (
    <Modal
      transparent={true}
      visible={modal}
      onRequestClose={() => setModal(false)}
    >
      <View style={styles.tooltipOverlay}>
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{text}</Text>
          <TouchableOpacity
            style={styles.tooltipCloseButton}
            onPress={() => setModal(false)}
          >
            <Text style={styles.tooltipCloseButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={styles.regionInfoContainer}>
      <TouchableOpacity
        style={styles.regionHeader}
        onPress={() => setModal(true)}
      >
        {renderTooltip(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        )}
        <Text style={styles.regionName}>{currRegion}</Text>
        <ToolTipIcon header />
      </TouchableOpacity>
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
        <View ref={slidersRef} collapsable={false}>
          <DistributeRenewables
            values={sliderValues}
            minMaxValues={minMaxValues}
            onSliderChange={onSliderChange}
            onReset={onReset}
            disabled={sliderDisabled}
          />
        </View>
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
  regionHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 4,
  },
  regionName: {
    color: '#000',
    fontSize: 28,
    fontFamily: 'Brix Sans',
    fontWeight: '400',
    paddingBottom: 6,
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
  tooltipOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tooltip: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    position: 'relative',
  },
  tooltipText: {
    fontSize: 16,
    color: '#000',
  },
  tooltipCloseButton: {
    position: 'absolute',
    top: 10,
    right: 5,
    display: 'flex',
    alignItems: 'center',
    width: 20,
    height: 20,
  },
  tooltipCloseButtonText: {
    fontSize: 16,
    color: '#000',
  },
})
