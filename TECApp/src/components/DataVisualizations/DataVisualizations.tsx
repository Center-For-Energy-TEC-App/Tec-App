import React, { useState } from 'react'
import { Text, StyleSheet, View, ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { BAUComparison, DataPoint } from './BAUComparison'
import { RegionalComparison } from './RegionalComparison'
import { CarbonBudget } from './CarbonBudget'
import { GraphData } from '../BottomSheet'
import { TechnologyComparison } from './TechnologyComparison'
import { getAbbrv } from '../../util/ValueDictionaries'

type DataVisualizationsProps = {
  region: string
  initialData: GraphData,
  dynamicData: GraphData
}
const DataVisualizations = ({ region, initialData, dynamicData }: DataVisualizationsProps) => {
  const [activeButton, setActiveButton] = useState('BAU Comparison')

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ display: 'flex', alignItems: 'flex-start' }}
    >
      <View style={styles.buttonsWrapper}>
        <ScrollView horizontal={true}>
          <TouchableOpacity
            onPress={() => setActiveButton('BAU Comparison')}
            style={
              activeButton === 'BAU Comparison'
                ? styles.activeButton
                : styles.inactiveButton
            }
          >
            <Text
              style={
                activeButton === 'BAU Comparison'
                  ? styles.activeButtonText
                  : styles.inactiveButtonText
              }
            >
              BAU Comparison
            </Text>
          </TouchableOpacity>
          {region === 'Global' ? (
            <TouchableOpacity
              onPress={() => setActiveButton('Carbon Budget')}
              style={
                activeButton === 'Carbon Budget'
                  ? styles.activeButton
                  : styles.inactiveButton
              }
            >
              <Text
                style={
                  activeButton === 'Carbon Budget'
                    ? styles.activeButtonText
                    : styles.inactiveButtonText
                }
              >
                Carbon Budget
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setActiveButton('Regional Comparison')}
              style={
                activeButton === 'Regional Comparison'
                  ? styles.activeButton
                  : styles.inactiveButton
              }
            >
              <Text
                style={
                  activeButton === 'Regional Comparison'
                    ? styles.activeButtonText
                    : styles.inactiveButtonText
                }
              >
                Regional Comparison
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
              onPress={() => setActiveButton('Technology Comparison')}
              style={
                activeButton === 'Technology Comparison'
                  ? styles.activeButton
                  : styles.inactiveButton
              }
            >
              <Text
                style={
                  activeButton === 'Technology Comparison'
                    ? styles.activeButtonText
                    : styles.inactiveButtonText
                }
              >
                Technology Comparison
              </Text>
            </TouchableOpacity>
        </ScrollView>
      </View>
      {activeButton === 'BAU Comparison' ? (
        <BAUComparison region={region} BAUData={initialData[getAbbrv(region)]} dynamicData={dynamicData[getAbbrv(region)]} />
      ) : activeButton === 'Regional Comparison' ? (
        <RegionalComparison region={region} data={dynamicData} />
      ) : activeButton === 'Carbon Budget' ?(
        <CarbonBudget />
      ): (
        <TechnologyComparison region={region} data={dynamicData[getAbbrv(region)]}/>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  text: {
    color: '#000',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
  },
  buttonsWrapper: {
    marginTop: 30,
    marginBottom: 10,
    height: 50,
  },
  activeButton: {
    display: 'flex',
    borderRadius: 26,
    backgroundColor: '#266297',
    borderColor: '#266297',
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  inactiveButton: {
    borderRadius: 26,
    backgroundColor: '#FFF',
    borderColor: '#266297',
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  activeButtonText: {
    color: '#FFF',
    fontFamily: 'Roboto',
    fontSize: 14,
  },
  inactiveButtonText: {
    color: '#266297',
    fontFamily: 'Roboto',
    fontSize: 14,
  },
})

export default DataVisualizations
