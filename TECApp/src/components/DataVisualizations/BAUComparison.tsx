import React, { Text, StyleSheet, Dimensions, View } from 'react-native'
import * as d3 from 'd3'
import Svg, {
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as TextSvg,
} from 'react-native-svg'
import { AlteredRenewablesKey } from './GraphKeys/AlteredRenewablesKey'
import { BAUKey } from './GraphKeys/BAUKey'

const vw = Dimensions.get('window').width

const svgHeight = 300
const graphHeight = 190
const offset = 20

const graphWidth = vw * 0.8
const leftMargin = 60

const dummyBAU = [
  { year: 2024, value: Math.random() * 12 + 4 },
  { year: 2025, value: Math.random() * 12 + 4 },
  { year: 2026, value: Math.random() * 12 + 4 },
  { year: 2027, value: Math.random() * 12 + 4 },
  { year: 2028, value: Math.random() * 12 + 4 },
  { year: 2029, value: Math.random() * 12 + 4 },
  { year: 2030, value: Math.random() * 12 + 4 },
]
const dummyAltered = [
  { year: 2024, value: Math.random() * 12 + 4 },
  { year: 2025, value: Math.random() * 12 + 4 },
  { year: 2026, value: Math.random() * 12 + 4 },
  { year: 2027, value: Math.random() * 12 + 4 },
  { year: 2028, value: Math.random() * 12 + 4 },
  { year: 2029, value: Math.random() * 12 + 4 },
  { year: 2030, value: Math.random() * 12 + 4 },
]

const yMin = 0
const yMax = 20

const xMin = 2024
const xMax = 2030

const verticalAxis = [0, 4, 8, 12, 16, 20]
const horizontalAxis = [2024, 2026, 2028, 2030]

type DataPoint = {
  year: number
  value: number
}

type BAUComparisonProps = {
  region: string
}

export const BAUComparison = ({ region }: BAUComparisonProps) => {
  const BAU_y = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([graphHeight + offset, offset])
  const BAU_x = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([leftMargin, graphWidth])
  const BAU_curve = d3
    .area<DataPoint>()
    .x((d) => BAU_x(d.year))
    .y1((d) => BAU_y(d.value))
    .y0(graphHeight + offset)
    .curve(d3.curveNatural)(dummyBAU)

  const altered_y = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([graphHeight + offset, offset])
  const altered_x = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([leftMargin, graphWidth])
  const altered_curve = d3
    .line<DataPoint>()
    .x((d) => altered_x(d.year))
    .y((d) => altered_y(d.value))
    .curve(d3.curveNatural)(dummyAltered)

  return (
    <View style={{ width: '100%' }}>
      <Text style={styles.header}>B.A.U. Comparison</Text>
      <Text style={styles.body}>
        See how your manipulated data compares to the business-as-usual (BAU)
        data. The BAU data represents the projected renewable capacity levels
        from now to 2030 without any interventions.
      </Text>
      <View style={styles.graphHeader}>
        <Text style={styles.bold}>{region + ':'}</Text>
        <Text style={styles.body}>Altered vs. BAU Renewables</Text>
      </View>
      <View style={styles.graphContainer}>
        <View style={styles.graphInnerContainer}>
          <AlteredRenewablesKey />
          <BAUKey />
          <Svg width={graphWidth} height={svgHeight}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#58C4D4" stopOpacity={0.8} />
                <Stop offset="1" stopColor="#DADEFF" stopOpacity={0.01} />
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
                d={BAU_curve}
                strokeWidth={2}
                stroke="#9ED7F5"
                fill="url(#grad)"
              />
              <Path
                d={altered_curve}
                strokeWidth={2}
                stroke="#C66AAA"
                fill="none"
              />
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
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    fontFamily: 'Brix-Sans',
    fontSize: 24,
    marginBottom: 8,
  },
  body: {
    fontFamily: 'Roboto',
    fontSize: 14,
  },
  bold: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 'bold',
  },
  graphHeader: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    marginTop: 30,
    marginBottom: 20,
  },
  graphContainer: {
    width: '90%',
    display: 'flex',
    alignItems: 'center',
  },
  graphInnerContainer: {
    width: vw * 0.8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
})
