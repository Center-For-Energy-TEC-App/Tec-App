import { Text, StyleSheet, Dimensions, View } from 'react-native'
import React from 'react'
import * as d3 from 'd3'
import { GraphKey } from './GraphKey'
import { LineGraph } from './LineGraph'
import { getTechnologyColor } from '../../util/ValueDictionaries'
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

type TechnologyComparisonProps = {
  data: RegionData
  technologyRef: React.RefObject<View>
}
export const TechnologyComparison = ({ data, technologyRef }: TechnologyComparisonProps) => {
  const solar_data = data.solar.slice(1)
  const wind_data = data.wind.slice(1)
  const hydro_data = data.hydropower.slice(1)
  const geo_data = data.geothermal.slice(1)
  const bio_data = data.biomass.slice(1)
  const nuclear_data = data.nuclear.slice(1)

  const yMin = Math.min(
    Math.min(...solar_data.map((val) => val.value)),
    Math.min(...wind_data.map((val) => val.value)),
    Math.min(...hydro_data.map((val) => val.value)),
    Math.min(...geo_data.map((val) => val.value)),
    Math.min(...bio_data.map((val) => val.value)),
    Math.min(...nuclear_data.map((val) => val.value)),
  )

  //max of all datasets
  const yMax = Math.max(
    Math.max(...solar_data.map((val) => val.value)),
    Math.max(...wind_data.map((val) => val.value)),
    Math.max(...hydro_data.map((val) => val.value)),
    Math.max(...geo_data.map((val) => val.value)),
    Math.max(...bio_data.map((val) => val.value)),
    Math.max(...nuclear_data.map((val) => val.value)),
  )

  //define y-axis scale
  const y = d3.scaleLinear().domain([yMin, yMax]).range([graphHeight, 0])
  //define x-axis scale
  const x = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([leftMargin, graphWidth])

  const solar_curve = d3
    .line<DataPoint>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)(solar_data)

  const wind_curve = d3
    .line<DataPoint>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)(wind_data)

  const hydro_curve = d3
    .line<DataPoint>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)(hydro_data)

  const geo_curve = d3
    .line<DataPoint>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)(geo_data)

  const bio_curve = d3
    .line<DataPoint>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)(bio_data)

  const nuclear_curve = d3
    .line<DataPoint>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)(nuclear_data)

  return (
    <View style={{ width: '100%' }}>
      <Text style={styles.header}>Technology Comparison</Text>
      <Text style={styles.body}>
        See how different energy-generating technologies compare to each other
        based on your custom changes.
      </Text>
      <View style={styles.graphContainer} ref={technologyRef} collapsable={false}>
        <View style={styles.graphInnerContainer}>
          <GraphKey label="SOLAR" color={getTechnologyColor('Solar')} />
          <GraphKey label="WIND" color={getTechnologyColor('Wind')} />
          <GraphKey
            label="HYDROPOWER"
            color={getTechnologyColor('Hydropower')}
          />
          <GraphKey
            label="GEOTHERMAL"
            color={getTechnologyColor('Geothermal')}
          />
          <GraphKey label="BIOMASS" color={getTechnologyColor('Biomass')} />
          <GraphKey label="NUCLEAR" color={getTechnologyColor('Nuclear')} />
          <LineGraph
            yMin={yMin}
            yMax={yMax}
            lineCurves={[
              { curve: solar_curve, color: getTechnologyColor('Solar') },
              { curve: wind_curve, color: getTechnologyColor('Wind') },
              { curve: hydro_curve, color: getTechnologyColor('Hydropower') },
              { curve: geo_curve, color: getTechnologyColor('Geothermal') },
              { curve: bio_curve, color: getTechnologyColor('Biomass') },
              { curve: nuclear_curve, color: getTechnologyColor('Nuclear') },
            ]}
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
    marginTop: 25,
  },
  graphInnerContainer: {
    width: vw * 0.8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
})
