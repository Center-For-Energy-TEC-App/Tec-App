import React, { StyleSheet, View, Text } from 'react-native'
import { TemperatureIcon } from '../SVGs/TemperatureIcon'
import { RenewableIcon } from '../SVGs/RenewableIcon'
import { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { TemperatureData } from '../util/Calculations'
import { TrackerButton } from '../SVGs/TrackerButton'
import { TrackerButtonArrow } from '../SVGs/TrackerButtonArrow'

type TrackerProps = {
  type: 'temperature' | 'renewable'
  totalGlobalEnergy?: number
  temperatureData?: TemperatureData
}

export const Tracker = ({
  type,
  totalGlobalEnergy,
  temperatureData,
}: TrackerProps) => {
  const [temperatureVersion, setTemperatureVersion] = useState<number>(1)
  const [energyVersion, setEnergyVersion] = useState<number>(1)

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
          style={{ height: 75 }}
          onPress={() => setTemperatureVersion((temperatureVersion + 1) % 3)}
        >
          <TrackerButton />
          <View style={styles.temperatureWrapper}>
            <View>
              {temperatureData ? (
                <View style={styles.iconRow}>
                  <TemperatureIcon />
                  <View style={styles.dataColumn}>
                    <Text style={styles.temperatureLabel}>
                      {temperatureVersion == 0
                        ? '+1.5°C'
                        : temperatureVersion == 1
                          ? '+1.8°C'
                          : '+2.0°C'}
                    </Text>
                    <Text
                      style={
                        temperatureHighlight
                          ? styles.flashLabel
                          : styles.temperatureBottomLabel
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
              ) : (
                <></>
              )}
            </View>
            <View style={styles.trackerButtonWrapper}>
              <TrackerButtonArrow />
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{ height: 75 }}
          onPress={() => setEnergyVersion((energyVersion + 1) % 2)}
        >
          <TrackerButton />
          <View style={styles.energyWrapper}>
            <View style={{ alignItems: 'center' }}>
              <View style={styles.iconRow}>
                <RenewableIcon />
                <Text style={styles.header}>
                  {energyVersion == 0
                    ? (totalGlobalEnergy / 1000).toFixed(1)
                    : ((totalGlobalEnergy / 1000 / 12) * 100).toFixed(0) + '%'}
                </Text>
                <Text style={styles.smallHeader}>
                  {energyVersion == 0 && 'TW'}
                </Text>
              </View>
              <Text style={styles.energyLabel}>
                {energyVersion == 0 ? 'of power by 2030' : 'of 12 TW Goal'}
              </Text>
            </View>
            <View style={styles.trackerButtonWrapper}>
              <TrackerButtonArrow />
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  temperatureWrapper: {
    position: 'relative',
    bottom: 58,
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    alignItems: 'center',
    height: 75,
  },

  energyWrapper: {
    position: 'relative',
    bottom: 60,
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    alignItems: 'center',
    height: 75,
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
    gap: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    fontFamily: 'Brix Sans',
    fontSize: 24,
  },

  smallHeader: {
    fontFamily: 'Brix Sans',
    fontSize: 16,
    paddingBottom: 2,
  },

  energyLabel: {
    fontFamily: 'Brix Sans',
    fontSize: 11,
  },

  temperatureLabel: {
    fontFamily: 'Brix Sans',
    fontSize: 20,
  },

  temperatureBottomLabel: {
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

  trackerButtonWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    width: '100%',
    position: 'relative',
    bottom: 4,
  },
})
