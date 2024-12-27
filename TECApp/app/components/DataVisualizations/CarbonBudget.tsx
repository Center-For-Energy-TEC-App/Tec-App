import * as d3 from 'd3'
import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as TextSvg,
} from 'react-native-svg'
import { GraphKey } from './GraphKey'
import { TemperatureData } from '../../util/Calculations'
import { svgPathProperties } from 'svg-path-properties'
import { BAUCurvePopup } from '../../SVGs/BAUCurvePopup'
import { AlteredCurvePopup } from '../../SVGs/AlteredCurvePopup'

const vw = Dimensions.get('window').width

const svgHeight = 300
const graphHeight = 190
const offset = 20

const graphWidth = vw * 0.9
const leftMargin = 60
const rightMargin = 35
const contentWidth = graphWidth - rightMargin

const xMin = 2025
const xMax = 2060

type DataPoint = {
  year: number
  value: number
}

type CarbonBudgetProps = {
  BAUData: DataPoint[]
  dynamicData: DataPoint[]
  temperatureData: TemperatureData
  isInteracting: (interacting: boolean) => void
  carbonRef: React.RefObject<View>
}

/**
 * Interactive Carbon Budget graph on global dashboard
 */
export const CarbonBudget = ({
  BAUData,
  dynamicData,
  temperatureData,
  isInteracting,
  carbonRef,
}: CarbonBudgetProps) => {
  const [currPosition, setCurrPosition] = useState<number>(null)

  const BAU1Point5Year = 2029
  const BAU1Point8Year = 2042
  const BAU2Point0Year = 2054

  const yMin = 0
  const yMax = Math.max(
    Math.max(...dynamicData.map((val) => val.value)),
    Math.max(...BAUData.map((val) => val.value)),
  )

  const xRange = xMax - xMin
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

  //find y value on a curve from x value; gives high accuracy approximatiomn of y = f(x) for our generated curve
  const findYbyX = (x: number, curve: string) => {
    const path = new svgPathProperties(curve)
    let length_start = 0,
      length_end = path.getTotalLength(),
      point = path.getPointAtLength((length_end + length_start) / 2),
      bisection_iterations_max = 20,
      bisection_iterations = 0

    const error = 0.01

    while (x < point.x - error || x > point.x + error) {
      point = path.getPointAtLength((length_end + length_start) / 2)

      if (x < point.x) {
        length_end = (length_start + length_end) / 2
      } else {
        length_start = (length_start + length_end) / 2
      }

      if (bisection_iterations_max < ++bisection_iterations) break
    }
    return point.y
  }
  //calculate graph y pixel value based off actual y-axis value
  //calculated as proportion of graph height from the top
  const calculateY = (val: number) => {
    return (graphHeight * (yMax - val)) / yRange
  }

  //calculate graph x pixel value based off actual x-axis value
  const calculateX = (val: number) => {
    return leftMargin + ((val - xMin) / xRange) * (contentWidth - leftMargin)
  }

  const y = d3.scaleLinear().domain([0, yMax]).range([graphHeight, 0])
  const x = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([leftMargin, contentWidth])

  const full_curve = d3
    .line<DataPoint>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)(dynamicData)

  const separationHeight = findYbyX(
    calculateX(temperatureData['2.0Year']),
    full_curve,
  )
  const separationPoint = {
    year: temperatureData['2.0Year'],
    value: yMax - (separationHeight / graphHeight) * yRange,
  }
  //separate data based on 2 degree limit
  let data1 = [],
    data2 = []
  if (separationPoint.year % 5 == 0) {
    data1 = dynamicData.filter((val) => val.year <= temperatureData['2.0Year'])
    data2 = [separationPoint].concat(
      dynamicData.filter((val) => val.year > temperatureData['2.0Year']),
    )
  } else {
    data1 = dynamicData
      .filter((val) => val.year <= temperatureData['2.0Year'])
      .concat([separationPoint])
    data2 = [separationPoint].concat(
      dynamicData.filter((val) => val.year > temperatureData['2.0Year']),
    )
  }

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

  return (
    <View style={{ width: '100%' }}>
      <Text style={styles.header}>Carbon Budget</Text>
      <Text style={styles.body}>
        This graph shows the resulting emissions in gigatons (GT) of your
        manipulated global renewables over time. The area under the curve shows
        the amount of emissions you’re allowed to emit before exceeding the
        global temperature threshold.
      </Text>
      <View
        style={styles.graphContainer}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderStart={(evt) => {
          isInteracting(true)
          setCurrPosition(evt.nativeEvent.locationX)
        }}
        onResponderMove={(evt) => setCurrPosition(evt.nativeEvent.locationX)}
        onResponderRelease={() => {
          isInteracting(false)
          setCurrPosition(null)
        }}
      >
        <View ref={carbonRef} collapsable={false}>
          <View style={styles.graphTopRow}>
            {currPosition !== null &&
            currPosition >= 60 &&
            currPosition < contentWidth ? (
              <Text style={{ color: '#757678', fontSize: 12 }}>
                {Math.round(
                  ((currPosition - leftMargin) / (contentWidth - leftMargin)) *
                    xRange +
                    xMin,
                )}
              </Text>
            ) : (
              <Text></Text>
            )}
            <View style={styles.keyContainer}>
              <GraphKey label="FORECAST EMISSIONS" color="#b3551b" />
              <GraphKey label="MY PLAN EMISSIONS" color="#266297" />
            </View>
          </View>
          <Svg width={graphWidth} height={svgHeight}>
            <Defs>
              <LinearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <Stop stopColor="#266297" stopOpacity={0.85} />
                <Stop offset="1" stopColor="#266297" stopOpacity={0.2} />
              </LinearGradient>
              <LinearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                <Stop stopColor="#9E9FA7" stopOpacity={0.5} />
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
                    x2={contentWidth}
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
                Annual CO2 (GT)
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
                2025
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
                strokeWidth={1.575}
                stroke="#266297"
                fill="none"
              />
              <Path
                d={carbon_curve2}
                strokeWidth={1.575}
                stroke="#266297"
                fill="none"
              />
              <Path
                d={BAU_curve}
                strokeWidth={1.575}
                stroke="#b3551b"
                fill="none"
              />
            </G>
            {/* Temperature Limits & Labels */}
            <G y={offset}>
              {currPosition !== null &&
              currPosition > 60 &&
              currPosition < contentWidth + 5 ? (
                <Line
                  stroke="#1C2B47"
                  strokeWidth={1.57}
                  fill="#1C2B47"
                  x1={currPosition}
                  x2={currPosition}
                  y1={0}
                  y2={190}
                />
              ) : (
                <></>
              )}
              <Circle
                x={calculateX(BAU1Point5Year)}
                y={findYbyX(calculateX(BAU1Point5Year), BAU_curve)}
                r={4}
                fill="white"
                stroke="#b3551b"
                strokeWidth={2.362}
              />
              <Circle
                x={calculateX(BAU1Point8Year)}
                y={findYbyX(calculateX(BAU1Point8Year), BAU_curve)}
                r={4}
                fill="white"
                stroke="#b3551b"
                strokeWidth={2.362}
              />
              <Circle
                x={calculateX(BAU2Point0Year)}
                y={findYbyX(calculateX(BAU2Point0Year), BAU_curve)}
                r={4}
                fill="white"
                stroke="#b3551b"
                strokeWidth={2.362}
              />
              {Math.abs(currPosition - calculateX(BAU1Point5Year)) < 5 ? (
                <G
                  x={calculateX(BAU1Point5Year) - 44}
                  y={findYbyX(calculateX(BAU1Point5Year), BAU_curve) + 7}
                >
                  <BAUCurvePopup label="BAU 1.5˚C LIMIT" />
                </G>
              ) : (
                <></>
              )}
              {Math.abs(currPosition - calculateX(BAU1Point8Year)) < 5 ? (
                <G
                  x={calculateX(BAU1Point8Year) - 44}
                  y={findYbyX(calculateX(BAU1Point8Year), BAU_curve) + 7}
                >
                  <BAUCurvePopup label="BAU 1.8˚C LIMIT" />
                </G>
              ) : (
                <></>
              )}
              {Math.abs(currPosition - calculateX(BAU2Point0Year)) < 5 ? (
                <G
                  x={calculateX(BAU2Point0Year) - 44}
                  y={findYbyX(calculateX(BAU2Point0Year), BAU_curve) + 7}
                >
                  <BAUCurvePopup label="BAU 2.0˚C LIMIT" />
                </G>
              ) : (
                <></>
              )}
              <Circle
                x={calculateX(temperatureData['1.5Year'])}
                y={graphHeight}
                r={4}
                fill="white"
                stroke="#266297"
                strokeWidth={2.362}
              />
              <Circle
                x={calculateX(temperatureData['1.8Year'])}
                y={graphHeight}
                r={4}
                fill="white"
                stroke="#266297"
                strokeWidth={2.362}
              />
              <Circle
                x={calculateX(temperatureData['2.0Year'])}
                y={graphHeight}
                r={4}
                fill="white"
                stroke="#266297"
                strokeWidth={2.362}
              />
              {Math.abs(currPosition - calculateX(temperatureData['1.5Year'])) <
              5 ? (
                <G
                  x={calculateX(temperatureData['1.5Year']) - 33}
                  y={graphHeight - 37}
                >
                  <AlteredCurvePopup label="1.5˚C LIMIT" />
                </G>
              ) : (
                <></>
              )}
              {Math.abs(currPosition - calculateX(temperatureData['1.8Year'])) <
              5 ? (
                <G
                  x={calculateX(temperatureData['1.8Year']) - 33}
                  y={graphHeight - 37}
                >
                  <AlteredCurvePopup label="1.8˚C LIMIT" />
                </G>
              ) : (
                <></>
              )}
              {Math.abs(currPosition - calculateX(temperatureData['2.0Year'])) <
              5 ? (
                <G
                  x={calculateX(temperatureData['2.0Year']) - 33}
                  y={graphHeight - 37}
                >
                  <AlteredCurvePopup label="2.0˚C LIMIT" />
                </G>
              ) : (
                <></>
              )}
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
    width: vw * 0.9,
    display: 'flex',
    marginTop: 20,
    gap: 4,
  },
  graphTopRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 30,
    paddingLeft: 60,
  },
  keyContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    alignItems: 'flex-start',
  },
})
