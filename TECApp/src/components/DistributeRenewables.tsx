import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import Slider from '@react-native-community/slider'
import { WindIcon } from '../SVGs/DistributeRenewablesIcons/WindIcon'
import { SolarIcon } from '../SVGs/DistributeRenewablesIcons/SolarIcon'
import { HydroIcon } from '../SVGs/DistributeRenewablesIcons/HydroIcon'
import { BiomassIcon } from '../SVGs/DistributeRenewablesIcons/BiomassIcon'
import { GeothermalIcon } from '../SVGs/DistributeRenewablesIcons/GeothermalIcon'
import { NuclearIcon } from '../SVGs/DistributeRenewablesIcons/NuclearIcon'
import { ToolTipIcon } from '../SVGs/DistributeRenewablesIcons/ToolTipIcon'

const DistributeRenewables = () => {
  const renderSlider = (label, IconComponent, tooltip) => (
    <View style={styles.sliderContainer}>
      <View style={styles.labelContainer}>
        <IconComponent width={22} height={22} />
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity>
          <ToolTipIcon></ToolTipIcon>
        </TouchableOpacity>
      </View>
      <View style={styles.sliderWrapper}>
        <Text style={styles.sliderStartLabel}>2024</Text>
        <Slider
          style={styles.slider}
          minimumValue={2024}
          maximumValue={2035}
          value={0}
          thumbTintColor="#B5B1AA"
          minimumTrackTintColor="#B5B1AA"
          maximumTrackTintColor="#B5B1AA"
        />
        <View style={styles.sliderValueBox}>
          <Text style={styles.sliderValue}>000 GW</Text>
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
      <View style={styles.capacityProportionContainer}>
        <Text style={styles.capacityProportionText}>Renewable Capacity Proportions</Text>
        <View style={styles.bar}></View>
      </View>
      {renderSlider('Wind', WindIcon, 'Wind power tooltip text')}
      {renderSlider('Solar', SolarIcon, 'Solar power tooltip text')}
      {renderSlider('Hydropower', HydroIcon, 'Hydropower tooltip text')}
      {renderSlider('Biomass', BiomassIcon, 'Biomass tooltip text')}
      {renderSlider('Geothermal', GeothermalIcon, 'Geothermal tooltip text')}
      {renderSlider('Nuclear*', NuclearIcon, 'Nuclear power tooltip text')}

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
  capacityProportionContainer:{
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
    fontSize: 14,
    fontWeight: '400',
  },
  tooltip: {
    marginLeft: 8,
  },
  sliderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderStartLabel: {
    color: '#000',
    fontSize: 14,
    marginRight: 8,
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
  spacer:{
    marginTop: 46
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
})

export default DistributeRenewables
