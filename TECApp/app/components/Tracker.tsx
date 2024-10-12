import React, { StyleSheet, View, Text } from 'react-native'
import { TemperatureIcon } from '../SVGs/TemperatureIcon'
import { RenewableIcon } from '../SVGs/RenewableIcon'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

type TrackerProps = {
  type: 'temperature' | 'renewable'
  dashboard?: boolean
  totalGlobalEnergy?: number
  temperatureData?: { yearAtDegree: number[] }
}

export const Tracker = ({
  type,
  dashboard,
  totalGlobalEnergy,
  temperatureData,
}: TrackerProps) => {
  const [temperatureVersion, setTemperatureVersion] = useState<number>(0)
  const [energyVersion, setEnergyVersion] = useState<number>(0)
  return (
    <>
      {type === 'temperature' ? (
        <TouchableOpacity
          onPress={() => setTemperatureVersion((temperatureVersion + 1) % 3)}
        >
          <View
            style={
              dashboard ? mobileStyles.dashboardWrapper : mobileStyles.wrapper
            }
          >
            {temperatureData && (
              <View style={mobileStyles.iconRow}>
                <TemperatureIcon dashboard={dashboard} />
                {temperatureVersion == 0 ? (
                  <View style={mobileStyles.dataColumn}>
                    <Text style={mobileStyles.dashboardLabel}>{'+1.5°C'}</Text>
                    <Text style={mobileStyles.dashboardLabel}>
                      {'by ' +
                        temperatureData.yearAtDegree[0] +
                        (temperatureData.yearAtDegree[0] == 2060 ? '+' : '')}
                    </Text>
                  </View>
                ) : temperatureVersion == 1 ? (
                  <View style={mobileStyles.dataColumn}>
                    <Text style={mobileStyles.dashboardLabel}>{'+1.8°C'}</Text>
                    <Text style={mobileStyles.dashboardLabel}>
                      {'by ' +
                        temperatureData.yearAtDegree[1] +
                        (temperatureData.yearAtDegree[1] == 2060 ? '+' : '')}
                    </Text>
                  </View>
                ) : (
                  <View style={mobileStyles.dataColumn}>
                    <Text style={mobileStyles.dashboardLabel}>{'+2.0°C'}</Text>
                    <Text style={mobileStyles.dashboardLabel}>
                      {'by ' +
                        temperatureData.yearAtDegree[2] +
                        (temperatureData.yearAtDegree[2] == 2060 ? '+' : '')}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => setEnergyVersion((energyVersion + 1) % 2)}
        >
          {energyVersion == 0 ? (
            <View
              style={
                dashboard ? mobileStyles.dashboardWrapper : mobileStyles.wrapper
              }
            >
              <View style={mobileStyles.iconRow}>
                <RenewableIcon dashboard={dashboard} />
                <Text
                  style={
                    dashboard
                      ? mobileStyles.dashboardHeader
                      : mobileStyles.header
                  }
                >
                  {(totalGlobalEnergy / 1000).toFixed(1)}
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
                style={
                  dashboard ? mobileStyles.dashboardLabel : mobileStyles.label
                }
              >
                of power by 2030
              </Text>
            </View>
          ) : (
            <View
              style={
                dashboard ? mobileStyles.dashboardWrapper : mobileStyles.wrapper
              }
            >
              <View style={mobileStyles.iconRow}>
                <RenewableIcon dashboard={dashboard} />
                <Text
                  style={
                    dashboard
                      ? mobileStyles.dashboardHeader
                      : mobileStyles.header
                  }
                >
                  {((totalGlobalEnergy / 1000 / 12) * 100).toFixed(0) + '%'}
                </Text>
              </View>
              <Text
                style={
                  dashboard ? mobileStyles.dashboardLabel : mobileStyles.label
                }
              >
                of 12 TW Goal
              </Text>
            </View>
          )}
        </TouchableOpacity>
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
    justifyContent: 'center',
    height: 75,
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
    justifyContent: 'center',
    height: 85,
  },

  iconRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  dataColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
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
