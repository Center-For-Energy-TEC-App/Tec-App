import React, { View, Text, StyleSheet } from 'react-native'

export const BAUComparison = () => {
  return (
    <View>
      <Text style={styles.header}>B.A.U. Comparison</Text>
      <Text style={styles.body}>
        See how your manipulated data compares to the business-as-usual (BAU)
        data. The BAU data represents the projected renewable capacity levels
        from now to 2030 without any interventions.
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
