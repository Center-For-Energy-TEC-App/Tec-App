import React from 'react'
import Svg, { Rect } from 'react-native-svg'

export const TrackerButton = () => {
  return (
    <Svg width="108" height="71" viewBox="0 0 108 71" fill="none">
      <Rect x="2" y="5" width="104" height="66" rx="8" fill="#C4C4C4" />
      <Rect y="3" width="108" height="67" rx="8" fill="#979797" />
      <Rect
        x="1"
        y="1"
        width="106"
        height="65"
        rx="7"
        fill="#FBFBFB"
        stroke="#D9D9D9"
        stroke-width="2"
      />
    </Svg>
  )
}
