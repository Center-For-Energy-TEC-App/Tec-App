import React, { StyleSheet, View, Text } from 'react-native'
import { TemperatureIcon } from '../SVGs/TemperatureIcon'
import { RenewableIcon } from '../SVGs/RenewableIcon'

type TrackerProps = {
  type: 'temperature' | 'renewable'
}

export const Tracker = ({ type }: TrackerProps) => {
  return (
    <>
      {type === 'temperature' ? (
        <View style={mobileStyles.wrapper}>
          <View style={mobileStyles.iconRow}>
            <TemperatureIcon />
            {/* Replace with database value */}
            <Text style={mobileStyles.header}>+2°</Text>
          </View>
          <Text style={mobileStyles.label}>by 2030</Text>
        </View>
      ) : (
        <View style={mobileStyles.wrapper}>
          <View style={mobileStyles.iconRow}>
            <RenewableIcon />
            {/* Replace with database value */}
            <Text style={mobileStyles.header}>8/12</Text>
            <Text style={mobileStyles.smallHeader}>TW</Text>
          </View>
          <Text style={mobileStyles.label}>of renewable capacity</Text>
        </View>
      )}
    </>
  )
}

const mobileStyles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderColor: '#D9D9D9',
    borderWidth: 1.5,
    alignItems: 'center',
  },

  iconRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },

  header: {
    fontFamily: 'Brix-Sans',
    fontSize: 24,
  },

  smallHeader: {
    fontFamily: 'Brix-Sans',
    fontSize: 16,
    paddingBottom: 2,
  },

  label: {
    fontFamily: 'Brix-Sans',
    fontSize: 11,
  },
})
