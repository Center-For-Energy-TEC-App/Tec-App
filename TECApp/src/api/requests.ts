import { DataPoint } from '../components/DataVisualizations/BAUComparison'

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL

export type DefaultValues = {
  region: string
  category: string
  global_tw: string
  regional_gw?: number
  solar_gw: number
  wind_gw: number
  hydro_gw: number
  geo_gw: number
  bio_gw: number
  nuclear_gw: number
}

export type RegionalValues = {
  chn: DefaultValues[]
  nam: DefaultValues[]
  lam: DefaultValues[]
  ind: DefaultValues[]
  sea: DefaultValues[]
  mea: DefaultValues[]
  opa: DefaultValues[]
  eur: DefaultValues[]
  ssa: DefaultValues[]
  nee: DefaultValues[]
}

/**
 * Slider values object is an object with 10 key-value pairs; one per region
 * Each region value is a 3 element array:
 *  index 0: values for 2023 (for the 2023 tick mark on sliders)
 *  index 1: predicted values for 2030 business-as-usual (for the bau tick and for resetting sliders)
 *  index 2: to store values after they've been changed by users using the sliders
 */
export async function getDefaultValues() {
  const url = `/defaults`
  const response = await fetch(BASE_URL + url, { method: 'GET' })
  return (await response.json()) as RegionalValues
}

export type MinMaxValues = {
  min: {
    solar: string
    wind: string
    hydropower: string
    geothermal: string
    biomass: string
    nuclear: string
  }
  max: {
    solar: string
    wind: string
    hydropower: string
    geothermal: string
    biomass: string
    nuclear: string
  }
}

export type RegionalMinMaxValues = {
  chn: MinMaxValues
  nam: MinMaxValues
  lam: MinMaxValues
  ind: MinMaxValues
  sea: MinMaxValues
  mea: MinMaxValues
  opa: MinMaxValues
  eur: MinMaxValues
  nee: MinMaxValues
}

/**
 * Contains minimum and maximum values for each slider for each region
 * Each region value is an object with min and max key-value pairs that contain values for each technology
 */
export async function getMinMaxValues() {
  const response = await fetch(BASE_URL + '/minmax', { method: 'GET' })
  return (await response.json()) as RegionalMinMaxValues
}

export type RegionData = {
  solar: DataPoint[]
  wind: DataPoint[]
  hydropower: DataPoint[]
  geothermal: DataPoint[]
  biomass: DataPoint[]
  nuclear: DataPoint[]
  total: DataPoint[]
}

export type GraphData = {
  global: RegionData
  chn: RegionData
  nam: RegionData
  lam: RegionData
  ind: RegionData
  sea: RegionData
  mea: RegionData
  opa: RegionData
  eur: RegionData
  ssa: RegionData
  nee: RegionData
}

/**
 *
 * Each regional graph data is an object with 7 key value pairs, one for each technology and one total
 * Each technology array is 7 element array with a DataPoint object as each element; one per each year from 2024-2027
 */
export async function getInitialGraphData() {
  const response = await fetch(BASE_URL + '/initgraph', { method: 'GET' })
  return (await response.json()) as GraphData
}

type YearRange = {
  '2024'?: number
  '2025'?: number
  '2026'?: number
  '2027'?: number
  '2028'?: number
  '2029'?: number
  '2030'?: number
  '2024-2030'?: number
}

type RawData = {
  solar?: YearRange
  wind?: YearRange
  hydropower?: YearRange
  geothermal?: YearRange
  biomass?: YearRange
  nuclear?: YearRange
  coal?: YearRange
  gas?: YearRange
  oil?: YearRange
  zero_carbon?: YearRange
}

export type RenewableEnergyCalculationData = {
  installed_capacity: RawData
  forecast_cagr: RawData
  forecast_growth_rate: RawData
  capacity_factor: RawData
  electricity_generation: RawData
  co2_emissions: RawData
  region: string
}

/**
 * Calculation data is split up into 6 categories of data + one key value pair for the region
 * Each category contains information about a specific technology and its values in years
 */
export async function getRegionCalculationData(region: string) {
  const response = await fetch(BASE_URL + `/calc/${region}`, { method: 'GET' })
  return (await response.json()) as RenewableEnergyCalculationData
}

export async function getInitialFossilData() {
  const response = await fetch(BASE_URL + '/fossil-emissions', {
    method: 'GET',
  })
  return (await response.json()) as DataPoint[]
}
