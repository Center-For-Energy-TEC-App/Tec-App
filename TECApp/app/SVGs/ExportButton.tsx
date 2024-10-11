import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Svg, { Circle, G, Path, Text as TextSvg } from 'react-native-svg'

type ExportButtonProps = {
  onPress: () => void
}

export const ExportButton = ({ onPress }: ExportButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Svg width="100" height="70" fill="none">
        <Circle
          cx={44.5}
          cy={21}
          r={20}
          fill="white"
          stroke="#D9D9D9"
          strokeWidth={1.75}
        />
        <G x={30} y={6}>
          <Svg width="29" height="30" viewBox="0 0 29 30" fill="none">
            <Path
              d="M4.94409 12.6172C4.94409 11.9575 5.47886 11.4227 6.13854 11.4227L9.72187 11.4227C10.3815 11.4227 10.9163 11.9575 10.9163 12.6172C10.9163 13.2769 10.3815 13.8116 9.72187 13.8116L7.33298 13.8116L7.33298 22.1727H21.6663V13.8116L19.2774 13.8116C18.6178 13.8116 18.083 13.2769 18.083 12.6172C18.083 11.9575 18.6178 11.4227 19.2774 11.4227L22.8608 11.4227C23.5204 11.4227 24.0552 11.9575 24.0552 12.6172V23.3672C24.0552 24.0269 23.5204 24.5616 22.8608 24.5616H6.13854C5.47886 24.5616 4.94409 24.0269 4.94409 23.3672L4.94409 12.6172Z"
              fill="#266297"
            />
            <Path
              d="M15.3442 2.21703L21.3165 8.18926C21.7829 8.65572 21.7829 9.412 21.3165 9.87846C20.85 10.3449 20.0937 10.3449 19.6273 9.87846L15.6941 5.94528V18.5894C15.6941 19.2491 15.1593 19.7839 14.4997 19.7839C13.84 19.7839 13.3052 19.2491 13.3052 18.5894V5.94528L9.37203 9.87846C8.90557 10.3449 8.14929 10.3449 7.68283 9.87846C7.21637 9.412 7.21637 8.65572 7.68283 8.18926L13.655 2.21703C14.1215 1.75057 14.8778 1.75057 15.3442 2.21703Z"
              fill="#266297"
            />
          </Svg>
        </G>
        <TextSvg x={0} y={60} stroke="#FFF" fill="#FFF" strokeWidth={0.1}>
          Share your plan
        </TextSvg>
      </Svg>
    </TouchableOpacity>
  )
}
