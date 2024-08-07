import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native'
import { Slider } from '@miblanchard/react-native-slider'
import { WindIcon } from '../SVGs/DistributeRenewablesIcons/WindIcon'
import { SolarIcon } from '../SVGs/DistributeRenewablesIcons/SolarIcon'
import { HydroIcon } from '../SVGs/DistributeRenewablesIcons/HydroIcon'
import { BiomassIcon } from '../SVGs/DistributeRenewablesIcons/BiomassIcon'
import { GeothermalIcon } from '../SVGs/DistributeRenewablesIcons/GeothermalIcon'
import { NuclearIcon } from '../SVGs/DistributeRenewablesIcons/NuclearIcon'
import { ToolTipIcon } from '../SVGs/DistributeRenewablesIcons/ToolTipIcon'
import { DefaultValues, MinMaxValues } from './BottomSheet'
import Svg, { Rect } from 'react-native-svg'

export type SliderProportions = {
  solar: number
  wind: number
  hydropower: number
  biomass: number
  geothermal: number
  nuclear: number
}

type DistributeRenewablesProps = {
  values: DefaultValues
  minMaxValues: MinMaxValues
  onSliderChange: (val: DefaultValues) => void
  onReset: () => void
}

const energyMap = {
  solar: 'solar_gw',
  wind: 'wind_gw',
  hydropower: 'hydro_gw',
  biomass: 'bio_gw',
  geothermal: 'geo_gw',
  nuclear: 'nuclear_gw',
}

const DistributeRenewables = ({
  values,
  minMaxValues,
  onSliderChange,
  onReset,
}: DistributeRenewablesProps) => {
  const [selectedSlider, setSelectedSlider] = useState<string | null>(null)
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null)

  const [proportionBarWidth, setProportionBarWidth] =
    useState<number>(undefined)

  const [sliderValues, setSliderValues] = useState<DefaultValues>(values[2])

  const [sliderProportions, setSliderProportions] =
    useState<SliderProportions>(undefined)

  useEffect(() => {
    setSliderValues(values[2])
  }, [values])

  useEffect(() => {
    if (proportionBarWidth) {
      const sliderTotal =
        sliderValues.wind_gw +
        sliderValues.solar_gw +
        sliderValues.hydro_gw +
        sliderValues.bio_gw +
        sliderValues.geo_gw +
        sliderValues.nuclear_gw +
        5

      setSliderProportions({
        wind: (sliderValues.wind_gw / sliderTotal) * proportionBarWidth,
        solar: (sliderValues.solar_gw / sliderTotal) * proportionBarWidth,
        hydropower: (sliderValues.hydro_gw / sliderTotal) * proportionBarWidth,
        biomass: (sliderValues.bio_gw / sliderTotal) * proportionBarWidth,
        geothermal: (sliderValues.geo_gw / sliderTotal) * proportionBarWidth,
        nuclear: (sliderValues.nuclear_gw / sliderTotal) * proportionBarWidth,
      })
    }
  }, [sliderValues, proportionBarWidth])

  const renderTrackMark = (index: number, mark: string) => (
    <View style={styles.trackMarkContainer} key={index}>
      <View style={styles.trackMark} />
      <Text style={styles.trackMarkLabel}>{mark}</Text>
    </View>
  )

  const handleSlidingStart = (label: string) => {
    setSelectedSlider(label)
  }

  const getSourceColor = (label: string) => {
    switch (label) {
      case 'Wind':
        return '#C66AAA'
      case 'Solar':
        return '#F8CE46'
      case 'Hydropower':
        return '#58C4D4'
      case 'Biomass':
        return '#779448'
      case 'Geothermal':
        return '#BF9336'
      case 'Nuclear':
        return '#EE8E35'
      default:
        return '#B5B1AA'
    }
  }

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
    <View style={styles.sliderContainer} key={label}>
      <View style={styles.labelContainer}>
        <IconComponent width={22} height={22} />
        <Text style={styles.label}>
          {label === 'Nuclear' ? 'Nuclear*' : label}
        </Text>
        <TouchableOpacity onPress={() => toggleTooltip(label)}>
          <ToolTipIcon />
        </TouchableOpacity>
      </View>
      {renderTooltip(label, tooltip)}
      <View style={styles.sliderWrapper}>
        <Slider
          containerStyle={styles.slider}
          minimumValue={Math.round(
            parseFloat(minMaxValues.min[label.toLowerCase()]),
          )}
          maximumValue={Math.round(
            parseFloat(minMaxValues.max[label.toLowerCase()]),
          )}
          value={sliderValues[energyMap[label.toLowerCase()]]}
          step={1.0}
          thumbTintColor={
            selectedSlider === label ? getSourceColor(label) : '#B5B1AA'
          }
          minimumTrackTintColor={getSourceColor(label)}
          maximumTrackTintColor="#B5B1AA"
          trackMarks={[
            values[0][energyMap[label.toLowerCase()]],
            values[1][energyMap[label.toLowerCase()]]-0.0275*(parseFloat(minMaxValues.max[label.toLowerCase()])-parseFloat(minMaxValues.min[label.toLowerCase()])),
          ]}
          renderTrackMarkComponent={(index) =>
            renderTrackMark(index, ['2024', 'BAU'][index])
          }
          onSlidingStart={() => handleSlidingStart(label)}
          onValueChange={(val) =>
            setSliderValues({
              ...sliderValues,
              [energyMap[label.toLowerCase()]]: val[0],
            })
          }
          onSlidingComplete={(val) =>
            onSliderChange({
              ...sliderValues,
              [energyMap[label.toLowerCase()]]: val[0],
            })
          }
        />
        <View style={styles.sliderValueBox}>
          <Text style={styles.sliderValue}>
            {Math.round(sliderValues[energyMap[label.toLowerCase()]]) + ' GW'}
          </Text>
        </View>
      </View>
    </View>
  )

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.description}>
        Using the sliders below, make region specific changes for each renewable
        energy source to reach 12 TW of renewable capacity. This will override
        default values set in the global dashboard.
      </Text>
      <View
        style={styles.capacityProportionContainer}
        onLayout={(event) => {
          setProportionBarWidth(event.nativeEvent.layout.width - 20)
        }}
      >
        <Text style={styles.capacityProportionText}>
          Renewable Capacity Proportions
        </Text>
        {proportionBarWidth && sliderProportions && (
          <Svg height={20}>
            <Rect
              x={0}
              y={0}
              width={sliderProportions.wind}
              height={20}
              fill="#C66AAA"
            />
            <Rect
              x={sliderProportions.wind}
              y={0}
              width={sliderProportions.solar}
              height={20}
              fill="#F8CE46"
            />
            <Rect
              x={sliderProportions.wind + sliderProportions.solar}
              y={0}
              width={sliderProportions.hydropower}
              height={20}
              fill="#58C4D4"
            />
            <Rect
              x={
                sliderProportions.wind +
                sliderProportions.solar +
                sliderProportions.hydropower
              }
              y={0}
              width={sliderProportions.biomass}
              height={20}
              fill="#779448"
            />
            <Rect
              x={
                sliderProportions.wind +
                sliderProportions.solar +
                sliderProportions.hydropower +
                sliderProportions.biomass
              }
              y={0}
              width={sliderProportions.geothermal}
              height={20}
              fill="#BF9336"
            />
            <Rect
              x={
                sliderProportions.wind +
                sliderProportions.solar +
                sliderProportions.hydropower +
                sliderProportions.biomass +
                sliderProportions.geothermal
              }
              y={0}
              width={5}
              height={20}
              fill="white"
            />
            <Rect
              x={
                sliderProportions.wind +
                sliderProportions.solar +
                sliderProportions.hydropower +
                sliderProportions.biomass +
                sliderProportions.geothermal +
                5
              }
              y={0}
              width={sliderProportions.nuclear}
              height={20}
              fill="#EE8E35"
            />
          </Svg>
        )}
        {/* <View style={styles.bar}></View> */}
      </View>
      {renderSlider(
        'Wind',
        WindIcon,
        'Wind power involves using wind turbines to convert moving air in the form of kinetic energy into electrical energy. Wind power is captured through wind turbines that rotate when wind passes through them.',
      )}
      {renderSlider(
        'Solar',
        SolarIcon,
        'Solar power converts sunlight into electrical energy through photovoltaic panels. This energy can be used to generate electricity or can be stored in batteries.',
      )}
      {renderSlider(
        'Hydropower',
        HydroIcon,
        'Hydropower generates electricity using the energy of water. This is harnessed by using turbines and generators to convert the natural kinetic energy of water into electricity.',
      )}
      {renderSlider(
        'Biomass',
        BiomassIcon,
        'Most biomass power systems are generated by the direct combustion of organic materials such as crops and waste products, which are burned and produce steam that drives a generator. ',
      )}
      {renderSlider(
        'Geothermal',
        GeothermalIcon,
        'Geothermal power is generated from heat within the Earth’s core. Geothermal wells and heat exchangers are used to tap into reservoirs of steam and hot water.',
      )}
      {renderSlider(
        'Nuclear',
        NuclearIcon,
        'Nuclear power is generated through nuclear reactions, typically involving the splitting of atoms to release energy. This is then harnessed to generate electricity.',
      )}

      <Text style={styles.nuclearNote}>
        *Not a renewable energy source, but supports carbon reduction goals by
        reducing reliance on fossil fuels.
      </Text>

      <TouchableOpacity onPress={onReset} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>Reset to Global Values</Text>
      </TouchableOpacity>
      <View style={styles.spacer}></View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    padding: 4,
  },
  description: {
    color: '#000',
    fontFamily: 'Roboto',
    fontSize: 14,
    marginBottom: 16,
  },
  capacityProportionContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 16,
    marginBottom: 32,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    right: 10,
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
    height: 40,
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
    marginTop: 46,
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
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackMark: {
    width: 1,
    height: 21,
    backgroundColor: '#B5B1AA',
  },
  trackMarkLabel: {
    color: '#B5B1AA',
    fontSize: 17,
  },
})

export default DistributeRenewables
