import React, { useEffect, useState } from 'react'

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Dimensions,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Slider } from '@miblanchard/react-native-slider'
import { WindIcon } from '../SVGs/DistributeRenewablesIcons/WindIcon'
import { SolarIcon } from '../SVGs/DistributeRenewablesIcons/SolarIcon'
import { HydroIcon } from '../SVGs/DistributeRenewablesIcons/HydroIcon'
import { BiomassIcon } from '../SVGs/DistributeRenewablesIcons/BiomassIcon'
import { GeothermalIcon } from '../SVGs/DistributeRenewablesIcons/GeothermalIcon'
import { NuclearIcon } from '../SVGs/DistributeRenewablesIcons/NuclearIcon'
import { ToolTipIcon } from '../SVGs/DistributeRenewablesIcons/ToolTipIcon'
import Svg, { Path, Rect } from 'react-native-svg'
import { getEnergyAbbrv, getTechnologyColor } from '../util/ValueDictionaries'
import { DefaultValues, MinMaxValues } from '../api/requests'
import { NativeViewGestureHandler } from 'react-native-gesture-handler'
import { SliderIndicator } from '../SVGs/SliderIndicator'
import { Tooltip5 } from '../SVGs/TutorialPopups/Tooltip5'
import { getRegionTechnologySummary } from '../util/RegionDescriptions'

export type TechnologyProportions = {
  solar: number
  wind: number
  hydropower: number
  biomass: number
  geothermal: number
  nuclear: number
}

type DistributeRenewablesProps = {
  currRegion: string
  values: DefaultValues
  minMaxValues: MinMaxValues
  onSliderChange: (val: DefaultValues, technologyChanged: string) => void
  onReset: () => void
  disabled: boolean
  tutorialState: number
  setTutorialState: (state: number) => void
}

const DistributeRenewables = ({
  currRegion,
  values,
  minMaxValues,
  onSliderChange,
  onReset,
  disabled,
  tutorialState,
  setTutorialState,
}: DistributeRenewablesProps) => {
  const [selectedSlider, setSelectedSlider] = useState<string | null>(null)
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null)

  const [renderTutorial, setRenderTutorial] = useState<boolean>()

  const deviceType = () => {
    const { width, height } = Dimensions.get('window')
    return Platform.OS === 'ios' && (width >= 1024 || height >= 1366)
      ? 'ipad'
      : 'iphone'
  }

  const isIpad = deviceType() === 'ipad'

  const [sliderValues, setSliderValues] = useState<DefaultValues>(values[2])

  const [proportionBarWidth, setProportionBarWidth] = //actual pixel width of proportion bar (based on parent div)
    useState<number>(undefined)
  const [technologyProportions, setTechnologyProportions] = //pixel width values of each technology for proportion bar
    useState<TechnologyProportions>(undefined)

  const [globalEnergyProportion, setGlobalEnergyProportion] = useState<number>()

  useEffect(() => {
    setSliderValues(values[2])
    console.log(tutorialState)
    if (tutorialState === 9) {
      setRenderTutorial(true)
    }
  }, [values])

  //calculate proportion bar values on every slider change
  useEffect(() => {
    if (proportionBarWidth) {
      const sliderTotal =
        sliderValues.wind_gw +
        sliderValues.solar_gw +
        sliderValues.hydro_gw +
        sliderValues.bio_gw +
        sliderValues.geo_gw +
        sliderValues.nuclear_gw

      setTechnologyProportions({
        wind: (sliderValues.wind_gw / sliderTotal) * (proportionBarWidth - 5),
        solar: (sliderValues.solar_gw / sliderTotal) * (proportionBarWidth - 5),
        hydropower:
          (sliderValues.hydro_gw / sliderTotal) * (proportionBarWidth - 5),
        biomass: (sliderValues.bio_gw / sliderTotal) * (proportionBarWidth - 5),
        geothermal:
          (sliderValues.geo_gw / sliderTotal) * (proportionBarWidth - 5),
        nuclear:
          (sliderValues.nuclear_gw / sliderTotal) * (proportionBarWidth - 5),
      })

      setGlobalEnergyProportion((sliderTotal / 12000) * proportionBarWidth)
    }
  }, [sliderValues, proportionBarWidth])

  const renderTrackMark = (index: number, mark: string) => (
    <View style={styles.trackMarkContainer} key={index}>
      <View style={styles.trackMark} />
      {mark === '2025' ? (
        <SliderIndicator color="#F05B4A"></SliderIndicator>
      ) : (
        <SliderIndicator color="#6DB6FB"></SliderIndicator>
      )}
    </View>
  )

  const toggleTooltip = (label: string) => {
    setVisibleTooltip(visibleTooltip === label ? null : label)
  }

  const renderTooltip = (label: string, text: string) => (
    <Modal
      transparent={true}
      visible={visibleTooltip === label}
      onRequestClose={() => setVisibleTooltip(null)}
    >
      <View style={styles.tooltipOverlay}>
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{text}</Text>
          <TouchableOpacity
            style={styles.tooltipCloseButton}
            onPress={() => setVisibleTooltip(null)}
          >
            <Text style={styles.tooltipCloseButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  const renderSlider = (label, IconComponent, tooltip) => (
    <View style={styles.sliderContainer}>
      <TouchableOpacity
        onPress={() => toggleTooltip(label)}
        style={styles.labelContainer}
      >
        <IconComponent width={22} height={22} />
        <Text style={styles.label}>
          {label === 'Nuclear' ? 'Nuclear*' : label}
        </Text>
        <ToolTipIcon />
      </TouchableOpacity>

      {renderTooltip(label, tooltip)}
      <View style={styles.sliderWrapper}>
        <NativeViewGestureHandler disallowInterruption>
          <Slider
            trackStyle={{ height: 3 }}
            disabled={disabled}
            trackClickable={false}
            thumbTouchSize={{ width: 50, height: 25 }}
            containerStyle={styles.slider}
            minimumValue={Math.round(
              parseFloat(minMaxValues.min[label.toLowerCase()]),
            )}
            maximumValue={Math.round(
              parseFloat(minMaxValues.max[label.toLowerCase()]),
            )}
            value={sliderValues[getEnergyAbbrv(label.toLowerCase())]}
            step={1.0}
            thumbTintColor={
              selectedSlider === label ? getTechnologyColor(label) : '#B5B1AA'
            }
            minimumTrackTintColor={getTechnologyColor(label)}
            maximumTrackTintColor="#B5B1AA"
            trackMarks={[
              values[0][getEnergyAbbrv(label.toLowerCase())] + //add slight offset because the trackmark div is wider than the trackmark itself
                0.0275 *
                  (parseFloat(minMaxValues.max[label.toLowerCase()]) -
                    parseFloat(minMaxValues.min[label.toLowerCase()])),
              values[1][getEnergyAbbrv(label.toLowerCase())] +
                0.0275 *
                  (parseFloat(minMaxValues.max[label.toLowerCase()]) -
                    parseFloat(minMaxValues.min[label.toLowerCase()])),
            ]}
            renderTrackMarkComponent={(index) =>
              renderTrackMark(
                index,
                values[0][getEnergyAbbrv(label.toLowerCase())] < //ordering based on which value (2024 or bau) is higher
                  values[1][getEnergyAbbrv(label.toLowerCase())]
                  ? ['2025', '2030'][index]
                  : ['2030', '2025'][index],
              )
            }
            onSlidingStart={() => {
              setSelectedSlider(label)
            }}
            //just change local state during sliding
            onValueChange={(val) =>
              setSliderValues({
                ...sliderValues,
                [getEnergyAbbrv(label.toLowerCase())]: val[0],
              })
            }
            //callback once sliding is complete (to send changed data back up to BottomSheet)
            onSlidingComplete={(val) => {
              onSliderChange(
                {
                  ...sliderValues,
                  [getEnergyAbbrv(label.toLowerCase())]: val[0],
                },
                label.toLowerCase(),
              )
            }}
          />
        </NativeViewGestureHandler>
        <View style={styles.sliderValueBox}>
          <Text style={styles.sliderValue}>
            {Math.round(sliderValues[getEnergyAbbrv(label.toLowerCase())]) +
              ' GW'}
          </Text>
        </View>
      </View>
    </View>
  )

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      stickyHeaderIndices={[2]}
    >
      <Text style={[styles.description, isIpad && styles.iPadText]}>
        Using the sliders below, make region specific changes for each renewable
        energy source to reach 12 TW of renewable capacity. This will override
        default values set in the global dashboard.
      </Text>
      <View style={styles.capacityProportionContainer}>
        <Text style={styles.capacityProportionText}>
          Region&apos;s Contribution to 12 TW Goal
        </Text>
        {proportionBarWidth && globalEnergyProportion ? (
          <Svg height={20}>
            <Rect
              x={0}
              y={0}
              width={proportionBarWidth}
              height={20}
              fill="#DEDCD9"
            />
            <Rect
              x={0}
              y={0}
              width={globalEnergyProportion}
              height={20}
              fill="#266297"
            />
            <Path
              d="M 0 4 Q 0.5 0.5 4 0 L 0 0 z"
              strokeWidth={0.1}
              stroke="white"
              fill="white"
            />
            <Path
              d="M 0 16 Q 0.5 19.5 4 20 L 0 20 z"
              strokeWidth={0.1}
              stroke="white"
              fill="white"
            />
            <Path
              d={`M ${proportionBarWidth - 4} 0 Q ${proportionBarWidth - 0.5} 0.5 ${proportionBarWidth} 4 L ${proportionBarWidth} 0 z`}
              strokeWidth={0.1}
              stroke="white"
              fill="white"
            />
            <Path
              d={`M ${proportionBarWidth} 16 Q ${proportionBarWidth - 0.5} 19.5 ${proportionBarWidth - 4} 20 L ${proportionBarWidth} 20 z`}
              strokeWidth={0.1}
              stroke="white"
              fill="white"
            />
          </Svg>
        ) : (
          <></>
        )}
      </View>
      <View
        style={styles.capacityProportionContainer}
        onLayout={(event) => {
          setProportionBarWidth(event.nativeEvent.layout.width - 20)
        }}
      >
        <Text style={styles.capacityProportionText}>
          Renewable Capacity Proportions
        </Text>
        {proportionBarWidth && technologyProportions ? (
          <Svg height={20}>
            <Rect
              x={0}
              y={0}
              width={technologyProportions.wind}
              height={20}
              fill="#C66AAA"
            />
            <Rect
              x={technologyProportions.wind}
              y={0}
              width={technologyProportions.solar}
              height={20}
              fill="#F8CE46"
            />
            <Rect
              x={technologyProportions.wind + technologyProportions.solar}
              y={0}
              width={technologyProportions.hydropower}
              height={20}
              fill="#58C4D4"
            />
            <Rect
              x={
                technologyProportions.wind +
                technologyProportions.solar +
                technologyProportions.hydropower
              }
              y={0}
              width={technologyProportions.biomass}
              height={20}
              fill="#779448"
            />
            <Rect
              x={
                technologyProportions.wind +
                technologyProportions.solar +
                technologyProportions.hydropower +
                technologyProportions.biomass
              }
              y={0}
              width={technologyProportions.geothermal}
              height={20}
              fill="#BF9336"
            />
            <Rect
              x={
                technologyProportions.wind +
                technologyProportions.solar +
                technologyProportions.hydropower +
                technologyProportions.biomass +
                technologyProportions.geothermal
              }
              y={0}
              width={5}
              height={20}
              fill="white"
            />
            <Rect
              x={
                technologyProportions.wind +
                technologyProportions.solar +
                technologyProportions.hydropower +
                technologyProportions.biomass +
                technologyProportions.geothermal +
                5
              }
              y={0}
              width={technologyProportions.nuclear}
              height={20}
              fill="#EE8E35"
            />
            <Path
              d="M 0 4 Q 0.5 0.5 4 0 L 0 0 z"
              strokeWidth={0.1}
              stroke="white"
              fill="white"
            />
            <Path
              d="M 0 16 Q 0.5 19.5 4 20 L 0 20 z"
              strokeWidth={0.1}
              stroke="white"
              fill="white"
            />
            <Path
              d={`M ${proportionBarWidth - 4} 0 Q ${proportionBarWidth - 0.5} 0.5 ${proportionBarWidth} 4 L ${proportionBarWidth} 0 z`}
              strokeWidth={0.1}
              stroke="white"
              fill="white"
            />
            <Path
              d={`M ${proportionBarWidth} 16 Q ${proportionBarWidth - 0.5} 19.5 ${proportionBarWidth - 4} 20 L ${proportionBarWidth} 20 z`}
              strokeWidth={0.1}
              stroke="white"
              fill="white"
            />
          </Svg>
        ) : (
          <></>
        )}
      </View>
      <View style={styles.sliderIndicatorRow}>
        <View style={styles.sliderIndicator}>
          <SliderIndicator color="#F05B4A" />
          <Text style={{ fontSize: 12 }}>2025</Text>
        </View>
        <View style={styles.sliderIndicator}>
          <SliderIndicator color="#6DB6FB" />
          <Text style={{ fontSize: 12 }}>2030 Forecast</Text>
        </View>
      </View>
      {/* </View> */}
      {renderSlider(
        'Wind',
        WindIcon,
        <Text>{getRegionTechnologySummary(currRegion, 'Wind')}</Text>,
      )}
      {renderTutorial && (
        <>
          <View
            style={{ shadowColor: 'gray', shadowRadius: 5, shadowOpacity: 0.5 }}
          >
            <Tooltip5 />
          </View>
          <View style={styles.onBoardingButtonWrapper}>
            <TouchableOpacity
              style={styles.onboardingButton}
              onPress={() => {
                setRenderTutorial(false)
                setTutorialState(10)
              }}
            >
              <Text style={styles.onboardingButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {renderSlider(
        'Solar',
        SolarIcon,
        <Text>{getRegionTechnologySummary(currRegion, 'Solar')}</Text>,
      )}
      {renderSlider(
        'Hydropower',
        HydroIcon,
        <Text>{getRegionTechnologySummary(currRegion, 'Hydropower')}</Text>,
      )}
      {renderSlider(
        'Biomass',
        BiomassIcon,
        <Text>{getRegionTechnologySummary(currRegion, 'Biomass')}</Text>,
      )}
      {renderSlider(
        'Geothermal',
        GeothermalIcon,
        <Text>{getRegionTechnologySummary(currRegion, 'Geothermal')}</Text>,
      )}
      {renderSlider(
        'Nuclear',
        NuclearIcon,
        <Text>{getRegionTechnologySummary(currRegion, 'Nuclear')}</Text>,
      )}

      <Text style={[styles.nuclearNote, isIpad && styles.iPadText]}>
        {' '}
        *Not a renewable energy source, but supports carbon reduction goals by
        reducing reliance on fossil fuels.
      </Text>

      <TouchableOpacity onPress={onReset} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>
          Reset to 2030 Forecast Values
        </Text>
      </TouchableOpacity>
      <View style={styles.spacer}></View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    marginTop: 2,
    padding: 4,
    flexGrow: 1,
  },
  description: {
    color: '#000',
    fontFamily: 'Roboto',
    fontSize: 14,
    marginBottom: 16,
  },
  iPadText: {
    fontSize: 18,
  },
  capacityProportionContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 16,
    marginBottom: 16,
    gap: 10,
    alignSelf: 'stretch',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6.1,
    elevation: 3,
  },
  capacityProportionText: {
    color: '#000',
    fontFamily: 'Roboto',
    fontSize: 18,
  },
  bar: {
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '50%',
    paddingBottom: 10,
    gap: 8,
  },
  label: {
    color: '#000',
    fontSize: 18,
    fontWeight: '400',
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
  sliderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    // backgroundColor: "red",
  },
  sliderValueBox: {
    marginLeft: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    width: 75,
    display: 'flex',
    alignItems: 'center',
  },
  sliderValue: {
    color: '#000',
    fontSize: 14,
  },
  spacer: {
    marginTop: 100,
  },
  nuclearNote: {
    color: '#757678',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 17,
  },
  resetButton: {
    display: 'flex',
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#B5B1AA',
  },
  resetButtonText: {
    color: '#B5B1AA',
    fontSize: 18,
    fontWeight: '400',
  },
  trackMarkContainer: {
    paddingTop: 10,
    gap: 4,
    alignItems: 'center',
  },
  trackMark: {
    width: 1,
    height: 25,
    backgroundColor: '#B5B1AA',
  },
  trackMarkLabel: {
    marginTop: 3,
    color: '#B5B1AA',
    fontSize: 17,
  },
  sliderIndicatorRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 14,
  },
  sliderIndicator: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  onBoardingButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // backgroundColor: 'red',
    width: 240,
    marginBottom: 10,
  },

  onboardingButton: {
    backgroundColor: '#266297',
    borderColor: '#1C2B47',
    borderWidth: 1,
    borderRadius: 4,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },

  onboardingButtonText: {
    fontFamily: 'Brix Sans',
    color: 'white',
    fontSize: 16,
  },
})

export default DistributeRenewables
