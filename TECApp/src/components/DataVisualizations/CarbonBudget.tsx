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

const dummy1Point5Limit = 100
const dummy2Point0Limit = 148

const xMin = 2024
const xMax = 2060

type DataPoint = {
  year: number
  value: number
}

type CarbonBudgetProps = {
  BAUData: DataPoint[]
  dynamicData: DataPoint[]
}

export const CarbonBudget = ({ BAUData, dynamicData }: CarbonBudgetProps) => {
  const yMin = 0
  const yMax = Math.max(
    Math.max(...dynamicData.map((val) => val.value)),
    Math.max(...BAUData.map((val) => val.value)),
  )

  let sum = 0
  let dummy1Point5Year: number
  let dummy2Point0Year: number
  //calculating x-axis position of each temperature limit
  for (const i of dynamicData) {
    sum += i.value
    if (!dummy1Point5Year && sum > dummy1Point5Limit) {
      dummy1Point5Year = i.year
    }
    if (!dummy2Point0Year && sum > dummy2Point0Limit) {
      dummy2Point0Year = i.year
    }
  }

  //separate data based on 2 degree limit
  const data1 = dynamicData.filter((val) => val.year <= dummy2Point0Year)
  const data2 = dynamicData.filter((val) => val.year >= dummy2Point0Year)

  const y = d3.scaleLinear().domain([0, yMax]).range([graphHeight, 0])
  const x = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([leftMargin, graphWidth])

  const carbon_gradient1 = d3
    .area<DataPoint>()
    .x((d) => x(d.year))
    .y1((d) => y(d.value))
    .y0(graphHeight)
    .curve(d3.curveMonotoneX)(data1)

  const carbon_gradient2 = d3
    .area<DataPoint>()
    .x((d) => x(d.year))
    .y1((d) => y(d.value))
    .y0(graphHeight)
    .curve(d3.curveMonotoneX)(data2)

  const carbon_curve1 = d3
    .line<DataPoint>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)(data1)

  const carbon_curve2 = d3
    .line<DataPoint>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)(data2)

  const BAU_curve = d3
    .line<DataPoint>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)(BAUData)

  const yRange = yMax - yMin

  const verticalAxis = [
    yMin,
    yMin + yRange * 0.2,
    yMin + yRange * 0.4,
    yMin + yRange * 0.6,
    yMin + yRange * 0.8,
    yMax,
  ]
  const horizontalAxis = [2030, 2040, 2050, 2060]

  //helper method for calculating y coordinate based on graph value
  //calculated as proportion of graph height from the top
  const calculateY = (val: number) => {
    return (graphHeight * (yMax - val)) / yRange
  }

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
          <GraphKey label="BAU CARBON EMISSIONS" color="#266297" />
          <GraphKey label="ALTERED CARBON EMISSIONS" color="#58C4D4" />

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
                x={-(graphHeight - 50)}
                y={15}
              >
                Emissions (GT)
              </TextSvg>
              <TextSvg
                x={leftMargin - 5}
                y={graphHeight + 25}
                strokeWidth={0.1}
                fontWeight={700}
                fontSize={10}
                fill="#9E9FA7"
                stroke="#9E9FA7"
              >
                2024
              </TextSvg>
              {horizontalAxis.map((e, key) => (
                <TextSvg
                  key={key}
                  x={graphWidth * ((e - 2030) / 50) + leftMargin + 35}
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
              <Path d={carbon_gradient1} strokeWidth={0} fill={'url(#grad1)'} />
              <Path d={carbon_gradient2} strokeWidth={0} fill={'url(#grad2)'} />
              <Path
                d={carbon_curve1}
                strokeWidth={2}
                stroke="#58C4D4"
                fill="none"
              />
              <Path
                d={carbon_curve2}
                strokeWidth={2}
                stroke="#58C4D4"
                fill="none"
              />
              <Path
                d={BAU_curve}
                strokeWidth={2}
                stroke="#266297"
                fill="none"
              />
              <Rect
                x={leftMargin}
                y={calculateY(data1[data1.length - 1].value) - 25}
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
                y={calculateY(data1[data1.length - 1].value) - 12}
              >
                2.0°C LIMIT
              </TextSvg>
              <Line
                strokeDasharray="6"
                x1={leftMargin}
                x2={graphWidth}
                y1={calculateY(data1[data1.length - 1].value)}
                y2={calculateY(data1[data1.length - 1].value)}
                stroke="#58C4D4"
                strokeWidth={1}
              />
              <Rect
                opacity={0.5}
                x={leftMargin}
                y={
                  calculateY(
                    dynamicData.find((val) => val.year == dummy1Point5Year)
                      .value,
                  ) - 25
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
                  calculateY(
                    dynamicData.find((val) => val.year == dummy1Point5Year)
                      .value,
                  ) - 12
                }
              >
                1.5°C LIMIT
              </TextSvg>
              <Line
                opacity={0.5}
                strokeDasharray="6"
                x1={leftMargin}
                x2={graphWidth}
                y1={calculateY(
                  dynamicData.find((val) => val.year == dummy1Point5Year).value,
                )}
                y2={calculateY(
                  dynamicData.find((val) => val.year == dummy1Point5Year).value,
                )}
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
