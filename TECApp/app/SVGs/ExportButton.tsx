import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Svg, { Circle, G, Path, Text as TextSvg } from 'react-native-svg'

type ExportButtonProps = {
  onPress: () => void
}

export const ExportButton = ({ onPress }: ExportButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Svg width="70" height="60" fill="none">
      <Circle
          cx={25}
          cy={17}
          r={16}
          fill="white"
          stroke="#D9D9D9"
          strokeWidth={1}
        />
        <G x={13.25} y={6}>
          <Path
            d="M4.38867 9.22266C4.38867 8.73174 4.78664 8.33377 5.27756 8.33377L7.94423 8.33377C8.43515 8.33377 8.83312 8.73174 8.83312 9.22266C8.83312 9.71358 8.43515 10.1115 7.94423 10.1115H6.16645L6.16645 16.3338H16.8331V10.1115H15.0553C14.5644 10.1115 14.1665 9.71358 14.1665 9.22266C14.1665 8.73174 14.5644 8.33377 15.0553 8.33377L17.722 8.33377C18.2129 8.33377 18.6109 8.73174 18.6109 9.22266V17.2227C18.6109 17.7136 18.2129 18.1115 17.722 18.1115H5.27756C4.78664 18.1115 4.38867 17.7136 4.38867 17.2227L4.38867 9.22266Z"
            fill="#266297"
          />
          <Path
            d="M12.1283 1.48301L16.5728 5.92745C16.9199 6.27458 16.9199 6.8374 16.5728 7.18453C16.2256 7.53166 15.6628 7.53166 15.3157 7.18453L12.3887 4.25751V13.6671C12.3887 14.158 11.9907 14.556 11.4998 14.556C11.0089 14.556 10.6109 14.158 10.6109 13.6671V4.25751L7.68388 7.18453C7.33675 7.53166 6.77393 7.53166 6.4268 7.18453C6.07967 6.8374 6.07967 6.27458 6.4268 5.92745L10.8712 1.48301C11.2184 1.13587 11.7812 1.13587 12.1283 1.48301Z"
            fill="#266297"
          />
        </G>
        {/* <TextSvg x={7} y={50} stroke="white" fill="white" strokeWidth={0.1}>
          Share your plan
        </TextSvg> */}
      </Svg>
    </TouchableOpacity>
  )
}
