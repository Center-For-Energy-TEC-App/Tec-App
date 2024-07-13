import React, { useMemo, useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

export interface CountryBottomSheetProps {
  selectedCountry: string;
}

const CountryBottomSheet = ({ selectedCountry }: CountryBottomSheetProps) => {
  const snapPoints = useMemo(() => ['10%', '25%', '50%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [activeTab, setActiveTab] = useState<'renewables' | 'visualizations'>('renewables');

  useEffect(() => {
    if (selectedCountry) {
      bottomSheetRef.current?.snapToIndex(1); // Snap to 25% when a country is selected
    }
  }, [selectedCountry]);

  return (
    <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
      <View style={styles.contentContainer}>
        {selectedCountry ? (
          <View style={styles.countryInfoContainer}>
            <Text style={styles.countryName}>{selectedCountry}</Text>
            <View style={styles.tabContainer}>
              <TouchableOpacity onPress={() => setActiveTab('renewables')}>
                <Text style={activeTab === 'renewables' ? styles.activeTab : styles.inactiveTab}>
                  Distribute Renewables
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('visualizations')}>
                <Text style={activeTab === 'visualizations' ? styles.activeTab : styles.inactiveTab}>
                  Data Visualizations
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.infoText}>
              {activeTab === 'renewables'
                ? 'Using the sliders below, make region specific changes for each renewable energy source to reach 12 TW of renewable capacity. This will override default values set in the global dashboard.'
                : 'Here you can view data visualizations related to the selected country\'s renewable energy sources.'}
            </Text>
          </View>
        ) : (
          <Text style={styles.text}>Some text here global yes mwahahah</Text>
        )}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  countryInfoContainer: {
    flex: 1,
    width: '100%',
    padding: 16,
    alignItems: 'flex-start',
  },
  countryName: {
    color: '#000',
    fontSize: 28,
    fontFamily: 'Brix Sans',
    fontWeight: '400',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 43,
  },
  activeTab: {
    fontWeight: '700',
    color: '#266297',
    borderBottomWidth: 2,
    borderBottomColor: '#007BFF',
  },
  inactiveTab: {
    color: '#000',
    fontWeight: '400',
    borderBottomWidth: 2
  },
  infoText: {
    color: '#000',
    fontFamily: 'Roboto',
    paddingTop: 32,
    fontStyle:'normal',
    fontWeight: '400',
    fontSize: 14
  },
  text: {
    fontSize: 14,

  },
  gestureHandler: {
    flex: 0,
    justifyContent: 'flex-end',
  },
});

export default CountryBottomSheet;
