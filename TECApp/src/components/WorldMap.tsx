import * as d3 from 'd3'
import React from 'react'
import { StyleSheet, Dimensions, Platform } from 'react-native'
import data from '../../GeoChart.world.geo.json'
import Svg, { Path, G, Rect } from 'react-native-svg'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'

export interface WorldMapProps {
  onSelectCountry: (country: string) => void
}

export const WorldMap = ({ onSelectCountry }: WorldMapProps) => {
  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height
  const widthScale = 3

  const projection = d3
    .geoNaturalEarth1()
    //@ts-expect-error: weird property error with map
    .fitSize([width * widthScale, height], data)
  const pathGenerator = d3.geoPath().projection(projection)

  return (
    <ReactNativeZoomableView
      onMoveShouldSetPanResponderCapture={() => true}
      minZoom={1.5}
      initialZoom={1.5}
      maxZoom={3}
      bindToBorders={true}
      zoomStep={0}
      contentHeight={-500}
      contentWidth={1250}
      style={styles.container}
    >
      <Svg style={styles.svg}>
        <G>
          <Rect
            x={0}
            y={0}
            height="100%"
            width="100%"
            fill="#1C2B47"
            onPress={() => onSelectCountry('Global')}
          />
          {data.features.map((feature, index) => (
            <Path
              // @ts-expect-error: weird property error with map
              d={pathGenerator(feature)}
              key={index}
              stroke="#FFF"
              strokeWidth={0}
              fill={feature.properties.color}
              onPress={() => {
                onSelectCountry(feature.properties.region)
              }}
            ></Path>
          ))}
        </G>
      </Svg>
    </ReactNativeZoomableView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '300%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C2B47',
    zIndex: -1,
    // backgroundColor: "white"
  },
  svg: {
    height: '100%',
    width: '100%',
    // marginBottom: "30%"
  },
})
