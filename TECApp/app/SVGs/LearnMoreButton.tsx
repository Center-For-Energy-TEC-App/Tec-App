import React from "react"
import { TouchableOpacity } from "react-native-gesture-handler"
import Svg, { Circle, G, Path, Rect, Text as TextSvg} from "react-native-svg"

type LearnMoreButtonProps = {
    onPress: ()=>void
}

export const LearnMoreButton = ({onPress}: LearnMoreButtonProps)=> {
    return (
        <TouchableOpacity onPress={onPress}>
<Svg width="70" height="60"fill="none">
    <G x={13.25} y={0}>
    <Rect x="1.5" y="1" width="32" height="32" rx="16" fill="white"/>
<Rect x="1.5" y="1" width="32" height="32" rx="16" stroke="#D9D9D9" stroke-width="1.77778"/>
<Path d="M23.8106 10.6907L14.3617 9.02218C14.174 8.98898 13.9817 8.99308 13.7956 9.03425C13.6095 9.07543 13.4333 9.15286 13.2771 9.26213C13.121 9.3714 12.9879 9.51037 12.8854 9.6711C12.783 9.83182 12.7132 10.0112 12.6801 10.1989L10.5219 22.4589C10.4553 22.8377 10.5418 23.2275 10.7625 23.5425C10.9831 23.8576 11.3198 24.0721 11.6986 24.139L21.1475 25.8075C21.2318 25.8225 21.3173 25.8301 21.4029 25.83C21.7444 25.8302 22.075 25.7099 22.3366 25.4902C22.5981 25.2706 22.7738 24.9658 22.8327 24.6294L24.9909 12.3694C25.0237 12.1817 25.0191 11.9893 24.9775 11.8034C24.9359 11.6174 24.8581 11.4414 24.7485 11.2856C24.6389 11.1297 24.4997 10.9969 24.3387 10.8948C24.1778 10.7928 23.9984 10.7234 23.8106 10.6907ZM21.1642 24.0418L12.2869 22.4741L14.345 10.7865L23.2223 12.3541L21.1642 24.0418ZM15.1358 12.9889C15.1759 12.7616 15.3047 12.5596 15.4938 12.4272C15.6829 12.2948 15.9168 12.243 16.1441 12.2831L21.0191 13.1442C21.2371 13.1776 21.4343 13.2925 21.5709 13.4657C21.7074 13.639 21.7731 13.8576 21.7547 14.0773C21.7362 14.2971 21.6351 14.5017 21.4716 14.6498C21.3081 14.7979 21.0946 14.8784 20.874 14.8751C20.823 14.875 20.772 14.8706 20.7217 14.862L15.8416 13.9973C15.6143 13.9571 15.4123 13.8283 15.2799 13.6392C15.1476 13.4501 15.0957 13.2162 15.1358 12.9889ZM14.6352 15.8464C14.6551 15.7338 14.697 15.6262 14.7584 15.5298C14.8199 15.4334 14.8998 15.35 14.9935 15.2844C15.0872 15.2189 15.1929 15.1724 15.3046 15.1478C15.4163 15.1231 15.5317 15.1206 15.6443 15.1406L20.5207 16.0024C20.7348 16.041 20.9267 16.1582 21.0586 16.3311C21.1905 16.5041 21.2529 16.7201 21.2335 16.9367C21.2141 17.1533 21.1144 17.3549 20.9539 17.5016C20.7933 17.6484 20.5837 17.7297 20.3662 17.7297C20.3152 17.7296 20.2642 17.7253 20.2139 17.7166L15.3382 16.8548C15.1114 16.814 14.9101 16.6849 14.7783 16.4959C14.6465 16.3069 14.5951 16.0733 14.6352 15.8464ZM14.1274 18.704C14.1676 18.4767 14.2963 18.2746 14.4854 18.1423C14.6745 18.0099 14.9085 17.958 15.1358 17.9981L17.5762 18.4297C17.7907 18.4673 17.9834 18.584 18.1161 18.7567C18.2489 18.9294 18.3121 19.1456 18.2932 19.3626C18.2744 19.5796 18.1748 19.7816 18.0143 19.9289C17.8537 20.0761 17.6438 20.1577 17.426 20.1578C17.3749 20.1578 17.3239 20.1532 17.2737 20.144L14.8354 19.7138C14.7225 19.6942 14.6146 19.6524 14.5179 19.591C14.4212 19.5296 14.3375 19.4497 14.2718 19.3559C14.206 19.2621 14.1594 19.1562 14.1346 19.0443C14.1098 18.9324 14.1074 18.8168 14.1274 18.704Z" fill="#266297"/>
</G>
    <TextSvg x={0} y={50} stroke="#0D5BA5" fill="#0D5BA5" strokeWidth={0.1}>Learn More</TextSvg>
</Svg>

</TouchableOpacity>
    )
}