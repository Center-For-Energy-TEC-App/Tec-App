import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { WindIcon } from '../SVGs/DistributeRenewablesIcons/WindIcon';
import { SolarIcon } from '../SVGs/DistributeRenewablesIcons/SolarIcon';
import { HydroIcon } from '../SVGs/DistributeRenewablesIcons/HydroIcon';
import { BiomassIcon } from '../SVGs/DistributeRenewablesIcons/BiomassIcon';
import { GeothermalIcon } from '../SVGs/DistributeRenewablesIcons/GeothermalIcon';
import { NuclearIcon } from '../SVGs/DistributeRenewablesIcons/NuclearIcon';
import { ToolTipIcon } from '../SVGs/DistributeRenewablesIcons/ToolTipIcon';
import { DefaultValues } from './BottomSheet';

type DistributeRenewablesProps = {
  defaultValues: DefaultValues
}

const DistributeRenewables = ({defaultValues}: DistributeRenewablesProps) => {
  const [selectedSlider, setSelectedSlider] = useState<string | null>(null);
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);

  const renderTrackMark = (index: number, mark: string) => (
    <View style={styles.trackMarkContainer} key={index}>
      <View style={styles.trackMark} />
      <Text style={styles.trackMarkLabel}>{mark}</Text>
    </View>
  );

  const handleSlidingStart = (label: string) => {
    setSelectedSlider(label);
  };

  const getSourceColor = (label: string) => {
    switch (label) {
      case 'Wind':
        return '#C66AAA';
      case 'Solar':
        return '#F8CE46';
      case 'Hydropower':
        return '#58C4D4';
      case 'Biomass':
        return '#779448';
      case 'Geothermal':
        return '#BF9336';
      case 'Nuclear*':
        return '#EE8E35';
      default:
        return '#B5B1AA';
    }
  };

  const toggleTooltip = (label: string) => {
    setVisibleTooltip(visibleTooltip === label ? null : label);
  };

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
  );

  const renderSlider = (label, IconComponent, tooltip) => (
    <View style={styles.sliderContainer} key={label}>
      <View style={styles.labelContainer}>
        <IconComponent width={22} height={22} />
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity onPress={() => toggleTooltip(label)}>
          <ToolTipIcon />
        </TouchableOpacity>
      </View>
      {renderTooltip(label, tooltip)}
      <View style={styles.sliderWrapper}>
        <Slider
          containerStyle={styles.slider}
          minimumValue={2024}
          maximumValue={2035}
          value={0.1}
          thumbTintColor={selectedSlider === label ? getSourceColor(label) : '#B5B1AA'}
          minimumTrackTintColor={getSourceColor(label)}
          maximumTrackTintColor="#B5B1AA"
          trackMarks={[2024, 2027.5, 2030]}
          renderTrackMarkComponent={(index) => renderTrackMark(index, ['2024', 'BAU', 'GV'][index])}
          onSlidingStart={() => handleSlidingStart(label)}
        />
        <View style={styles.sliderValueBox}>
          <Text style={styles.sliderValue}>000 GW</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.description}>
        Using the sliders below, make region specific changes for each renewable
        energy source to reach 12 TW of renewable capacity. This will override
        default values set in the global dashboard.
      </Text>
      <View style={styles.capacityProportionContainer}>
        <Text style={styles.capacityProportionText}>Renewable Capacity Proportions</Text>
        <View style={styles.bar}></View>
      </View>
      {renderSlider('Wind', WindIcon, 'Wind power involves using wind turbines to convert moving air in the form of kinetic energy into electrical energy. Wind power is captured through wind turbines that rotate when wind passes through them.')}
      {renderSlider('Solar', SolarIcon, 'Solar power converts sunlight into electrical energy through photovoltaic panels. This energy can be used to generate electricity or can be stored in batteries.')}
      {renderSlider('Hydropower', HydroIcon, 'Hydropower generates electricity using the energy of water. This is harnessed by using turbines and generators to convert the natural kinetic energy of water into electricity.')}
      {renderSlider('Biomass', BiomassIcon, 'Most biomass power systems are generated by the direct combustion of organic materials such as crops and waste products, which are burned and produce steam that drives a generator. ')}
      {renderSlider('Geothermal', GeothermalIcon, 'Geothermal power is generated from heat within the Earth’s core. Geothermal wells and heat exchangers are used to tap into reservoirs of steam and hot water.')}
      {renderSlider('Nuclear*', NuclearIcon, 'Nuclear power is generated through nuclear reactions, typically involving the splitting of atoms to release energy. This is then harnessed to generate electricity.')}

      <Text style={styles.nuclearNote}>
        *Not a renewable energy source, but supports carbon reduction goals by
        reducing reliance on fossil fuels.
      </Text>

      <TouchableOpacity style={styles.resetButton}>
        <Text style={styles.resetButtonText}>Reset to Global Values</Text>
      </TouchableOpacity>
      <View style={styles.spacer}>

      </View>
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
    elevation: 3 
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
    justifyContent: 'center'
  },
  trackMark: {
    width: 1,
    height: 21,
    backgroundColor: '#B5B1AA',
  },
  trackMarkLabel: {
    color: '#B5B1AA',
    fontSize: 17
  },
});

export default DistributeRenewables;
