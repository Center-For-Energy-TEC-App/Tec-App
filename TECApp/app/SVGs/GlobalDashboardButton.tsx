import React from "react"
import { TouchableOpacity } from "react-native-gesture-handler"
import Svg, { Path, Rect } from "react-native-svg"

type GlobalDashboardButtonProps = {
    onPress: ()=>void
}

export const GlobalDashboardButton = ({onPress}: GlobalDashboardButtonProps)=> {
    return (
        <TouchableOpacity onPress={onPress}>
        <Svg width="64" height="64" viewBox="0 0 64 64" fill="none">
  <Rect x="2" y="2" width="60" height="60" rx="30" fill="white"/>
  <Rect x="2" y="2" width="60" height="60" rx="30" stroke="#D9D9D9" stroke-width="3.33333"/>
  <Path d="M16.0964 30.0267H19.5067C20.4367 30.0267 21.3286 30.3961 21.9863 31.0537C22.6439 31.7114 23.0133 32.6033 23.0133 33.5333V35.2867C23.0133 36.2167 23.3828 37.1086 24.0404 37.7663C24.698 38.4239 25.59 38.7933 26.52 38.7933C27.45 38.7933 28.342 39.1628 28.9996 39.8204C29.6572 40.478 30.0267 41.37 30.0267 42.3V47.4636M24.7667 17.6394V20.3833C24.7667 21.5459 25.2285 22.6608 26.0505 23.4828C26.8725 24.3049 27.9875 24.7667 29.15 24.7667H30.0267C30.9567 24.7667 31.8486 25.1361 32.5063 25.7937C33.1639 26.4514 33.5333 27.3433 33.5333 28.2733C33.5333 29.2034 33.9028 30.0953 34.5604 30.7529C35.218 31.4105 36.11 31.78 37.04 31.78C37.97 31.78 38.862 31.4105 39.5196 30.7529C40.1772 30.0953 40.5467 29.2034 40.5467 28.2733C40.5467 27.3433 40.9161 26.4514 41.5737 25.7937C42.2314 25.1361 43.1233 24.7667 44.0533 24.7667H45.9189M37.04 46.6623V42.3C37.04 41.37 37.4095 40.478 38.0671 39.8204C38.7247 39.1628 39.6166 38.7933 40.5467 38.7933H45.9189M47.56 31.78C47.56 33.8523 47.1518 35.9042 46.3588 37.8187C45.5658 39.7333 44.4035 41.4728 42.9381 42.9381C41.4728 44.4035 39.7333 45.5658 37.8187 46.3588C35.9042 47.1518 33.8523 47.56 31.78 47.56C29.7077 47.56 27.6558 47.1518 25.7413 46.3588C23.8267 45.5658 22.0872 44.4035 20.6219 42.9381C19.1565 41.4728 17.9942 39.7333 17.2012 37.8187C16.4082 35.9042 16 33.8523 16 31.78C16 27.5949 17.6625 23.5812 20.6219 20.6219C23.5812 17.6625 27.5949 16 31.78 16C35.9651 16 39.9788 17.6625 42.9381 20.6219C45.8975 23.5812 47.56 27.5949 47.56 31.78Z" stroke="#266297" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</Svg>
</TouchableOpacity>
    )
}