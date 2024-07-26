import * as d3 from 'd3'
import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Svg, {
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as TextSvg,
} from 'react-native-svg'
import { GraphKey } from './GraphKey'

const vw = Dimensions.get('window').width

const svgHeight = 300
const graphHeight = 190
const offset = 20

const graphWidth = vw * 0.8
const leftMargin = 60

const dummyData = [
  { year: 2024, value: 4 },
  { year: 2025, value: 4.4 },
  { year: 2026, value: 4.9 },
  { year: 2027, value: 5.4 },
  { year: 2028, value: 5.8 },
  { year: 2029, value: 6.2 },
  { year: 2030, value: 6.3 },
]

const dummy1Point5Limit = 10
const dummy2Point0Limit = 18

const yMin = Math.min(...dummyData.map((val) => val.value))

const yMax = Math.max(...dummyData.map((val) => val.value))

const xMin = 2024
const xMax = 2030

type DataPoint = {
  year: number
  value: number
}

export const CarbonBudget = () => {
  let sum = 0
  let dummy1Point5Year: number
  let dummy2Point0Year: number
  for (const i of dummyData) {
    sum += i.value
    if (!dummy1Point5Year && sum > dummy1Point5Limit) {
      dummy1Point5Year = i.year
    }
    if (!dummy2Point0Year && sum > dummy2Point0Limit) {
      dummy2Point0Year = i.year
    }
  }

  const dummyData1 = dummyData.filter((val) => val.year <= dummy2Point0Year)

  const dummyData2 = dummyData.filter((val) => val.year >= dummy2Point0Year)

  const y = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([graphHeight + offset, offset])
  const x = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([leftMargin, graphWidth])

  const carbon_gradient1 = d3
    .area<DataPoint>()
    .x((d) => x(d.year))
    .y1((d) => y(d.value))
    .y0(graphHeight + offset)
    .curve(d3.curveMonotoneX)(dummyData1)

  const carbon_gradient2 = d3
    .area<DataPoint>()
    .x((d) => x(d.year))
    .y1((d) => y(d.value))
    .y0(graphHeight + offset)
    .curve(d3.curveMonotoneX)(dummyData2)

  const carbon_curve1 = d3
    .line<DataPoint>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)(dummyData1)

  const carbon_curve2 = d3
    .line<DataPoint>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)(dummyData2)

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
    <View style={{ width: '100%' }}>
      <Text style={styles.header}>Carbon Budget</Text>
      <Text style={styles.body}>
        This graph shows the resulting emissions in gigatons (GT) of your
        manipulated global renewables over time. The area under the curve shows
        the amount of emissions you’re allowed to emit before exceeding the
        global temperature threshold.
      </Text>
      <View style={styles.graphContainer}>
        <View style={styles.graphInnerContainer}>
          <GraphKey label="CUMULATIVE CARBON EMISSIONS" color="#266297" />
          <Svg width={graphWidth} height={svgHeight}>
            <Defs>
              <LinearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <Stop stopColor="#58C4D4" />
                <Stop offset="1" stopColor="#58C4D4" stopOpacity={0} />
              </LinearGradient>
              <LinearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                <Stop stopColor="#9E9FA7" />
                <Stop offset="1" stopColor="#9E9FA7" stopOpacity={0} />
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
                    y={(graphHeight * (yMax - e)) / yRange + offset + 3.5}
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
                x={-(graphHeight + offset - 50)}
                y={15}
              >
                Emissions (GT)
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
              <Path d={carbon_gradient1} strokeWidth={0} fill={'url(#grad1)'} />
              <Path d={carbon_gradient2} strokeWidth={0} fill={'url(#grad2)'} />
              <Path
                d={carbon_curve1}
                strokeWidth={2}
                stroke="#266297"
                fill="none"
              />
              <Path
                d={carbon_curve2}
                strokeWidth={2}
                stroke="#266297"
                fill="none"
              />
              <Rect
                x={leftMargin}
                y={
                  (graphHeight *
                    (yMax - dummyData1[dummyData1.length - 1].value)) /
                    yRange +
                  offset -
                  25
                }
                width={62}
                height={20}
                rx={4}
                ry={4}
                fill="none"
                stroke="#58C4D4"
                strokeWidth={1}
              />
              <TextSvg
                stroke="#58C4D4"
                fill="#58C4D4"
                strokeWidth={0.05}
                fontWeight={400}
                letterSpacing={0.787}
                fontSize={8}
                x={leftMargin + 3}
                y={
                  (graphHeight *
                    (yMax - dummyData1[dummyData1.length - 1].value)) /
                    yRange +
                  offset -
                  12
                }
              >
                2.0°C LIMIT
              </TextSvg>
              <Line
                strokeDasharray="6"
                x1={leftMargin}
                x2={graphWidth}
                y1={
                  (graphHeight *
                    (yMax - dummyData1[dummyData1.length - 1].value)) /
                    yRange +
                  offset
                }
                y2={
                  (graphHeight *
                    (yMax - dummyData1[dummyData1.length - 1].value)) /
                    yRange +
                  offset
                }
                stroke="#58C4D4"
                strokeWidth={1}
              />
              <Rect
              opacity={0.5}
                x={leftMargin}
                y={
                  (graphHeight *
                    (yMax -
                      dummyData.find((val) => val.year == dummy1Point5Year)
                        .value)) /
                    yRange +
                  offset -
                  25
                }
                width={62}
                height={20}
                rx={4}
                ry={4}
                fill="none"
                stroke="#58C4D4"
                strokeWidth={1}
              />
              <TextSvg
              opacity={0.5}
                stroke="#58C4D4"
                fill="#58C4D4"
                strokeWidth={0.05}
                fontWeight={400}
                letterSpacing={0.787}
                fontSize={8}
                x={leftMargin + 3}
                y={
                  (graphHeight *
                    (yMax -
                      dummyData.find((val) => val.year == dummy1Point5Year)
                        .value)) /
                    yRange +
                  offset -
                  12
                }
              >
                1.5°C LIMIT
              </TextSvg>
              <Line
              opacity={0.5}
                strokeDasharray="6"
                x1={leftMargin}
                x2={graphWidth}
                y1={
                  (graphHeight *
                    (yMax -
                      dummyData.find((val) => val.year == dummy1Point5Year)
                        .value)) /
                    yRange +
                  offset
                }
                y2={
                  (graphHeight *
                    (yMax -
                      dummyData.find((val) => val.year == dummy1Point5Year)
                        .value)) /
                    yRange +
                  offset
                }
                stroke="#58C4D4"
                strokeWidth={1}
              />
            </G>
          </Svg>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    fontFamily: 'Brix Sans',
    fontSize: 24,
    marginBottom: 8,
  },
  body: {
    fontFamily: 'Roboto',
    fontSize: 14,
  },
  graphContainer: {
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
  },
  graphInnerContainer: {
    width: vw * 0.8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
})
