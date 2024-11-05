import React from 'react'
import Svg, { Defs, G, Path, Rect } from 'react-native-svg'

export const TrackerButtonArrow = () => {
  return (
    <Svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <G clip-path="url(#clip0_2572_6978)">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4.95236 9.52713H9.52393L9.52393 4.95556L11.0478 4.95556L11.0478 11.051L4.95236 11.051V9.52713Z"
          fill="black"
        />
      </G>
      {/* <Defs>
    <clipPath id="clip0_2572_6978">
      <Rect width="12.9304" height="12.9304" fill="white" transform="translate(0 9.14453) rotate(-45)"/>
    </clipPath>
  </Defs> */}
    </Svg>
  )
}
