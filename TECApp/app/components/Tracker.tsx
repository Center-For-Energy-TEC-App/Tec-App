import React, { StyleSheet, View, Text } from 'react-native'
import { TemperatureIcon } from '../SVGs/TemperatureIcon'
import { RenewableIcon } from '../SVGs/RenewableIcon'
import { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { TemperatureData } from '../util/Calculations'

type TrackerProps = {
  type: 'temperature' | 'renewable'
  dashboard?: boolean
  totalGlobalEnergy?: number
  temperatureData?: TemperatureData
}

export const Tracker = ({
  type,
  dashboard,
  totalGlobalEnergy,
  temperatureData,
}: TrackerProps) => {
  const [temperatureVersion, setTemperatureVersion] = useState<number>(0)
  const [energyVersion, setEnergyVersion] = useState<number>(0)

  const [currTemperatureData, setCurrTemperatureData] =
    useState<TemperatureData>()

  const [temperatureHighlight, setTemperatureHighlight] =
    useState<boolean>(false)

  const flashYear = () => {
    setTemperatureHighlight(true)
    const timeout = setTimeout(() => {
      setTemperatureHighlight(false)
    }, 1000)
    return () => clearTimeout(timeout)
  }

  useEffect(() => {
    if (!currTemperatureData && temperatureData) {
      setCurrTemperatureData(temperatureData)
    }

    if (temperatureData && currTemperatureData) {
      if (temperatureData['1.5Year'] !== currTemperatureData['1.5Year']) {
        setCurrTemperatureData({
          ...temperatureData,
          '1.5Year': temperatureData['1.5Year'],
        })
        if (temperatureVersion === 0) {
          flashYear()
        }
      }
      if (temperatureData['1.8Year'] !== currTemperatureData['1.8Year']) {
        setCurrTemperatureData({
          ...temperatureData,
          '1.8Year': temperatureData['1.8Year'],
        })
        if (temperatureVersion === 1) {
          flashYear()
        }
      }
      if (temperatureData['2.0Year'] !== currTemperatureData['2.0Year']) {
        setCurrTemperatureData({
          ...temperatureData,
          '2.0Year': temperatureData['2.0Year'],
        })
        if (temperatureVersion === 2) {
          flashYear()
        }
      }
    }
  }, [temperatureData])

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
                <View style={mobileStyles.dataColumn}>
                  <Text style={mobileStyles.dashboardLabel}>
                    {temperatureVersion == 0
                      ? '+1.5°C'
                      : temperatureVersion == 1
                        ? '+1.8°C'
                        : '2.0°C'}
                  </Text>
                  <Text
                    style={
                      temperatureHighlight
                        ? mobileStyles.flashLabel
                        : mobileStyles.dashboardLabel
                    }
                  >
                    {temperatureVersion == 0
                      ? 'by ' +
                        temperatureData['1.5Year'] +
                        (temperatureData['1.5Year'] == 2060 ? '+' : '')
                      : temperatureVersion == 1
                        ? 'by ' +
                          temperatureData['1.8Year'] +
                          (temperatureData['1.8Year'] == 2060 ? '+' : '')
                        : 'by ' +
                          temperatureData['2.0Year'] +
                          (temperatureData['2.0Year'] == 2060 ? '+' : '')}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => setEnergyVersion((energyVersion + 1) % 2)}
        >
          <View
            style={
              dashboard ? mobileStyles.dashboardWrapper : mobileStyles.wrapper
            }
          >
            <View style={mobileStyles.iconRow}>
              <RenewableIcon dashboard={dashboard} />
              <Text
                style={
                  dashboard ? mobileStyles.dashboardHeader : mobileStyles.header
                }
              >
                {energyVersion == 0
                  ? (totalGlobalEnergy / 1000).toFixed(1)
                  : ((totalGlobalEnergy / 1000 / 12) * 100).toFixed(0) + '%'}
              </Text>
              <Text
                style={
                  dashboard
                    ? mobileStyles.dashboardSmallHeader
                    : mobileStyles.smallHeader
                }
              >
                {energyVersion == 0 && 'TW'}
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

  flashLabel: {
    fontFamily: 'Brix Sans',
    fontSize: 15.5,
    textShadowRadius: 8.5,
    textShadowOffset: { width: 0, height: 0 },
    textShadowColor: 'green',
  },
})
