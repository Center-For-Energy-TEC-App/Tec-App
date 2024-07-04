import React, { Pressable } from 'react-native'
import Svg, { Path } from 'react-native-svg'

type ArrowProps = {
  onPress: () => void
  render: boolean
}

export const LeftArrow = ({ onPress, render }: ArrowProps) => {
  return (
    <>
      {render ? (
        <Pressable onPress={onPress}>
          <Svg width="45" height="45" viewBox="0 0 45 45" fill="none">
            <Path
              d="M26.1636 34.5053L15.0488 23.4235C14.9169 23.2916 14.8237 23.1486 14.7691 22.9947C14.7137 22.8408 14.686 22.6759 14.686 22.5C14.686 22.3241 14.7137 22.1592 14.7691 22.0053C14.8237 21.8514 14.9169 21.7084 15.0488 21.5765L26.1636 10.4617C26.4714 10.1539 26.8562 10 27.318 10C27.7797 10 28.1755 10.1649 28.5053 10.4947C28.8351 10.8245 29 11.2093 29 11.6491C29 12.0888 28.8351 12.4736 28.5053 12.8034L18.8087 22.5L28.5053 32.1966C28.8131 32.5044 28.967 32.8835 28.967 33.3338C28.967 33.785 28.8021 34.1755 28.4723 34.5053C28.1425 34.8351 27.7577 35 27.318 35C26.8782 35 26.4934 34.8351 26.1636 34.5053Z"
              fill="#266297"
            />
          </Svg>
        </Pressable>
      ) : (
        <Svg width="45" height="45" viewBox="0 0 45 45" fill="none" />
      )}
    </>
  )
}
