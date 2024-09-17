import React, { StyleSheet, View, Text } from 'react-native'
import { TemperatureIcon } from '../SVGs/TemperatureIcon'
import { RenewableIcon } from '../SVGs/RenewableIcon'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

type TrackerProps = {
  type: 'temperature' | 'renewable'
  dashboard?: boolean
  totalGlobalEnergy?: number
  temperatureData?: { yearAtDegree: number[]; degreeAtYear: number[] }
}

export const Tracker = ({
  type,
  dashboard,
  totalGlobalEnergy,
  temperatureData,
}: TrackerProps) => {
  const [temperatureVersion, setTemperatureVersion] = useState<boolean>(true)
  return (
    <>
      {type === 'temperature' ? (
        <TouchableOpacity
          onPress={() => setTemperatureVersion(!temperatureVersion)}
        >
          <View
            style={
              dashboard ? mobileStyles.dashboardWrapper : mobileStyles.wrapper
            }
          >
            {temperatureData && (
              <View style={mobileStyles.iconRow}>
                <TemperatureIcon dashboard={dashboard} />
                {temperatureVersion ? (
                  <View style={mobileStyles.dataColumn}>
                    <Text
                      style={
                        dashboard
                          ? mobileStyles.dashboardLabel
                          : mobileStyles.label
                      }
                    >
                      {'+1.5° by: ' + temperatureData.yearAtDegree[0]}
                    </Text>
                    <Text
                      style={
                        dashboard
                          ? mobileStyles.dashboardLabel
                          : mobileStyles.label
                      }
                    >
                      {'+1.8° by: ' + temperatureData.yearAtDegree[1]}
                    </Text>
                    <Text
                      style={
                        dashboard
                          ? mobileStyles.dashboardLabel
                          : mobileStyles.label
                      }
                    >
                      {'+2.0° by: ' + temperatureData.yearAtDegree[2]}
                    </Text>
                  </View>
                ) : (
                  <View style={mobileStyles.dataColumn}>
                    <Text
                      style={
                        dashboard
                          ? mobileStyles.dashboardLabel
                          : mobileStyles.label
                      }
                    >
                      {`By 2035: +${temperatureData.degreeAtYear[0].toFixed(1)}° to +${temperatureData.degreeAtYear[1].toFixed(1)}°`}
                    </Text>
                    <Text
                      style={
                        dashboard
                          ? mobileStyles.dashboardLabel
                          : mobileStyles.label
                      }
                    >
                      {`By 2050: +${temperatureData.degreeAtYear[2].toFixed(1)}° to +${temperatureData.degreeAtYear[3].toFixed(1)}°`}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <View
          style={
            dashboard ? mobileStyles.dashboardWrapper : mobileStyles.wrapper
          }
        >
          <View style={mobileStyles.iconRow}>
            <RenewableIcon dashboard={dashboard} />
            {/* Replace with database value */}
            <Text
              style={
                dashboard ? mobileStyles.dashboardHeader : mobileStyles.header
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
