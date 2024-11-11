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

const svgHeight = 300 //height of whole svg
const graphHeight = 190 //height of graph graph
const offset = 20 //graph starts this amount from the top of the svg container (allows for axes label to peek out above strict graph limits)

const graphWidth = vw * 0.8
const leftMargin = 65

export type CurveObject = {
  color: string
  curve: string
  region?: string
}

/*
 * Note: we separate gradient and gradientCurve because having a single area curve
 * forces borders on all sides when we only want the stroked curve on the top of the gradient
 */
type LineGraphProps = {
  gradient?: CurveObject //area curve for gradient
  gradientCurve?: CurveObject //line curve for gradient border
  lineCurves?: CurveObject[] //generic line curves
  yMin: number //minimum y-axis value of data
  yMax: number //maximum y-axis value of data
}

export const LineGraph = ({
  gradient,
  gradientCurve,
  lineCurves,
  yMin,
  yMax,
}: LineGraphProps) => {
  const yRange = yMax - yMin

  //y-axis label calculations
  const verticalAxis = [
    yMin,
    yMin + yRange * 0.2,
    yMin + yRange * 0.4,
    yMin + yRange * 0.6,
    yMin + yRange * 0.8,
    yMax,
  ]
  const horizontalAxis = [2025, 2026, 2027, 2028, 2029, 2030]

  //helper method for calculating y coordinate based on graph value
  //calculated as proportion of graph height from the top
  const calculateY = (val: number) => {
    return (graphHeight * (yMax - val)) / yRange
  }

  return (
    <Svg width={graphWidth} height={svgHeight}>
      {/* Gradient definitions*/}
      {gradientCurve ? (
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop
              offset="0"
              stopColor={gradientCurve.color}
              stopOpacity={0.9}
            />
            <Stop offset="1" stopColor="#FFF" stopOpacity={0.01} />
          </LinearGradient>
        </Defs>
      ) : (
        <></>
      )}

      {/* Graph frame */}
      <G y={offset}>
        {verticalAxis.map((e, key) => (
          <G key={key}>
            <Line
              key={key}
              x1={leftMargin}
              x2={graphWidth}
              y1={calculateY(e)}
              y2={calculateY(e)}
              stroke="#E9E9E9"
              strokeWidth={2}
            />
            <TextSvg
              strokeWidth={0.1}
              y={calculateY(e) + 3.5}
              x={
                e >= 10000
                  ? leftMargin - 42
                  : e >= 1000
                    ? leftMargin - 37
                    : leftMargin - 35
              } //double digits take up more space
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
          x={-(graphHeight - 30)}
          y={10}
        >
          Renewable Energy(TWh)
        </TextSvg>
        {horizontalAxis.map((e, key) => (
          <TextSvg
            key={key}
            x={graphWidth * (-(2025 - e) / 7.2) + leftMargin}
            y={graphHeight + 25}
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
          y={graphHeight + 50}
        >
          Years
        </TextSvg>
      </G>
      {/* Graph Curves */}
      <G y={offset}>
        {gradient && gradientCurve ? (
          <>
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
          </>
        ) : (
          <></>
        )}
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
