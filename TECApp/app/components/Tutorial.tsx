import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { RightArrow } from '../SVGs/RightArrow'
import { LeftArrow } from '../SVGs/LeftArrow'
import { PaginationCircle } from '../SVGs/PaginationCircle'
import { getData, storeData } from '../util/Caching'

type TutorialProps = {
  refresh: boolean
  state: number
}

const vh = Dimensions.get('window').height

export const Tutorial = ({ refresh, state }: TutorialProps) => {
  //states 0-4 represent 5 slides; state 5 represents popup to click on global dashboard, state 6 represents popup to click on a region
  const [tutorialState, setTutorialState] = useState(0)
  const [render, setRender] = useState<boolean>(true)

  useEffect(() => {
    getData('tutorial').then((value) => {
      if (value && value == 'complete') {
        setRender(false)
      } else {
        setRender(true)
      }
    })
    setTutorialState(state)
    if (state == 7) {
      storeData('tutorial', 'complete').then(() => {
        setRender(false)
      })
    }
  }, [refresh, state])

  return (
    <>
      {render && (
        <>
          {tutorialState < 5 && (
            <>
              <View style={mobileStyles.popupOverlay} />
              <View style={mobileStyles.popupColumn}>
                <View style={mobileStyles.popupRow}>
                  <LeftArrow
                    onPress={() => setTutorialState(tutorialState - 1)}
                    render={tutorialState != 0}
                  />
                  <View style={mobileStyles.modal}>
                    {tutorialState == 0 && (
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
                    {tutorialState == 1 && (
                      <View style={mobileStyles.textWrapper}>
                        <Text style={mobileStyles.header}>
                          Understand the world’s total global climate goals.
                        </Text>
                        <Text style={mobileStyles.body}>
                          Increasing the world’s renewable energy capacity to 12
                          TW will help keep global warming under 2°C by 2030.
                        </Text>
                        <Text style={mobileStyles.body}>
                          Track your progress on the top left or via the global
                          climate goals dashboard on the bottom.
                        </Text>
                      </View>
                    )}
                    {tutorialState == 2 && (
                      <View style={mobileStyles.textWrapper}>
                        <Text style={mobileStyles.header}>
                          Set default values across 10 global regions.
                        </Text>
                        <Text style={mobileStyles.body}>
                          In the global climate dashboard, set default values
                          for each region to start with in reaching 12 TW
                          renewable capacity.
                        </Text>
                      </View>
                    )}
                    {tutorialState == 3 && (
                      <View style={mobileStyles.textWrapper}>
                        <Text style={mobileStyles.header}>
                          Make changes to specific regions.
                        </Text>
                        <Text style={mobileStyles.body}>
                          Click on a region of the map to view and manipulate
                          renewable energy sources specifically in that area.
                        </Text>
                        <Text style={mobileStyles.body}>
                          You can override default values to explore more ways
                          to reach global climate goals.
                        </Text>
                      </View>
                    )}
                    {tutorialState == 4 && (
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
                    onPress={() => setTutorialState(tutorialState + 1)}
                    render={tutorialState != 4}
                  />
                </View>
                <View style={mobileStyles.paginationRow}>
                  <PaginationCircle filled={tutorialState == 0} />
                  <PaginationCircle filled={tutorialState == 1} />
                  <PaginationCircle filled={tutorialState == 2} />
                  <PaginationCircle filled={tutorialState == 3} />
                  <PaginationCircle filled={tutorialState == 4} />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    //if they made it to the last slide, they probably want to see the rest of the tutorial
                    if (tutorialState == 4) {
                      setTutorialState(5)
                    } else {
                      setRender(false)
                      storeData('tutorial', 'complete')
                    }
                  }}
                  style={mobileStyles.skipButton}
                >
                  <Text style={{ color: '#FFF', fontSize: 16 }}>
                    {tutorialState == 4 ? "Let's Begin!" : 'Skip Tutorial'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {tutorialState == 5 && (
            <View style={mobileStyles.guideOverlay}>
              <View style={mobileStyles.state5Popup}>
                <Text>
                  First, click the Globe icon on the top right of your screen to
                  view the Global Dashboard, which tracks the global effects of
                  all your regional changes.
                </Text>
              </View>
            </View>
          )}
          {tutorialState == 6 && (
            <View style={mobileStyles.state6Popup}>
              <Text>
                Now click on any of the colored regions you see on the map to
                make your own adjustments and see regional effects!
              </Text>
            </View>
          )}
        </>
      )}
    </>
  )
}

const mobileStyles = StyleSheet.create({
  popupOverlay: {
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
  guideOverlay: {
    width: '100%',
    height: vh - (vh * 0.065 + 64),
    position: 'absolute',
    top: vh * 0.065 + 64,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  state5Popup: {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: 'white',
    width: 200,
  },
  state6Popup: {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: 'white',
    width: 200,
    zIndex: 1,
  },
})
