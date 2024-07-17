import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import WindIcon from '../../assets/wind-icon.svg';
import SolarIcon from '../../assets/solar-icon.svg';
import HydroIcon from '../../assets/hydro-icon.svg';
import BiomassIcon from '../../assets/biomass-icon.svg';
import GeothermalIcon from '../../assets/geothermal-icon.svg';
import NuclearIcon from '../../assets/nuclear-icon.svg';

const DistributeRenewables = () => {
  const renderSlider = (label, icon, tooltip) => (
    <View style={styles.sliderContainer}>
      <View style={styles.labelContainer}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity style={styles.tooltip}>
          <Text style={styles.tooltipText}>{tooltip}</Text>
        </TouchableOpacity>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        value={0}
        thumbTintColor="#000"
        minimumTrackTintColor="#007BFF"
        maximumTrackTintColor="#000"
      />
      <Text style={styles.sliderValue}>000 GW</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.description}>
        Using the sliders below, make region specific changes for each renewable energy source to reach 12 TW of renewable capacity. This will override default values set in the global dashboard.
      </Text>
      <Text style={styles.sectionTitle}>Renewable Capacity Proportions</Text>
      <View style={styles.bar}></View>

      {renderSlider('Wind', WindIcon, 'Wind power tooltip text')}
      {renderSlider('Solar', SolarIcon, 'Solar power tooltip text')}
      {renderSlider('Hydropower', HydroIcon, 'Hydropower tooltip text')}
      {renderSlider('Biomass', BiomassIcon, 'Biomass tooltip text')}
      {renderSlider('Geothermal', GeothermalIcon, 'Geothermal tooltip text')}
      {renderSlider('Nuclear', NuclearIcon, 'Nuclear tooltip text')}

      <Text style={styles.nuclearNote}>
        *Not a renewable energy source, but supports carbon reduction goals by reducing reliance on fossil fuels.
      </Text>

      <TouchableOpacity style={styles.resetButton}>
        <Text style={styles.resetButtonText}>Reset to Global Values</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    color: '#000',
    fontFamily: 'Roboto',
    fontSize: 14,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#000',
    fontFamily: 'Roboto',
    fontSize: 16,
    marginBottom: 8,
  },
  bar: {
    height: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  label: {
    flex: 1,
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  tooltip: {
    marginLeft: 8,
  },
  tooltipText: {
    color: '#007BFF',
    fontSize: 14,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    marginTop: 8,
    color: '#000',
    fontSize: 14,
    textAlign: 'right',
  },
  nuclearNote: {
    color: '#000',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 16,
  },
  resetButton: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#ccc',
    alignItems: 'center',
    borderRadius: 4,
  },
  resetButtonText: {
    color: '#000',
    fontSize: 14,
  },
});

export default DistributeRenewables;
