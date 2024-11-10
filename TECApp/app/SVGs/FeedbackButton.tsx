import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Svg, { Circle, G, Path, Text as TextSvg } from 'react-native-svg'

type FeedbackButtonProps = {
  onPress: () => void
}

export const FeedbackButton = ({ onPress }: FeedbackButtonProps) => {
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
        <G x={35} y={11}>
          <Svg width="29" height="30" viewBox="0 0 29 30" fill="none">
            <Path
              d="M0 3.5C0 2.12 1.12 1 2.5 1H17.5C18.88 1 20 2.12 20 3.5V14.2143C20 14.8773 19.7366 15.5132 19.2678 15.9821C18.7989 16.4509 18.163 16.7143 17.5 16.7143H11.5143L7.83857 20.39C7.54722 20.6803 7.17646 20.8778 6.77303 20.9576C6.3696 21.0375 5.95155 20.9961 5.57159 20.8388C5.19163 20.6814 4.86676 20.4151 4.63792 20.0734C4.40909 19.7316 4.28654 19.3298 4.28571 18.9186V16.7143H2.5C1.83696 16.7143 1.20107 16.4509 0.732233 15.9821C0.263392 15.5132 0 14.8773 0 14.2143V3.5ZM2.5 3.14286C2.40528 3.14286 2.31444 3.18048 2.24746 3.24746C2.18048 3.31444 2.14286 3.40528 2.14286 3.5V14.2143C2.14286 14.4114 2.30286 14.5714 2.5 14.5714H5.35714C5.6413 14.5714 5.91383 14.6843 6.11476 14.8852C6.31569 15.0862 6.42857 15.3587 6.42857 15.6429V18.7714L10.3143 14.8857C10.515 14.6847 10.7874 14.5717 11.0714 14.5714H17.5C17.5947 14.5714 17.6856 14.5338 17.7525 14.4668C17.8195 14.3998 17.8571 14.309 17.8571 14.2143V3.5C17.8571 3.40528 17.8195 3.31444 17.7525 3.24746C17.6856 3.18048 17.5947 3.14286 17.5 3.14286H2.5Z"
              fill="#266297"
            />
          </Svg>
        </G>
        <TextSvg x={17.5} y={60} stroke="#FFF" fill="#FFF" strokeWidth={0.1}>
          Feedback
        </TextSvg>
      </Svg>
    </TouchableOpacity>
  )
}
