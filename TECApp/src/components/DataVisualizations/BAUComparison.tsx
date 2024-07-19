import React, { Text, StyleSheet, Dimensions, View } from 'react-native'
import * as d3 from 'd3'
import { AlteredRenewablesKey } from './GraphKeys/AlteredRenewablesKey'
import { BAUKey } from './GraphKeys/BAUKey'
import { LineGraph } from './LineGraph'

const vw = Dimensions.get('window').width

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

type DataPoint = {
  year: number
  value: number
}

type BAUComparisonProps = {
  region: string
}

export const BAUComparison = ({ region }: BAUComparisonProps) => {
  const y = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([graphHeight + offset, offset])
  const x = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([leftMargin, graphWidth])

  const BAU_curve = d3
    .area<DataPoint>()
    .x((d) => x(d.year))
    .y1((d) => y(d.value))
    .y0(graphHeight + offset)
    .curve(d3.curveNatural)(dummyBAU)

  const altered_curve = d3
    .line<DataPoint>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
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
          <LineGraph
            gradientCurve={{ curve: BAU_curve, color: '#9ED7F5' }}
            lineCurves={[{ curve: altered_curve, color: '#C66AAA' }]}
          />
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
