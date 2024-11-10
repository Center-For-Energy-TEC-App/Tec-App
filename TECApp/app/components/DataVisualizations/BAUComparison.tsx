import { Text, StyleSheet, Dimensions, View, Platform } from 'react-native'
import React from 'react'
import * as d3 from 'd3'
import { GraphKey } from './GraphKey'
import { LineGraph } from './LineGraph'
import { RegionData } from '../../api/requests'

const vw = Dimensions.get('window').width

const graphHeight = 190

const graphWidth = vw * 0.8
const leftMargin = 65

const xMin = 2025
const xMax = 2030

export type DataPoint = {
  year: number
  value: number
}

type BAUComparisonProps = {
  region: string
  BAUData: RegionData
  dynamicData: RegionData
  bauRef: React.RefObject<View>
}

const deviceType = () => {
  const { width, height } = Dimensions.get('window')
  return Platform.OS === 'ios' && (width >= 1024 || height >= 1366)
    ? 'ipad'
    : 'iphone'
}

const isIpad = deviceType() === 'ipad'

export const BAUComparison = ({
  region,
  BAUData,
  dynamicData,
  bauRef,
}: BAUComparisonProps) => {
  const BAU_data = BAUData.total.slice(1)
  const altered_data = dynamicData.total.slice(1)

  //min of both datasets
  const yMin = Math.min(
    Math.min(...BAU_data.map((val) => val.value)),
    Math.min(...altered_data.map((val) => val.value)),
  )

  //max of both datasets
  const yMax = Math.max(
    Math.max(...BAU_data.map((val) => val.value)),
    Math.max(...altered_data.map((val) => val.value)),
  )

  //define y-axis scale
  const y = d3.scaleLinear().domain([yMin, yMax]).range([graphHeight, 0])
  //define x-axis scale
  const x = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([leftMargin, graphWidth])

  //define BAU area curve (just gradient)
  const BAU_gradient = d3
    .area<DataPoint>()
    .x((d) => x(d.year))
    .y1((d) => y(d.value))
    .y0(graphHeight)
    .curve(d3.curveMonotoneX)(BAU_data)

  //define BAU line curve
  const BAU_curve = d3
    .line<DataPoint>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)(BAU_data)

  //define altered renewables line curve
  const altered_curve = d3
    .line<DataPoint>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)(altered_data)

  return (
    <View style={{ width: '100%' }}>
      <Text style={styles.header}>Forecast Comparison</Text>
      <Text style={[styles.body, isIpad && styles.iPadText]}>
        See how your manipulated data compares to the forecast business-as-usual
        (BAU) data. The BAU data represents the projected renewable capacity
        levels from now to 2030 without any interventions.
      </Text>

      <View style={styles.graphHeader}>
        <Text style={styles.bold}>{region + ':'}</Text>
        <Text style={styles.body}>My Plan vs. Current Forecast</Text>
      </View>
      <View style={styles.graphContainer} ref={bauRef} collapsable={false}>
        <View style={styles.graphInnerContainer}>
          <GraphKey label="MY PLAN" color="#C66AAA" />
          <GraphKey label="FORECAST" color="#58C4D4" />
          <LineGraph
            yMin={yMin}
            yMax={yMax}
            gradient={{ curve: BAU_gradient, color: '#9ED7F5' }}
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
    fontFamily: 'Brix Sans',
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
  iPadText: {
    fontSize: 18,
  },
})
