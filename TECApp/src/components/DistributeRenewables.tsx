import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const DistributeRenewables = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Using the sliders below, make region specific changes for each renewable energy source to reach 12 TW of renewable capacity. This will override default values set in the global dashboard.
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

export default DistributeRenewables;
