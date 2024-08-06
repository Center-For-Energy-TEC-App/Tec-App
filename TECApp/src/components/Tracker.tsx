import React, { StyleSheet, View, Text } from 'react-native'
import { TemperatureIcon } from '../SVGs/TemperatureIcon'
import { RenewableIcon } from '../SVGs/RenewableIcon'

type TrackerProps = {
  type: 'temperature' | 'renewable'
  dashboard?: boolean
}

export const Tracker = ({ type, dashboard }: TrackerProps) => {
  return (
    <>
      {type === 'temperature' ? (
        <View
          style={
            dashboard ? mobileStyles.dashboardWrapper : mobileStyles.wrapper
          }
        >
          <View style={mobileStyles.iconRow}>
            <TemperatureIcon dashboard={dashboard} />
            {/* Replace with database value */}
            <Text
              style={
                dashboard ? mobileStyles.dashboardHeader : mobileStyles.header
              }
            >
              +2°
            </Text>
          </View>
          <Text
            style={dashboard ? mobileStyles.dashboardLabel : mobileStyles.label}
          >
            by 2030
          </Text>
        </View>
      ) : (
        <View style={mobileStyles.wrapper}>
          <View style={mobileStyles.iconRow}>
            <RenewableIcon dashboard={dashboard} />
            {/* Replace with database value */}
            <Text
              style={
                dashboard ? mobileStyles.dashboardHeader : mobileStyles.header
              }
            >
              8/12
            </Text>
            <Text
              style={
                dashboard
                  ? mobileStyles.dashboardSmallHeader
                  : mobileStyles.smallHeader
              }
            >
              TW
            </Text>
          </View>
          <Text
            style={dashboard ? mobileStyles.dashboardLabel : mobileStyles.label}
          >
            of renewable capacity
          </Text>
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

  dashboardWrapper: {
    paddingHorizontal: 17,
    paddingVertical: 8.5,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
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
    fontFamily: 'Brix Sans',
    fontSize: 24,
  },

  dashboardHeader: {
    fontFamily: 'Brix Sans',
    fontSize: 32,
  },

  smallHeader: {
    fontFamily: 'Brix Sans',
    fontSize: 16,
    paddingBottom: 2,
  },

  dashboardSmallHeader: {
    fontFamily: 'Brix Sans',
    fontSize: 20,
    paddingBottom: 2,
  },

  label: {
    fontFamily: 'Brix Sans',
    fontSize: 11,
  },

  dashboardLabel: {
    fontFamily: 'Brix Sans',
    fontSize: 15.5,
  },
})