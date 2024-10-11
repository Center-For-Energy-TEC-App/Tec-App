import React from 'react'
import Svg, { Mask, Path, Rect, Text } from 'react-native-svg'

type AlteredCurvePopupProps = {
  label: string
}
export const AlteredCurvePopup = ({ label }: AlteredCurvePopupProps) => {
  return (
    <Svg width="66" height="29" viewBox="0 0 66 29" fill="none">
      <Mask
        id="path-1-outside-1_2003_112"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="66"
        height="29"
        fill="black"
      >
        <Rect fill="white" width="66" height="29" />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6 2C3.79086 2 2 3.79086 2 6V16C2 18.2091 3.79086 20 6 20H28.9585L33 27L37.0415 20H60C62.2091 20 64 18.2091 64 16V6C64 3.79086 62.2091 2 60 2H6Z"
        />
      </Mask>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6 2C3.79086 2 2 3.79086 2 6V16C2 18.2091 3.79086 20 6 20H28.9585L33 27L37.0415 20H60C62.2091 20 64 18.2091 64 16V6C64 3.79086 62.2091 2 60 2H6Z"
        fill="white"
      />
      <Path
        d="M28.9585 20L30.3182 19.215C30.0378 18.7292 29.5195 18.43 28.9585 18.43V20ZM33 27L31.6403 27.785C31.9208 28.2708 32.4391 28.57 33 28.57C33.5609 28.57 34.0792 28.2708 34.3597 27.785L33 27ZM37.0415 20V18.43C36.4805 18.43 35.9622 18.7292 35.6818 19.215L37.0415 20ZM3.57 6C3.57 4.65795 4.65795 3.57 6 3.57V0.43C2.92377 0.43 0.43 2.92377 0.43 6H3.57ZM3.57 16V6H0.43V16H3.57ZM6 18.43C4.65795 18.43 3.57 17.3421 3.57 16H0.43C0.43 19.0762 2.92377 21.57 6 21.57V18.43ZM28.9585 18.43H6V21.57H28.9585V18.43ZM34.3597 26.215L30.3182 19.215L27.5989 20.785L31.6403 27.785L34.3597 26.215ZM35.6818 19.215L31.6403 26.215L34.3597 27.785L38.4011 20.785L35.6818 19.215ZM60 18.43H37.0415V21.57H60V18.43ZM62.43 16C62.43 17.3421 61.3421 18.43 60 18.43V21.57C63.0762 21.57 65.57 19.0762 65.57 16H62.43ZM62.43 6V16H65.57V6H62.43ZM60 3.57C61.3421 3.57 62.43 4.65795 62.43 6H65.57C65.57 2.92377 63.0762 0.43 60 0.43V3.57ZM6 3.57H60V0.43H6V3.57Z"
        fill="#266297"
        mask="url(#path-1-outside-1_2003_112)"
      />
      <Text
        y={15}
        x={6.5}
        letterSpacing={0.787}
        fontSize="9"
        stroke="#266297"
        fill="#266297"
        strokeWidth={0.01}
      >
        {label}
      </Text>
    </Svg>
  )
}
