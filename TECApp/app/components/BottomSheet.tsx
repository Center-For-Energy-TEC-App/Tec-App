import React, { useMemo, useEffect, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native'
import BottomSheetTemplate from '@gorhom/bottom-sheet'
import {
  GraphData,
  RegionalMinMaxValues,
  CalculationData,
  getDefaultValues,
  getInitialGraphData,
  getMinMaxValues,
  getCalculationData,
  DefaultValues,
} from '../api/requests'
import { getAbbrv } from '../util/ValueDictionaries'
import {
  TemperatureData,
  calculateCarbonCurve,
  calculateCarbonReductions,
  calculateEnergyCurve,
  calculateInitialCoalGasOil,
  calculateNewGlobalOnReset,
  calculateRegionalCoalGasOil,
  calculateTemperature,
} from '../util/Calculations'
import { DataPoint } from './DataVisualizations/ForecastComparison'
import { storeData } from '../util/Caching'
import { getRegionSummary } from '../util/RegionDescriptions'
import { ToolTipIcon } from '../SVGs/DistributeRenewablesIcons/ToolTipIcon'
import DistributeRenewables from './DistributeRenewables'
import DataVisualizations from './DataVisualizations/DataVisualizations'

export interface BottomSheetProps {
  selectedRegion: string
  passGlobalToHome: (energy: number) => void
  passTemperatureToHome: (temperature: TemperatureData) => void
  tutorialState: number
  setTutorialState: (state: number) => void
  onSwipeDown: () => void
}

export type FossilReductionData = {
  chn: number[]
  nam: number[]
  lam: number[]
  ind: number[]
  sea: number[]
  mea: number[]
  opa: number[]
  eur: number[]
  ssa: number[]
  nee: number[]
}

export type CoalGasOil = {
  coal: number
  gas: number
  oil: number
}

export type CoalGasOilData = {
  chn: CoalGasOil
  nam: CoalGasOil
  lam: CoalGasOil
  ind: CoalGasOil
  sea: CoalGasOil
  mea: CoalGasOil
  opa: CoalGasOil
  eur: CoalGasOil
  ssa: CoalGasOil
  nee: CoalGasOil
}

const regions = [
  'chn',
  'nam',
  'lam',
  'ind',
  'sea',
  'mea',
  'opa',
  'eur',
  'ssa',
  'nee',
]

/**
 * Large file containing handling bulk of data processing relevant to sliders, graph, bars, etc in the Bottom Sheet
 */
export const BottomSheet = ({
  selectedRegion,
  passGlobalToHome,
  passTemperatureToHome,
  tutorialState,
  setTutorialState,
  onSwipeDown,
}: BottomSheetProps) => {
  const snapPoints = useMemo(() => ['12.5%', '25%', '50%', '80%'], [])
  const bottomSheetRef = useRef<BottomSheetTemplate>(null)

  /**
   * see api/requests.ts for specific layout and structure of data objects
   */
  const [initialSliderValues, setInitialSliderValues] =
    useState<DefaultValues>() //default slider values for every region
  const [dynamicSliderValues, setDynamicSliderValues] =
    useState<DefaultValues>() //storage of user changes to sliders
  const [minMaxValues, setMinMaxValues] = useState<RegionalMinMaxValues>() //min-max values for every slider

  const [initialGraphData, setInitialGraphData] = useState<GraphData>() //default graph data
  const [dynamicGraphData, setDynamicGraphData] = useState<GraphData>() //graph data based on user changes to sliders

  const [dynamicFossilData, setDynamicFossilData] = useState<DataPoint[]>() //carbon budget graph data based on user changes to sliders
  const [fossilReductionData, setFossilReductionData] =
    useState<FossilReductionData>() //carbon reduction data (to be applied to fossil data above)

  const [calculationData, setCalculationData] = useState<CalculationData>() //storage of all necessary calculation data for the current region'

  const [coalGasOil, setCoalGasOil] = useState<CoalGasOilData>() //storage of all coal-gas-oil values for every region

  const [activeTab, setActiveTab] = useState<'renewables' | 'visualizations'>(
    'renewables',
  )

  const [modal, setModal] = useState<boolean>(false)

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

  useEffect(() => {
    setActiveTab('renewables')
  }, [selectedRegion])

  //pull all initial data
  useEffect(() => {
    getDefaultValues()
      .then((val) => {
        setInitialSliderValues(val)
        setDynamicSliderValues(val)

        const globalEnergy = calculateTotalGlobalEnergy(val)
        passGlobalToHome(globalEnergy)
        storeData('global-energy', globalEnergy.toString())

        getMinMaxValues()
          .then((val) => {
            setMinMaxValues(val)

            getInitialGraphData()
              .then((val) => {
                setInitialGraphData(val)
                setDynamicGraphData(val)

                storeData('bau-graph-data', JSON.stringify(val.global))
                storeData('dynamic-graph-data', JSON.stringify(val.global))

                getCalculationData()
                  .then((val2) => {
                    setCalculationData(val2)
                    initializeFossilData(val, val2)
                  })
                  .catch(console.error)
              })
              .catch(console.error)
          })
          .catch(console.error)
      })
      .catch(console.error)
  }, [])

  const initializeFossilData = (
    initialGraphData: GraphData,
    calculationData: CalculationData,
  ) => {
    let initialFossilData = []
    initialFossilData.push({ year: 2025, value: 33.29 + (3.8205 + 5.0 - 0.07) })
    initialFossilData.push({ year: 2030, value: 31.6 + (3.815 + 5.0 - 0.19) })
    for (let i = 2035; i <= 2060; i += 5) {
      initialFossilData.push({ year: i, value: 0 })
    }
    initialFossilData = calculateCarbonCurve(0, initialFossilData)
    setDynamicFossilData(initialFossilData)
    storeData('bau-fossil-data', JSON.stringify(initialFossilData))
    storeData('dynamic-fossil-data', JSON.stringify(initialFossilData))

    const initialFossilReductionData = {} as FossilReductionData
    for (const region of regions) {
      initialFossilReductionData[region] = [0, 0, 0, 0, 0, 0]
    }
    setFossilReductionData(initialFossilReductionData)

    const temperatureData = calculateTemperature(initialFossilData)
    passTemperatureToHome(temperatureData)
    storeData('temperature-data', JSON.stringify(temperatureData))

    const initialCoalGasOil = calculateInitialCoalGasOil(
      calculationData,
      initialGraphData,
    )
    setCoalGasOil(initialCoalGasOil)
  }

  const calculateTotalGlobalEnergy = (sliderValues: DefaultValues) => {
    let totalEnergy = 0

    for (const region of regions) {
      const values = sliderValues[region].dynamic
      const regionEnergy =
        values.solar +
        values.wind +
        values.hydropower +
        values.biomass +
        values.geothermal +
        values.nuclear

      totalEnergy += regionEnergy
    }

    return totalEnergy
  }

  //on slider change for a region, store changes here to preserve each region changes
  const onSliderChange = (val, technologyChanged) => {
    //store new slider values
    const newSliderValues = {
      ...dynamicSliderValues,
      [getAbbrv(selectedRegion)]: {
        ...dynamicSliderValues[getAbbrv(selectedRegion)],
        dynamic: val,
      },
    }
    setDynamicSliderValues(newSliderValues)

    const newGlobalEnergy = calculateTotalGlobalEnergy(newSliderValues)

    passGlobalToHome(newGlobalEnergy)
    storeData('global-energy', newGlobalEnergy.toString())

    const {
      regionalGraphData,
      globalGraphData,
    } = //calculate new graph (excluding carbon budget) data for current region and global using new slider values
      calculateEnergyCurve(
        val[technologyChanged],
        technologyChanged,
        dynamicGraphData[getAbbrv(selectedRegion)],
        dynamicGraphData.global,
        calculationData[getAbbrv(selectedRegion)],
      )

    setDynamicGraphData({
      ...dynamicGraphData,
      [getAbbrv(selectedRegion)]: regionalGraphData,
      global: globalGraphData,
    })
    storeData('dynamic-graph-data', JSON.stringify(globalGraphData))

    //calculate new carbon reduction values for global dashboard graph (and CO2 reduction bar)
    const newFossilReduction = calculateCarbonReductions(
      getAbbrv(selectedRegion),
      calculationData[getAbbrv(selectedRegion)],
      regionalGraphData,
    )

    const newFossilData = calculateCarbonCurve(
      newFossilReduction[5] - fossilReductionData[getAbbrv(selectedRegion)][5],
      dynamicFossilData,
    )

    setDynamicFossilData(newFossilData)

    storeData('dynamic-fossil-data', JSON.stringify(newFossilData))

    setFossilReductionData({
      ...fossilReductionData,
      [getAbbrv(selectedRegion)]: newFossilReduction,
    })

    //calculate new temperature data
    const temperatureData = calculateTemperature(newFossilData)
    passTemperatureToHome(temperatureData)
    storeData('temperature-data', JSON.stringify(temperatureData))

    //calculate coal-gas-oil for current region
    setCoalGasOil({
      ...coalGasOil,
      [getAbbrv(selectedRegion)]: calculateRegionalCoalGasOil(
        calculationData[getAbbrv(selectedRegion)],
        regionalGraphData,
        getAbbrv(selectedRegion),
      ),
    })
  }

  //when reset button is clicked within region
  const onReset = () => {
    const newSliderValues = {
      ...dynamicSliderValues,
      [getAbbrv(selectedRegion)]: initialSliderValues[getAbbrv(selectedRegion)],
    }
    setDynamicSliderValues(newSliderValues)

    const newGlobalEnergy = calculateTotalGlobalEnergy(newSliderValues)
    passGlobalToHome(newGlobalEnergy)
    storeData('global-energy', newGlobalEnergy.toString())

    const newGlobalGraphData = calculateNewGlobalOnReset(
      initialGraphData[getAbbrv(selectedRegion)],
      dynamicGraphData[getAbbrv(selectedRegion)],
      dynamicGraphData.global,
    )
    setDynamicGraphData({
      ...dynamicGraphData,
      [getAbbrv(selectedRegion)]: initialGraphData[getAbbrv(selectedRegion)],
      global: newGlobalGraphData,
    })
    storeData('dynamic-graph-data', JSON.stringify(newGlobalGraphData))

    const newFossilData = calculateCarbonCurve(
      0 - fossilReductionData[getAbbrv(selectedRegion)][5],
      dynamicFossilData,
    )

    setDynamicFossilData(newFossilData)

    storeData('dynamic-fossil-data', JSON.stringify(newFossilData))

    setFossilReductionData({
      ...fossilReductionData,
      [getAbbrv(selectedRegion)]: [0, 0, 0, 0, 0, 0],
    })

    const temperatureData = calculateTemperature(newFossilData)
    passTemperatureToHome(temperatureData)
    storeData('temperature-data', JSON.stringify(temperatureData))
    setCoalGasOil({
      ...coalGasOil,
      [getAbbrv(selectedRegion)]: calculateRegionalCoalGasOil(
        calculationData[getAbbrv(selectedRegion)],
        initialGraphData[getAbbrv(selectedRegion)],
        getAbbrv(selectedRegion),
      ),
    })
  }

  //update regional calculation data on region select
  useEffect(() => {
    if (selectedRegion !== 'Global') {
      bottomSheetRef.current?.snapToIndex(3) // Snap to 80% when a region is selected
    } else {
      bottomSheetRef.current?.close()
    }
  }, [selectedRegion])

  return (
    <BottomSheetTemplate
      index={-1}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableHandlePanningGesture
      enableContentPanningGesture
      enablePanDownToClose
      onClose={onSwipeDown}
    >
      {dynamicFossilData &&
      fossilReductionData &&
      coalGasOil &&
      calculationData && //don't render regional sheet until all values load
      selectedRegion !== 'Global' ? (
        <View style={styles.contentContainer}>
          <View style={styles.regionInfoContainer}>
            <TouchableOpacity
              style={styles.regionHeader}
              onPress={() => setModal(true)}
            >
              {renderTooltip(getRegionSummary(selectedRegion))}
              <Text style={styles.regionName}>{selectedRegion}</Text>
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
              <DistributeRenewables
                currRegion={selectedRegion}
                values={dynamicSliderValues[getAbbrv(selectedRegion)]}
                minMaxValues={minMaxValues[getAbbrv(selectedRegion)]}
                onSliderChange={onSliderChange}
                onReset={onReset}
                disabled={
                  calculationData[getAbbrv(selectedRegion)].region !==
                  getAbbrv(selectedRegion) //don't let sliders be changed until region calculation data is updated}
                }
                tutorialState={tutorialState}
                setTutorialState={setTutorialState}
                coalGasOil={coalGasOil[getAbbrv(selectedRegion)]}
                graphData={dynamicGraphData[getAbbrv(selectedRegion)]}
                carbonReduction={fossilReductionData[
                  getAbbrv(selectedRegion)
                ].reduce((a: number, b: number) => a + b, 0)}
                calculationData={calculationData[getAbbrv(selectedRegion)]}
              />
            ) : (
              <DataVisualizations
                initialData={initialGraphData}
                dynamicData={dynamicGraphData}
                region={selectedRegion}
              />
            )}
          </View>
        </View>
      ) : (
        <></>
      )}
    </BottomSheetTemplate>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 3,
  },
  regionInfoContainer: {
    flex: 1,
    width: '100%',
    // alignItems: 'flex-start',
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
    width: 30,
    height: 30,
    paddingTop: 5,
    //  backgroundColor: "red"
  },
  tooltipCloseButtonText: {
    fontSize: 16,
    color: '#000',
  },
})
