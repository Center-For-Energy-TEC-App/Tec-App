import React, { View, Text, StyleSheet } from 'react-native'

export const RegionalComparison = () => {
  return (
    <View>
      <Text style={styles.header}>Regional Comparison</Text>
      <Text style={styles.body}>
        This graph compares the total renewable energy generation between two or
        more regions. Select regions from the dropdown to visualize their
        resulting data.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    fontFamily: 'Brix-Sans',
    fontSize: 24,
    marginBottom: 8,
  },
  body: {
    fontFamily: 'Roboto',
    fontSize: 14,
  },
})
