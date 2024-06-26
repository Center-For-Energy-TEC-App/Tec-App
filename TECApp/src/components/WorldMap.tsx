import * as d3 from 'd3'
import React from 'react'
import { StyleSheet, Dimensions, Platform } from 'react-native'
import data from '../../GeoChart.world.geo.json'
import Svg, { Path, G } from 'react-native-svg'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'

export const WorldMap = () => {
  const web = Platform.OS == 'web'

  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height
  const widthScale = web ? 1 : 3

  const projection = d3
    .geoNaturalEarth1()
    .fitSize([width * widthScale, height], data)
  const pathGenerator = d3.geoPath().projection(projection)

  return (
    <ReactNativeZoomableView
      minZoom={1.5}
      initialZoom={1.5}
      maxZoom={3}
      bindToBorders={true}
      // panBoundaryPadding={500}
      zoomStep={0}
      contentHeight={-500}
      contentWidth={1250}
      // contentWidth={200}
      style={web ? webStyles.container : mobileStyles.container}
    >
      <Svg style={web ? webStyles.svg : mobileStyles.svg}>
        <G>
          {data.features.map((feature, index) => (
            <Path
              d={pathGenerator(feature)}
              key={index}
              stroke="#1C2B47"
              strokeWidth={0.25}
              fill="#2c4166"
              //@ts-expect-error: to allow clicking to work on web
              onClick={() => {
                alert(feature.properties.admin)
              }}
              onPress={() => {
                alert(feature.properties.admin)
              }}
            ></Path>
          ))}
        </G>
      </Svg>
    </ReactNativeZoomableView>
  )
}

const webStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C2B47',
    // backgroundColor: "white"
  },
  svg: {
    height: '100%',
    width: '100%',
    // backgroundColor: "red",
  },
})

const mobileStyles = StyleSheet.create({
  container: {
    width: '300%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C2B47',
    // backgroundColor: "white"
  },
  svg: {
    height: '100%',
    width: '100%',
    // marginBottom: "30%"
  },
})
