import { useEffect, useState } from 'react'
import React, {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native'
import { SelectBarArrow } from '../../SVGs/SelectBarArrow'
import Checkbox from 'expo-checkbox'
import { CurveObject, LineGraph } from './LineGraph'
import * as d3 from 'd3'
import { GraphKey } from './GraphKey'
import { getRegionColor } from '../../util/ValueDictionaries'
import { GraphData } from '../../api/requests'

type RegionObject = {
  region: string
  selected: boolean
  data: DataPoint[]
}

type DataPoint = {
  year: number
  value: number
}

type RegionalComparisonProps = {
  region: string
  data: GraphData
}

const vw = Dimensions.get('window').width

const graphHeight = 190

const graphWidth = vw * 0.8
const leftMargin = 65

const xMin = 2025
const xMax = 2030

/**
 * Regional Comparison graph on regional dashboards
 */
export const RegionalComparison = ({
  region,
  data,
}: RegionalComparisonProps) => {
  const [dropdown, setDropdown] = useState<boolean>(false)
  const [dropdownOptions, setDropDownOptions] = useState<RegionObject[]>([
    { region: 'North America', selected: false, data: data.nam.total },
    { region: 'Latin America', selected: false, data: data.lam.total },
    { region: 'Europe', selected: false, data: data.eur.total },
    {
      region: 'Middle East & N. Africa',
      selected: false,
      data: data.mea.total,
    },
    {
      region: 'Sub-Saharan Africa',
      selected: false,
      data: data.ssa.total,
    },
    {
      region: 'North East Eurasia',
      selected: false,
      data: data.nee.total,
    },
    {
      region: 'South East Asia',
      selected: false,
      data: data.sea.total,
    },
    { region: 'OECD Pacific', selected: false, data: data.opa.total },
    { region: 'Greater China', selected: false, data: data.chn.total },
    {
      region: 'Indian Subcontinent',
      selected: false,
      data: data.ind.total,
    },
  ]) //keeps track of state of every checkbox
  const [numSelected, setNumSelected] = useState<number>(0) //easier way to keep track than parsing above state every time

  const [yMin, setYMin] = useState<number>() //dynamic yMin based on what's selected
  const [yMax, setyMax] = useState<number>() //dynamic yMax based on what's selected

  const [currGradient, setCurrGradient] = useState<CurveObject>() //current region gradient
  const [currGradientCurve, setCurrGradientCurve] = useState<CurveObject>() //current region curve
  const [currLineCurves, setCurrLineCurves] = useState<CurveObject[]>() //curves of all checked regions

  const onCheck = (key: number) => {
    if (numSelected < 4 || dropdownOptions[key].selected) {
      setNumSelected(
        dropdownOptions[key].selected ? numSelected - 1 : numSelected + 1,
      )
      setDropDownOptions(
        dropdownOptions.map((item, key2) =>
          key === key2
            ? {
                ...item,
                selected: !dropdownOptions[key].selected,
              }
            : item,
        ),
      )
    }
  }

  //all calculations rerun when new region selected/unselected
  useEffect(() => {
    const selectedRegions = dropdownOptions.filter((item) => item.selected) //regions checked
    const allVisibleRegions = [
      ...selectedRegions,
      dropdownOptions.find((item) => item.region === region),
    ] //regions checked + current region

    let yMin = Number.POSITIVE_INFINITY
    let yMax = Number.NEGATIVE_INFINITY

    for (const i of allVisibleRegions) {
      yMin = Math.min(yMin, Math.min(...i.data.map((val) => val.value)))
      yMax = Math.max(yMax, Math.max(...i.data.map((val) => val.value)))
    }

    setYMin(yMin)
    setyMax(yMax)

    const y = d3.scaleLinear().domain([yMin, yMax]).range([graphHeight, 0])
    const x = d3
      .scaleLinear()
      .domain([xMin, xMax])
      .range([leftMargin, graphWidth])

    setCurrGradient({
      color: getRegionColor(region),
      curve: d3
        .area<DataPoint>()
        .x((d) => x(d.year))
        .y1((d) => y(d.value))
        .y0(graphHeight)
        .curve(d3.curveMonotoneX)(
        dropdownOptions.find((item) => item.region === region).data,
      ),
      region: region,
    })

    setCurrGradientCurve({
      color: getRegionColor(region),
      curve: d3
        .line<DataPoint>()
        .x((d) => x(d.year))
        .y((d) => y(d.value))
        .curve(d3.curveMonotoneX)(
        dropdownOptions.find((item) => item.region === region).data,
      ),
      region: region,
    })

    const lineCurves = []
    for (const i of selectedRegions) {
      const curve = {
        color: getRegionColor(i.region),
        curve: d3
          .line<DataPoint>()
          .x((d) => x(d.year))
          .y((d) => y(d.value))
          .curve(d3.curveMonotoneX)(i.data),
        region: i.region,
      }
      lineCurves.push(curve)
    }
    setCurrLineCurves(lineCurves)
  }, [numSelected])

  return (
    <Pressable
      onPress={() => {
        if (dropdown) setDropdown(false)
      }}
      style={{ width: '100%' }}
    >
      <Text style={styles.header}>Regional Comparison</Text>
      <Text style={styles.body}>
        This graph compares the total renewable energy generation between two or
        more regions. Select regions from the dropdown to visualize their
        resulting data.
      </Text>
      <View style={styles.graphHeader}>
        <Text style={styles.body}>{region + ' vs. '}</Text>
        <View style={styles.dropdownWrapper}>
          <View style={styles.selectBarWrapper}>
            <Pressable
              onPress={() => setDropdown(!dropdown)}
              style={styles.selectBar}
            >
              <Text style={styles.body}>
                {numSelected === 0
                  ? 'Select region(s)'
                  : numSelected === 1
                    ? dropdownOptions.find((item) => item.selected).region
                    : numSelected + ' selected'}
              </Text>
            </Pressable>
            <View style={{ position: 'absolute', right: 10 }}>
              <SelectBarArrow />
            </View>
          </View>
          {dropdown ? (
            <View style={styles.dropdown}>
              {dropdownOptions.map(
                (regionObject, key) =>
                  regionObject.region !== region && (
                    <Pressable
                      key={key}
                      style={styles.dropdownOption}
                      onPress={() => {
                        onCheck(key)
                      }}
                    >
                      <Checkbox
                        color="#266297"
                        style={styles.checkbox}
                        value={dropdownOptions[key].selected}
                        onValueChange={() => {
                          onCheck(key)
                        }}
                      />
                      <Text>{regionObject.region}</Text>
                    </Pressable>
                  ),
              )}
            </View>
          ) : (
            <></>
          )}
        </View>
      </View>
      {currGradientCurve && currLineCurves ? (
        <View style={styles.graphContainer}>
          <View style={styles.graphInnerContainer}>
            <GraphKey
              label={region.toUpperCase()}
              color={getRegionColor(region)}
            />
            {dropdownOptions
              .filter((item) => item.selected)
              .map((e, key) => (
                <GraphKey
                  key={key}
                  label={e.region.toUpperCase()}
                  color={getRegionColor(e.region)}
                />
              ))}
            <LineGraph
              yMin={yMin}
              yMax={yMax}
              gradient={currGradient}
              gradientCurve={currGradientCurve}
              lineCurves={currLineCurves}
            />
          </View>
        </View>
      ) : (
        <></>
      )}
      <View style={{ height: 50 }} />
    </Pressable>
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
  graphHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 30,
    marginBottom: 20,
  },

  selectBarWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  selectBar: {
    width: 195,
    height: 34,
    borderRadius: 4,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#B5B1AA',
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: 7.5,
  },
  dropdownWrapper: {
    position: 'relative',
  },
  dropdown: {
    width: 195,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#B5B1AA',
    position: 'absolute',
    top: 37,
    backgroundColor: 'white',
  },

  dropdownOption: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 9,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2EEE6',
  },

  checkbox: {
    borderWidth: 1,
    borderColor: '#B5B1AA',
  },
  graphContainer: {
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    zIndex: -1,
  },
  graphInnerContainer: {
    width: vw * 0.8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  clickOutOverlay: {
    position: 'relative',
  },
})
