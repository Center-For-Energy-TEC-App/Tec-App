import Svg, { Circle } from 'react-native-svg'
import React from 'react-native'

type PaginationCircleProps = {
  filled: boolean
}

export const PaginationCircle = ({ filled }: PaginationCircleProps) => {
  return (
    <Svg width="8" height="8" viewBox="0 0 8 8" fill="none">
      <Circle
        cx="4"
        cy="4"
        r="4"
        fill="#B5B1AA"
        fillOpacity={filled ? 1 : 0.5}
      />
    </Svg>
  )
}
