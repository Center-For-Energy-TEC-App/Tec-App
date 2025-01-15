import Svg, { G, Path, Rect, Text as TextSvg, TSpan } from 'react-native-svg'
import React from 'react'

export const Tooltip6 = () => {
  return (
    <Svg width="240" height="135" viewBox="0 0 240 135" fill="none">
      <Rect x="8.5" y="9.125" width="223" height="120" rx="3.5" fill="white" />
      <Rect
        x="8.5"
        y="9.125"
        width="223"
        height="120"
        rx="3.5"
        stroke="#A7AFB2"
      />
      <Path d="M24 8.625L40 8.625L32 0.625L24 8.625Z" fill="#A7AFB2" />
      <Path d="M24 10.125L40 10.125L32 2.125L24 10.125Z" fill="white" />
      <TextSvg y={33} x={20} fill="black" stroke="black" strokeWidth={0.5}>
        More Information
      </TextSvg>
      <TextSvg fill="black" stroke="black" strokeWidth={0}>
        <G y={50} x={10}>
          <TSpan x={10} fontSize={10}>
            Each region has its unique mix
          </TSpan>
          <TSpan x={10} dy={15} fontSize={10}>
            of renewable energy technologies. Click
          </TSpan>
          <TSpan x={10} dy={15} fontSize={10}>
            the information icon above the slider
          </TSpan>
          <TSpan x={10} dy={15} fontSize={10}>
            to learn more about each technology and
          </TSpan>
          <TSpan x={10} dy={15} fontSize={10}>
            its contribution to its respective region.
          </TSpan>
        </G>
      </TextSvg>
    </Svg>
  )
}
