import React from 'react'
import Svg, { Mask, Path, Rect, Text } from 'react-native-svg'

type BAUCurvePopupProps = {
  label: string
}
export const BAUCurvePopup = ({ label }: BAUCurvePopupProps) => {
  return (
    <Svg width="87" height="29" viewBox="0 0 87 29" fill="none">
      <Mask
        id="path-1-outside-1_1928_1329"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="87"
        height="29"
        fill="black"
      >
        <Rect fill="white" width="87" height="29" />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M48.0415 9L44 2L39.9585 9H6C3.79086 9 2 10.7909 2 13V23C2 25.2091 3.79086 27 6 27H81C83.2091 27 85 25.2091 85 23V13C85 10.7909 83.2091 9 81 9H48.0415Z"
        />
      </Mask>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M48.0415 9L44 2L39.9585 9H6C3.79086 9 2 10.7909 2 13V23C2 25.2091 3.79086 27 6 27H81C83.2091 27 85 25.2091 85 23V13C85 10.7909 83.2091 9 81 9H48.0415Z"
        fill="white"
      />
      <Path
        d="M44 2L45.3597 1.215C45.0792 0.72924 44.5609 0.43 44 0.43C43.4391 0.43 42.9208 0.72924 42.6403 1.215L44 2ZM48.0415 9L46.6818 9.785C46.9622 10.2708 47.4805 10.57 48.0415 10.57V9ZM39.9585 9V10.57C40.5195 10.57 41.0378 10.2708 41.3182 9.785L39.9585 9ZM42.6403 2.785L46.6818 9.785L49.4011 8.215L45.3597 1.215L42.6403 2.785ZM41.3182 9.785L45.3597 2.785L42.6403 1.215L38.5989 8.215L41.3182 9.785ZM6 10.57H39.9585V7.43H6V10.57ZM3.57 13C3.57 11.6579 4.65795 10.57 6 10.57V7.43C2.92377 7.43 0.43 9.92377 0.43 13H3.57ZM3.57 23V13H0.43V23H3.57ZM6 25.43C4.65795 25.43 3.57 24.3421 3.57 23H0.43C0.43 26.0762 2.92378 28.57 6 28.57V25.43ZM81 25.43H6V28.57H81V25.43ZM83.43 23C83.43 24.3421 82.342 25.43 81 25.43V28.57C84.0762 28.57 86.57 26.0762 86.57 23H83.43ZM83.43 13V23H86.57V13H83.43ZM81 10.57C82.342 10.57 83.43 11.6579 83.43 13H86.57C86.57 9.92377 84.0762 7.43 81 7.43V10.57ZM48.0415 10.57H81V7.43H48.0415V10.57Z"
        fill="#757678"
        mask="url(#path-1-outside-1_1928_1329)"
      />
      <Text
        y={21.5}
        x={6.5}
        letterSpacing={0.787}
        fontSize="9"
        stroke="#757678"
        fill="#757678"
        strokeWidth={0.01}
      >
        {label}
      </Text>
    </Svg>
  )
}
