import React, { useState } from 'react'
import { Text, StyleSheet, View, ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { BAUComparison } from './BAUComparison'
import { RegionalComparison } from './RegionalComparison'

type DataVisualizationsProps = {
  region: string
}
const DataVisualizations = ({ region }: DataVisualizationsProps) => {
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
        </ScrollView>
      </View>
      {activeButton === 'BAU Comparison' ? (
        <BAUComparison region={region} />
      ) : (
        <RegionalComparison region={region} />
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
    marginVertical: 28,
    height: 36,
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
