import Svg, { Circle, Path } from 'react-native-svg'
import React from 'react'

type SliderIndicatorProps = {
    color: string
}

export const SliderIndicator = ({color}: SliderIndicatorProps) => {
  return (
    <Svg width="6" height="6" viewBox="0 0 6 6" fill="none">
        <Circle cx="3" cy="3" r="3" fill={color}/>
    </Svg>
  )
}
