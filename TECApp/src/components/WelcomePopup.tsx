import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { RightArrow } from '../SVGs/RightArrow'
import { LeftArrow } from '../SVGs/LeftArrow'
import { PaginationCircle } from '../SVGs/PaginationCircle'

export const WelcomePopup = () => {
  const [popupState, setPopupState] = useState(0) //states 0-4 represent 5 slides

  return (
    <>
      {popupState < 5 ? (
        <>
          <View style={mobileStyles.overlay} />
          <View style={mobileStyles.popupColumn}>
            <View style={mobileStyles.popupRow}>
              <LeftArrow
                onPress={() => setPopupState(popupState - 1)}
                render={popupState != 0}
              />
              <View style={mobileStyles.modal}>
                {popupState == 0 && (
                  <View style={mobileStyles.textWrapper}>
                    <Text style={mobileStyles.header}>
                      Welcome to the Triton Energy Climate app!
                    </Text>
                    <Text style={mobileStyles.body}>
                      In this app, you can explore how various regions’
                      renewable energy levels contribute to reaching global
                      climate goals in 2030.
                    </Text>
                    <Text style={mobileStyles.body}>
                      Let’s take a look at how to do this!
                    </Text>
                  </View>
                )}
                {popupState == 1 && (
                  <View style={mobileStyles.textWrapper}>
                    <Text style={mobileStyles.header}>
                      Understand the world’s total global climate goals.
                    </Text>
                    <Text style={mobileStyles.body}>
                      Increasing the world’s renewable energy capacity to 12 TW
                      will help keep global warming under 2°C by 2030.
                    </Text>
                    <Text style={mobileStyles.body}>
                      Track your progress on the top left or via the global
                      climate goals dashboard on the bottom.
                    </Text>
                  </View>
                )}
                {popupState == 2 && (
                  <View style={mobileStyles.textWrapper}>
                    <Text style={mobileStyles.header}>
                      Set default values across 10 global regions.
                    </Text>
                    <Text style={mobileStyles.body}>
                      In the global climate dashboard, set default values for
                      each region to start with in reaching 12 TW renewable
                      capacity.
                    </Text>
                  </View>
                )}
                {popupState == 3 && (
                  <View style={mobileStyles.textWrapper}>
                    <Text style={mobileStyles.header}>
                      Make changes to specific regions.
                    </Text>
                    <Text style={mobileStyles.body}>
                      Click on a region of the map to view and manipulate
                      renewable energy sources specifically in that area.
                    </Text>
                    <Text style={mobileStyles.body}>
                      You can override default values to explore more ways to
                      reach global climate goals.
                    </Text>
                  </View>
                )}
                {popupState == 4 && (
                  <View style={mobileStyles.textWrapper}>
                    <Text style={mobileStyles.header}>
                      Compare current energy levels to what is needed.
                    </Text>
                    <Text style={mobileStyles.body}>
                      For each region and globally, you can compare your
                      manipulated data to business-as-usual data.
                    </Text>
                    <Text style={mobileStyles.body}>
                      Click between various graphs to see different
                      representations of your data.
                    </Text>
                  </View>
                )}
              </View>
              <RightArrow
                onPress={() => setPopupState(popupState + 1)}
                render={popupState != 4}
              />
            </View>
            <View style={mobileStyles.paginationRow}>
              <PaginationCircle filled={popupState == 0} />
              <PaginationCircle filled={popupState == 1} />
              <PaginationCircle filled={popupState == 2} />
              <PaginationCircle filled={popupState == 3} />
              <PaginationCircle filled={popupState == 4} />
            </View>
            <TouchableOpacity
              onPress={() => setPopupState(5)}
              style={mobileStyles.skipButton}
            >
              <Text style={{ color: '#FFF', fontSize: 16 }}>
                {popupState == 4 ? "Let's Begin!" : 'Skip Tutorial'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

const mobileStyles = StyleSheet.create({
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    zIndex: 1,
  },

  popupColumn: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    zIndex: 1,
  },

  popupRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
    marginTop: 75,
  },

  modal: {
    maxHeight: 300,
    width: 297,
    borderRadius: 20,
    backgroundColor: 'white',
    display: 'flex',
    paddingHorizontal: 14,
    paddingVertical: 32,
    alignItems: 'center',
  },

  paginationRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 18,
  },

  skipButton: {
    backgroundColor: '#266297',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 6,
    color: '#FFF',
    fontSize: 18,
  },

  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },

  header: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Brix Sans',
    fontStyle: 'normal',
    fontWeight: '400',
  },

  body: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
  },
})
