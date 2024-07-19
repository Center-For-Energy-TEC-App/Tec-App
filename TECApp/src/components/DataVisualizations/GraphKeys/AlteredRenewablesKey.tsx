import React, { StyleSheet, View, Text } from 'react-native'
import Svg, { Rect } from 'react-native-svg'

export const AlteredRenewablesKey = () => {
  return (
    <View style={styles.graphKeyContainer}>
      <Svg width={7} height={7}>
        <Rect width={7} height={7} fill="#C66AAA" />
      </Svg>
      <Text style={styles.graphKeyText}>ALTERED RENEWABLES</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  graphKeyContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  graphKeyText: {
    fontWeight: '700',
    fontSize: 9,
    letterSpacing: 0.7,
    color: '#9E9FA7',
  },
})
