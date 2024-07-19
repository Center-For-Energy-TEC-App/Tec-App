import React, { Dimensions } from 'react-native'
import Svg, {
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as TextSvg,
} from 'react-native-svg'

const vw = Dimensions.get('window').width

const svgHeight = 300
const graphHeight = 190
const offset = 20

const graphWidth = vw * 0.8
const leftMargin = 60

const verticalAxis = [0, 4, 8, 12, 16, 20]
const horizontalAxis = [2024, 2026, 2028, 2030]

export type CurveObject = {
  color: string
  curve: string
  region?: string
}

type LineGraphProps = {
  gradientCurve: CurveObject
  lineCurves: CurveObject[]
}

export const LineGraph = ({ gradientCurve, lineCurves }: LineGraphProps) => {
  return (
    <Svg width={graphWidth} height={svgHeight}>
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={gradientCurve.color} stopOpacity={0.8} />
          <Stop offset="1" stopColor="#FFF" stopOpacity={0.01} />
        </LinearGradient>
      </Defs>

      {/* Graph frame */}
      <G>
        {verticalAxis.map((e, key) => (
          <G key={key}>
            <Line
              key={key}
              x1={leftMargin}
              x2={graphWidth}
              y1={graphHeight * (e / 20) + offset}
              y2={graphHeight * (e / 20) + offset}
              stroke="#E9E9E9"
              strokeWidth={2}
            />
            <TextSvg
              strokeWidth={0.1}
              y={graphHeight * ((20 - e) / 20) + offset + 3.5}
              x={e >= 10 ? leftMargin - 22.5 : leftMargin - 17.5}
              fontSize={10}
              fill="#9E9FA7"
              stroke="#9E9FA7"
            >
              {e}
            </TextSvg>
          </G>
        ))}
        <TextSvg
          transform="rotate(270)"
          stroke="#000"
          fill="#000"
          strokeWidth={0.05}
          fontWeight={400}
          fontFamily="Roboto"
          fontSize={14}
          x={-(graphHeight + offset - 30)}
          y={15}
        >
          Renewable Capacity (TW)
        </TextSvg>
        {horizontalAxis.map((e, key) => (
          <TextSvg
            key={key}
            x={graphWidth * (-(2024 - e) / 8.3) + leftMargin}
            y={graphHeight + offset + 25}
            strokeWidth={0.1}
            fontWeight={700}
            fontSize={10}
            fill="#9E9FA7"
            stroke="#9E9FA7"
          >
            {e}
          </TextSvg>
        ))}
        <TextSvg
          stroke="#000"
          fill="#000"
          strokeWidth={0.05}
          fontWeight={400}
          fontFamily="Roboto"
          fontSize={14}
          x={graphWidth / 2}
          y={graphHeight + offset + 50}
        >
          Years
        </TextSvg>
      </G>
      {/* Graph Curves */}
      <G>
        <Path
          d={gradientCurve.curve}
          strokeWidth={2}
          stroke={gradientCurve.color}
          fill="url(#grad)"
        />
        {lineCurves.map((curveObject, key) => (
          <Path
            key={key}
            d={curveObject.curve}
            strokeWidth={2}
            fill="none"
            stroke={curveObject.color}
          />
        ))}
        <Line
          x1={leftMargin}
          x2={graphWidth}
          y1={graphHeight + offset}
          y2={graphHeight + offset}
          stroke="#E9E9E9"
          strokeWidth={2}
        />
        <Line
          x1={leftMargin}
          x2={leftMargin}
          y1={graphHeight + offset + 3}
          y2={0}
          stroke="#FFF"
          strokeWidth={2.2}
        ></Line>
        <Line
          x1={graphWidth}
          x2={graphWidth}
          y1={graphHeight + offset + 3}
          y2={0}
          stroke="#FFF"
          strokeWidth={2.2}
        ></Line>
      </G>
    </Svg>
  )
}
