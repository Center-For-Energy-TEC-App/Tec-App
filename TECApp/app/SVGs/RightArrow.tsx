import React from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Svg, { Path } from 'react-native-svg'

type ArrowProps = {
  onPress: () => void
  render: boolean
}

export const RightArrow = ({ onPress, render }: ArrowProps) => {
  return (
    <>
      {render ? (
        <TouchableOpacity onPress={onPress}>
          <Svg width="45" height="45" viewBox="0 0 45 45" fill="none">
            <Path
              d="M17.5224 10.4947L28.6372 21.5765C28.7691 21.7084 28.8624 21.8514 28.9169 22.0053C28.9723 22.1592 29 22.3241 29 22.5C29 22.6759 28.9723 22.8408 28.9169 22.9947C28.8624 23.1486 28.7691 23.2916 28.6372 23.4235L17.5224 34.5383C17.2146 34.8461 16.8298 35 16.3681 35C15.9063 35 15.5106 34.8351 15.1807 34.5053C14.8509 34.1755 14.686 33.7907 14.686 33.3509C14.686 32.9112 14.8509 32.5264 15.1807 32.1966L24.8773 22.5L15.1807 12.8034C14.8729 12.4956 14.719 12.1165 14.719 11.6662C14.719 11.215 14.8839 10.8245 15.2137 10.4947C15.5435 10.1649 15.9283 10 16.3681 10C16.8078 10 17.1926 10.1649 17.5224 10.4947Z"
              fill="#266297"
            />
          </Svg>
        </TouchableOpacity>
      ) : (
        <Svg width="45" height="45" viewBox="0 0 45 45" fill="none" />
      )}
    </>
  )
}
