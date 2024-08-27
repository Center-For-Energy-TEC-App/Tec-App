import * as d3 from 'd3'
import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import data from '../../GeoChart.world.geo.json'
import Svg, { Path, G, Rect } from 'react-native-svg'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'

export interface WorldMapProps {
  onSelectCountry: (country: string) => void
}

export const WorldMap = ({ onSelectCountry }: WorldMapProps) => {
  const windowWidth = Dimensions.get('window').width
  const windowHeight = Dimensions.get('window').height
  const widthScale = 3

  const projection = d3
    .geoNaturalEarth1()
    //@ts-expect-error: weird property error with map
    .fitSize([windowWidth * widthScale, windowHeight], data)
  const pathGenerator = d3.geoPath().projection(projection)

  return (
    <ReactNativeZoomableView
      onMoveShouldSetPanResponderCapture={() => true}
      minZoom={1.5}
      initialZoom={1.5}
      maxZoom={3}
      bindToBorders={true}
      zoomStep={0.5}
      contentHeight={windowHeight} // These lines break browser version
      contentWidth={windowWidth * widthScale} // These lines break browser version
      style={styles.container}
    >
      <Svg
        style={styles.svg}
        width={windowWidth * widthScale}
        height={windowHeight}
      >
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
              //@ts-expect-error
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C2B47',
  },
  svg: {
    height: '100%',
    width: '100%',
  },
})

export default WorldMap
