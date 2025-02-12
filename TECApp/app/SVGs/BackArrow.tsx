import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Svg, { Path } from 'react-native-svg'

type BackArrowProps = {
  onPress: () => void
}

export const BackArrow = ({ onPress }: BackArrowProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: 25,
        height: 50,
      }}
    >
      <Svg width="14" height="22" viewBox="0 0 8 14" fill="none">
        <Path
          d="M6.12137 13.4035L0.193491 7.49317C0.123131 7.42281 0.0734093 7.34659 0.044327 7.2645C0.0147755 7.18241 0 7.09446 0 7.00065C0 6.90684 0.0147755 6.81888 0.044327 6.7368C0.0734093 6.65471 0.123131 6.57849 0.193491 6.50813L6.12137 0.580246C6.28555 0.416072 6.49076 0.333984 6.73703 0.333984C6.98329 0.333984 7.19437 0.421935 7.37027 0.597837C7.54617 0.773738 7.63412 0.978956 7.63412 1.21349C7.63412 1.44803 7.54617 1.65325 7.37027 1.82915L2.19877 7.00065L7.37027 12.1722C7.53445 12.3363 7.61653 12.5385 7.61653 12.7787C7.61653 13.0193 7.52858 13.2276 7.35268 13.4035C7.17678 13.5794 6.97156 13.6673 6.73703 13.6673C6.50249 13.6673 6.29727 13.5794 6.12137 13.4035Z"
          fill="#B5B1AA"
        />
      </Svg>
    </TouchableOpacity>
  )
}
