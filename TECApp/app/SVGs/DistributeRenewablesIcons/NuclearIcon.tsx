import React from 'react'
import { Svg, G, Path, Circle } from 'react-native-svg'

export const NuclearIcon = () => (
  <Svg width="22" height="22" fill="none">
    <G x={4} y={4}>
      <Circle x={7} y={7} r={11} fill="#EE8E35" />
      <Path
        d="M11.8732 2.12688C10.7975 1.05005 7.74199 2.35963 5.05049 5.05055C2.35957 7.74205 1.04999 10.7964 2.12682 11.8732C3.20307 12.95 6.25799 11.641 8.94949 8.94955C11.641 6.25805 12.95 3.20372 11.8732 2.12688Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.00524 7.00012H6.99999M2.12682 2.12696C1.04999 3.20262 2.35957 6.25812 5.05049 8.94962C7.74199 11.6411 10.7963 12.9501 11.8732 11.8733C12.95 10.797 11.641 7.74212 8.94949 5.05062C6.25799 2.35912 3.20365 1.05012 2.12682 2.12696Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
)
