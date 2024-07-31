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
const offset = 30

const svgWidth = vw * 0.8
const leftMargin = 60
const graphWidth = svgWidth-leftMargin

const dummyBAU = [
  { year: 2024, value: 4 },
  { year: 2030, value: 4.55 },
  { year: 2035, value: 4.45 },
  { year: 2040, value: 4.3},
  { year: 2045, value:  4.1},
  { year: 2050, value: 3.9 },
]

const dummyAltered = [
  { year: 2024, value: 4 },
  { year: 2030, value: 4.3 },
  { year: 2035, value: 4.2 },
  { year: 2040, value: 4.0},
  { year: 2045, value: 3.7 },
  { year: 2050, value: 3.4 },
]

const dummy1Point5Limit = 5
const dummy2Point0Limit = 13

const yMin = Math.min(Math.min(...dummyAltered.map((val) => val.value)),Math.min(...dummyBAU.map((val) => val.value)))
const yMax = Math.max(Math.max(...dummyAltered.map((val) => val.value)),Math.max(...dummyBAU.map((val) => val.value)))

const xMin = 2024
const xMax = 2050

type DataPoint = {
  year: number
  value: number
}

export const CarbonBudget = () => {
  let sum = 0
  let altered_1Point5Year: number
  let altered_2Point0Year: number
  
  let BAU_1Point5Year: number
  let BAU_2Point0Year: number
  //calculating x-axis position of each temperature limit
  for (const i of dummyAltered) {
    sum += i.value
    if (!altered_1Point5Year && sum >= dummy1Point5Limit) {
      altered_1Point5Year = i.year
    }
    if (!altered_2Point0Year && sum >= dummy2Point0Limit) {
      altered_2Point0Year = i.year
    }
  }

  sum=0
  for (const i of dummyBAU) {
    sum += i.value
    if (!BAU_1Point5Year && sum >= dummy1Point5Limit) {
      BAU_1Point5Year = i.year
    }
    if (!BAU_2Point0Year && sum >= dummy2Point0Limit) {
      BAU_2Point0Year = i.year
    }
  }

  //separate data based on 1.5 and 2 degree limit
  const dummyData1 = dummyAltered.filter((val) => val.year <= altered_2Point0Year)
  const dummyData2 = dummyAltered.filter((val) => val.year >= altered_2Point0Year)

  const y = d3.scaleLinear().domain([yMin, yMax]).range([graphHeight, 0])
  const x = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([leftMargin, svgWidth])

  const carbon_gradient1 = d3
    .area<DataPoint>()
    .x((d) => x(d.year))
    .y1((d) => y(d.value))
    .y0(graphHeight)
    .curve(d3.curveMonotoneX)(dummyData1)

  const carbon_gradient2 = d3
    .area<DataPoint>()
    .x((d) => x(d.year))
    .y1((d) => y(d.value))
    .y0(graphHeight)
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


  const BAU_curve = d3
  .line<DataPoint>()
  .x((d) => x(d.year))
  .y((d) => y(d.value))
  .curve(d3.curveMonotoneX)(dummyBAU)


  const yRange = yMax - yMin

  const verticalAxis = [
    yMin,
    yMin + yRange * 0.2,
    yMin + yRange * 0.4,
    yMin + yRange * 0.6,
    yMin + yRange * 0.8,
    yMax,
  ]
  const horizontalAxis = [2030, 2040, 2050]

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
          <GraphKey label="BAU CARBON EMISSIONS" color="#9ED7F5" />
          <GraphKey label="ALTERED CARBON EMISSIONS" color="#266297" />
          <Svg width={svgWidth} height={svgHeight}>
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
                    x2={svgWidth}
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
                  x={leftMargin}
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
                  x={graphWidth * (-(2030 - e) / 28) + leftMargin + 45}
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
                x={svgWidth / 2}
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
                stroke="#266297"
                fill="none"
              />
              <Path
                d={carbon_curve2}
                strokeWidth={2}
                stroke="#266297"
                fill="none"
              />
  
              <Path
                d={BAU_curve}
                strokeWidth={2}
                stroke="#9ED7F5"
                fill="none"
              />
              {/*Altered curve labels*/}
              <Rect
                x={graphWidth*(altered_2Point0Year-2024)/26+leftMargin-42}
                y={graphHeight-55}
                width={84}
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
                x={graphWidth*(altered_2Point0Year-2024)/26+leftMargin-39}
                y={graphHeight-42}
              >
                NEW 2.0°C LIMIT
              </TextSvg>
              <Line strokeDasharray="6" stroke="#58C4D4"
                strokeWidth={1}
                x1={graphWidth*(altered_2Point0Year-2024)/26+leftMargin} 
                x2={graphWidth*(altered_2Point0Year-2024)/26+leftMargin}
                y1={graphHeight-33}
                y2={graphHeight+10}>
              </Line>
              
              <Rect
                x={graphWidth*(altered_1Point5Year-2024)/26+leftMargin-42}
                y={graphHeight-30}
                width={84}
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
                x={graphWidth*(altered_1Point5Year-2024)/26+leftMargin-39}
                y={graphHeight-17}
              >
                NEW 1.5°C LIMIT
              </TextSvg>
              <Line strokeDasharray="6" stroke="#58C4D4"
                strokeWidth={1}
                x1={graphWidth*(altered_1Point5Year-2024)/26+leftMargin} 
                x2={graphWidth*(altered_1Point5Year-2024)/26+leftMargin}
                y1={graphHeight-8}
                y2={graphHeight+10}>
              </Line>
              {/*BAU curve labels*/}
              <Rect
                x={graphWidth*(BAU_2Point0Year-2024)/26+leftMargin-42}
                y={calculateY(dummyBAU.find(val=>val.year===BAU_2Point0Year).value)-30}
                width={84}
                height={20}
                rx={4}
                ry={4}
                fill="none"
                stroke="#9E9FA7"
                strokeWidth={1}
              />
              <TextSvg
                stroke="#9E9FA7"
                fill="#9E9FA7"
                strokeWidth={0.05}
                fontWeight={400}
                letterSpacing={0.787}
                fontSize={8}
                x={graphWidth*(BAU_2Point0Year-2024)/26+leftMargin-39}
                y={calculateY(dummyBAU.find(val=>val.year===BAU_2Point0Year).value)-17}
              >
                BAU 2.0°C LIMIT
              </TextSvg>
              <Line strokeDasharray="6" stroke="#9E9FA7"
                strokeWidth={1}
                x1={graphWidth*(BAU_2Point0Year-2024)/26+leftMargin} 
                x2={graphWidth*(BAU_2Point0Year-2024)/26+leftMargin}
                y1={calculateY(dummyBAU.find(val=>val.year===BAU_2Point0Year).value)-8}
                y2={calculateY(dummyBAU.find(val=>val.year===BAU_2Point0Year).value)}>
              </Line>
              
              <Rect
                x={graphWidth*(BAU_1Point5Year-2024)/26+leftMargin-42}
                y={calculateY(dummyBAU.find(val=>val.year===BAU_1Point5Year).value)-30}
                width={84}
                height={20}
                rx={4}
                ry={4}
                fill="none"
                stroke="#9E9FA7"
                strokeWidth={1}
              />
              <TextSvg
                stroke="#9E9FA7"
                fill="#9E9FA7"
                strokeWidth={0.05}
                fontWeight={400}
                letterSpacing={0.787}
                fontSize={8}
                x={graphWidth*(BAU_1Point5Year-2024)/26+leftMargin-39}
                y={calculateY(dummyBAU.find(val=>val.year===BAU_1Point5Year).value)-17}
              >
                BAU 1.5°C LIMIT
              </TextSvg>
              <Line strokeDasharray="6" stroke="#9E9FA7"
                strokeWidth={1}
                x1={graphWidth*(BAU_1Point5Year-2024)/26+leftMargin} 
                x2={graphWidth*(BAU_1Point5Year-2024)/26+leftMargin}
                y1={calculateY(dummyBAU.find(val=>val.year===BAU_1Point5Year).value)-8}
                y2={calculateY(dummyBAU.find(val=>val.year===BAU_1Point5Year).value)}>
              </Line>
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
