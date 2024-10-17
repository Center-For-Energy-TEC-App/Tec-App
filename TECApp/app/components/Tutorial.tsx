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
  sendStateHome: (state: number) => void
}

const vh = Dimensions.get('window').height

export const Tutorial = ({ refresh, state, sendStateHome }: TutorialProps) => {
  //states 0-4 represent 5 slides; state 5 represents popup to click on global dashboard, state 6 represents popup to click on a region
  const [tutorialState, setTutorialState] = useState(0)

  useEffect(() => {
    getData('tutorial').then((value) => {
      if (value && value === 'complete') {
        setTutorialState(11)
        sendStateHome(11)
      } else {
        setTutorialState(state)
      }
      if (state === 11) {
        storeData('tutorial', 'complete').then(() => {
          console.log('tutorial complete')
        })
      }
    })
  }, [refresh, state])

  return (
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
                      We’re excited that you’re here. In this app you can
                      explore scenarios and make your own plan for achieving the
                      global climate goal of tripling renewable energy by 2030.
                    </Text>
                  </View>
                )}
                {tutorialState == 1 && (
                  <View style={mobileStyles.textWrapper}>
                    <Text style={mobileStyles.header}>Where are we now?</Text>
                    <Text style={mobileStyles.body}>
                      Global renewable energy capacity today is 4 TW
                      (terawatts). 1 TW equals 1 trillion watts, enough to power
                      roughly 48 billion lightbulbs! Reaching 12 TW by 2030 is
                      the goal.
                    </Text>
                  </View>
                )}
                {tutorialState == 2 && (
                  <View style={mobileStyles.textWrapper}>
                    <Text style={mobileStyles.header}>
                      Is the goal possible?
                    </Text>
                    <Text style={mobileStyles.body}>
                      Absolutely! Renewable energy is the fastest growing source
                      of new energy on the planet and we’re already on track to
                      double renewables by 2030. But we can do better and this
                      app lets you develop a plan to do it.
                    </Text>
                  </View>
                )}
                {tutorialState == 3 && (
                  <View style={mobileStyles.textWrapper}>
                    <Text style={mobileStyles.header}>
                      Will 12 TW by 2030 solve climate change?
                    </Text>
                    <Text style={mobileStyles.body}>
                      As you make your 12 TW plan on the app you’ll see the
                      difference it makes. We need to keep future warming to
                      less than 2° Celsius (C) and stay as close to 1.5°C as
                      possible. The difference might seem minor but even half a
                      degree will have enormous impacts on weather, sea levels,
                      biodiversity, food production, and human health.
                    </Text>
                  </View>
                )}
                {tutorialState == 4 && (
                  <View style={mobileStyles.textWrapper}>
                    <Text style={mobileStyles.header}>
                      Share your Energy and Climate Plan!
                    </Text>
                    <Text style={mobileStyles.body}>
                      You’ll have the option to send your plan to global leaders
                      at COP 29, the annual United Nation Climate Change
                      Conference happening from Nov 11-22, 2024 in Azerbaijan.
                    </Text>
                    <Text style={mobileStyles.body}>Ready to get started?</Text>
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
                  sendStateHome(5)
                  setTutorialState(5)
                } else {
                  setTutorialState(11)
                  sendStateHome(11)
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
