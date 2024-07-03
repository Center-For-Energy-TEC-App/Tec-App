import { WorldMap } from '../components/WorldMap'
import BottomSheet from '@gorhom/bottom-sheet'
import React from 'react'
import { useMemo } from 'react'
import { Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export const Home = () => {
  const snapPoints = useMemo(() => ['25%', '50%', '70%'], [])

  return (
    <View style={{flex:1}}>
      <WorldMap />
      <GestureHandlerRootView>
        <BottomSheet snapPoints={snapPoints}>
          <View>
            <Text>This is awesome!</Text>
          </View>
        </BottomSheet>
      </GestureHandlerRootView>
    </View>
  )
}
