import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const DataVisualizations = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Here you can view data visualizations related to the selected country's renewable energy sources.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
  },
  text: {
    color: '#000',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
  },
});

export default DataVisualizations;
