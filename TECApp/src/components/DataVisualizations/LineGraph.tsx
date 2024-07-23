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

export type CurveObject = {
  color: string
  curve: string
  region?: string
}

type LineGraphProps = {
  gradient: CurveObject
  gradientCurve: CurveObject
  lineCurves: CurveObject[]
  yMin: number
  yMax: number
}

export const LineGraph = ({
  gradient,
  gradientCurve,
  lineCurves,
  yMin,
  yMax,
}: LineGraphProps) => {
  const yRange = yMax - yMin

  const verticalAxis = [
    yMin,
    yMin + yRange * 0.2,
    yMin + yRange * 0.4,
    yMin + yRange * 0.6,
    yMin + yRange * 0.8,
    yMax,
  ]
  const horizontalAxis = [2024, 2026, 2028, 2030]

  return (
    <Svg width={graphWidth} height={svgHeight}>
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={gradientCurve.color} stopOpacity={0.9} />
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
              y1={(graphHeight * (e - yMin)) / yRange + offset}
              y2={(graphHeight * (e - yMin)) / yRange + offset}
              stroke="#E9E9E9"
              strokeWidth={2}
            />
            <TextSvg
              strokeWidth={0.1}
              y={
                (graphHeight * (yMax + yMin - e - yMin)) / yRange + offset + 3.5
              }
              x={e >= 10 ? leftMargin - 25 : leftMargin - 20}
              fontSize={10}
              fill="#9E9FA7"
              stroke="#9E9FA7"
            >
              {e.toFixed(1)}
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
          d={gradient.curve}
          strokeWidth={0}
          stroke={gradient.color}
          fill="url(#grad)"
        />
        <Path
          d={gradientCurve.curve}
          strokeWidth={2}
          stroke={gradientCurve.color}
          fill="none"
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
      </G>
    </Svg>
  )
}
