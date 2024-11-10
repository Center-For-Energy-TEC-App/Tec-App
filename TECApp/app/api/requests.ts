import { DataPoint } from '../components/DataVisualizations/BAUComparison'

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export type RegionInfo = {
  solar: number
  wind: number
  hydropower: number
  geothermal: number
  biomass: number
  nuclear: number
}

export type RegionalDefaultValues = {
  2025: RegionInfo
  bau: RegionInfo
  dynamic: RegionInfo
}

export type DefaultValues = {
  global: RegionalDefaultValues
  chn: RegionalDefaultValues
  nam: RegionalDefaultValues
  lam: RegionalDefaultValues
  ind: RegionalDefaultValues
  sea: RegionalDefaultValues
  mea: RegionalDefaultValues
  opa: RegionalDefaultValues
  eur: RegionalDefaultValues
  ssa: RegionalDefaultValues
  nee: RegionalDefaultValues
}

/**
 * Slider values object is an object with 10 key-value pairs; one per region
 * Each region value is a 3 pair object:
 *  2025: values for 2025 (for the 2025 tick mark on sliders)
 *  bau: predicted values for 2030 business-as-usual (for the bau tick and for resetting sliders)
 *  dynamic: to store values after they've been changed by users using the sliders
 */
export async function getDefaultValues() {
  const url = `/defaults`
  const response = await fetch(BASE_URL + url, { method: 'GET' })
  return (await response.json()) as DefaultValues
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

type ElectricityGenerationData = {
  solar: YearRange
  wind: YearRange
  hydropower: YearRange
  geothermal: YearRange
  biomass: YearRange
  nuclear: YearRange
}

type CarbonBudgetData = {
  coal: YearRange
  gas: YearRange
  oil: YearRange
  zero_carbon: YearRange
}

export type RegionCalculationData = {
  installed_capacity: ElectricityGenerationData
  capacity_factor: ElectricityGenerationData
  electricity_generation: CarbonBudgetData
  co2_emissions: CarbonBudgetData
  region: string
}

export type CalculationData = {
  global: RegionCalculationData
  chn: RegionCalculationData
  nam: RegionCalculationData
  lam: RegionCalculationData
  ind: RegionCalculationData
  sea: RegionCalculationData
  mea: RegionCalculationData
  opa: RegionCalculationData
  eur: RegionCalculationData
  ssa: RegionCalculationData
  nee: RegionCalculationData
}

/**
 * Calculation data is split up into 6 categories of data + one key value pair for the region
 * Each category contains information about a specific technology and its values in years
 */
export async function getCalculationData() {
  const response = await fetch(BASE_URL + `/calc`, { method: 'GET' })
  return (await response.json()) as CalculationData
}

export async function insertFeedback(feedback: string) {
  try {
    const body = JSON.stringify({ feedback: feedback })
    const response = await fetch(BASE_URL + '/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    })
    return { success: true, value: response }
  } catch (error) {
    return { success: false, value: error }
  }
}
