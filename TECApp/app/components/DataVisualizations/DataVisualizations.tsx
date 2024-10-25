import React, { useEffect, useRef, useState } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { BAUComparison, DataPoint } from './BAUComparison'
import { RegionalComparison } from './RegionalComparison'
import { CarbonBudget } from './CarbonBudget'
import { TechnologyComparison } from './TechnologyComparison'
import { getAbbrv } from '../../util/ValueDictionaries'
import { GraphData, RegionData } from '../../api/requests'
import { TemperatureData } from '../../util/Calculations'

type DataVisualizationsProps = {
  region: string
  initialData?: GraphData
  dynamicData?: GraphData
  initialGlobalData?: RegionData
  dynamicGlobalData?: RegionData
  initialFossilData?: DataPoint[]
  dynamicFossilData?: DataPoint[]
  temperatureData?: TemperatureData
  isInteracting?: (interacting: boolean) => void
  bauRef?: React.RefObject<View>
  carbonRef?: React.RefObject<View>
  technologyRef?: React.RefObject<View>
}
const DataVisualizations = ({
  region,
  initialData,
  dynamicData,
  initialGlobalData,
  dynamicGlobalData,
  initialFossilData,
  dynamicFossilData,
  temperatureData,
  isInteracting,
  bauRef,
  carbonRef,
  technologyRef,
}: DataVisualizationsProps) => {
  const [activeButton, setActiveButton] = useState(
    region === 'Global' ? 'Carbon Budget' : 'Forecast Comparison',
  )
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(true)
  const scrollViewRef = useRef(null)

  useEffect(() => {
    setTimeout(function () {
      scrollViewRef.current?.flashScrollIndicators()
    }, 500)
  }, [activeButton])

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ display: 'flex', alignItems: 'flex-start' }}
      scrollEnabled={scrollEnabled}
    >
      <View style={styles.buttonsWrapper}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          persistentScrollbar={true}
          ref={scrollViewRef}
        >
          {region === 'Global' && (
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
          )}
          <TouchableOpacity
            onPress={() => setActiveButton('Forecast Comparison')}
            style={
              activeButton === 'Forecast Comparison'
                ? styles.activeButton
                : styles.inactiveButton
            }
          >
            <Text
              style={
                activeButton === 'Forecast Comparison'
                  ? styles.activeButtonText
                  : styles.inactiveButtonText
              }
            >
              Forecast Comparison
            </Text>
          </TouchableOpacity>

          {region !== 'Global' && (
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
      {activeButton === 'Forecast Comparison' ? (
        <BAUComparison
          bauRef={bauRef}
          region={region}
          BAUData={
            initialGlobalData
              ? initialGlobalData
              : initialData[getAbbrv(region)]
          }
          dynamicData={
            dynamicGlobalData
              ? dynamicGlobalData
              : dynamicData[getAbbrv(region)]
          }
        />
      ) : activeButton === 'Regional Comparison' ? (
        <RegionalComparison region={region} data={dynamicData} />
      ) : activeButton === 'Carbon Budget' ? (
        <CarbonBudget
          carbonRef={carbonRef}
          BAUData={initialFossilData}
          dynamicData={dynamicFossilData}
          temperatureData={temperatureData}
          isInteracting={(interacting) => {
            setScrollEnabled(!interacting)
            isInteracting(interacting)
          }}
        />
      ) : (
        <TechnologyComparison
          technologyRef={technologyRef}
          data={
            dynamicGlobalData
              ? dynamicGlobalData
              : dynamicData[getAbbrv(region)]
          }
        />
      )}

      {region === 'Global' && (
        <View style={styles.hidden}>
          <View>
            <BAUComparison
              bauRef={bauRef}
              region={region}
              BAUData={
                initialGlobalData
                  ? initialGlobalData
                  : initialData[getAbbrv(region)]
              }
              dynamicData={
                dynamicGlobalData
                  ? dynamicGlobalData
                  : dynamicData[getAbbrv(region)]
              }
            />
          </View>

          <View>
            <CarbonBudget
              carbonRef={carbonRef}
              BAUData={initialFossilData}
              dynamicData={dynamicFossilData}
              temperatureData={temperatureData}
              isInteracting={(interacting) => {
                setScrollEnabled(!interacting)
                isInteracting(interacting)
              }}
            />
          </View>

          <View>
            <TechnologyComparison
              technologyRef={technologyRef}
              data={
                dynamicGlobalData
                  ? dynamicGlobalData
                  : dynamicData[getAbbrv(region)]
              }
            />
          </View>
        </View>
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
  hidden: {
    position: 'absolute',
    top: -9999,
    left: -9999,
  },
})

export default DataVisualizations
