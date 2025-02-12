import {
  RegionData,
  CalculationData,
  RegionCalculationData,
  GraphData,
} from '../api/requests'
import { CoalGasOilData } from '../components/BottomSheet'
import { DataPoint } from '../components/DataVisualizations/ForecastComparison'
import { getElectricityGenerationCoal } from './ValueDictionaries'

/**
 * Calculate new region and global graph data (regional comparison, bau comparison, energy comparison)
 * Called once when user releases slider
 */
export const calculateEnergyCurve = (
  newVal: number,
  technologyChanged: string,
  regionGraphData: RegionData,
  globalGraphData: RegionData,
  calculationData: RegionCalculationData,
) => {
  const installed_capacity =
    calculationData.installed_capacity[technologyChanged]['2024']

  const capacity_factor = calculationData.capacity_factor[technologyChanged]

  const climate_path_cagr = Math.pow(newVal / installed_capacity, 1 / 6) - 1

  const newRegionTechnology = []
  const newRegionTotal = []
  const newGlobalTechnology = []
  const newGlobalTotal = []
  let climate_path_installed_capacty = installed_capacity
  for (let i = 2025; i <= 2030; i++) {
    climate_path_installed_capacty =
    climate_path_installed_capacty * (1 + climate_path_cagr)

    const electricity_generation =
      climate_path_installed_capacty * 8760 * capacity_factor[i] * 0.001

    const valueChange =
      electricity_generation -
      regionGraphData[technologyChanged][i - 2025].value

    newRegionTechnology.push({ year: i, value: electricity_generation })

    newRegionTotal.push({
      year: i,
      value: regionGraphData.total[i - 2025].value + valueChange,
    })
    newGlobalTechnology.push({
      year: i,
      value: globalGraphData[technologyChanged][i - 2025].value + valueChange,
    })
    newGlobalTotal.push({
      year: i,
      value: globalGraphData.total[i - 2025].value + valueChange,
    })
  }

  return {
    regionalGraphData: {
      ...regionGraphData,
      [technologyChanged]: newRegionTechnology,
      total: newRegionTotal,
    },
    globalGraphData: {
      ...globalGraphData,
      [technologyChanged]: newGlobalTechnology,
      total: newGlobalTotal,
    },
  }
}

/**
 * Calculate only regional curves (to continuously update locally while sliders are being moved)
 */
export const calculateRegionalCurve = (
  newVal: number,
  graphData: RegionData,
  technologyChanged: string,
  calculationData: RegionCalculationData,
) => {
  const installed_capacity =
    calculationData.installed_capacity[technologyChanged]['2024']

  const capacity_factor = calculationData.capacity_factor[technologyChanged]

  const climate_path_cagr = Math.pow(newVal / installed_capacity, 1 / 6) - 1

  let climate_path_installed_capacty = installed_capacity
  let electricity_generation: number
  let newData = []
  let newDataTotal = []
  for (let i = 2025; i <= 2030; i++) {
    climate_path_installed_capacty =
      climate_path_installed_capacty * (1 + climate_path_cagr)

    electricity_generation =
      climate_path_installed_capacty * 8760 * capacity_factor[i] * 0.001
    
    newData.push({ year: i, value: electricity_generation })
    newDataTotal.push({
      year: i,
      value:
        graphData.total[i - 2025].value +
        (electricity_generation - graphData[technologyChanged][i - 2025].value),
    })
  }
  return { ...graphData, [technologyChanged]: newData, total: newDataTotal }
}

/**
 * Calculate global carbon reduction data
 * We calculate all reduction values 2025-2030 even though we only use the 2030 value for the
 * carbon curve because the aggregate reduction is used for the regional CO2 reduction bars
 */
export const calculateCarbonReductions = (
  region: string,
  calculationData: RegionCalculationData,
  regionData: RegionData,
) => {
  const electricity_generation = calculationData.electricity_generation
  const co2_emissions = calculationData.co2_emissions

  let fossilReduction = []
  for (let i = 2025; i <= 2030; i++) {
    const climate_path_additional_electricity_gen =
      regionData.total[i - 2025].value -
      electricity_generation.zero_carbon[i] * 0.001

    const dnv_forecast =
      electricity_generation.oil[i] /
      (electricity_generation.oil[i] + electricity_generation.gas[i])

    const additional_electricity_gen_coal = getElectricityGenerationCoal(region)
    const additional_electricity_gen_oil =
      dnv_forecast * (1 - additional_electricity_gen_coal)
    const additional_electricity_gen_gas =
      1 - (additional_electricity_gen_coal - additional_electricity_gen_oil)

    const displaced_electricity_coal =
      climate_path_additional_electricity_gen * additional_electricity_gen_coal
    const displaced_electricity_gas =
      climate_path_additional_electricity_gen * additional_electricity_gen_gas
    const displaced_electricity_oil =
      climate_path_additional_electricity_gen * additional_electricity_gen_oil

    const reduction_electricity_gen_coal =
      displaced_electricity_coal / (electricity_generation.coal[i] * 0.001)
    const reduction_electricity_gen_oil =
      displaced_electricity_oil / (electricity_generation.oil[i] * 0.001)
    const reduction_electricity_gen_gas =
      displaced_electricity_gas / (electricity_generation.gas[i] * 0.001)

    const reduction_fossil_energy_coal =
      reduction_electricity_gen_coal * co2_emissions.coal[i]
    const reduction_fossil_energy_oil =
      reduction_electricity_gen_oil * co2_emissions.oil[i]
    const reduction_fossil_energy_gas =
      reduction_electricity_gen_gas * co2_emissions.gas[i]
    fossilReduction.push(
      reduction_fossil_energy_coal +
        reduction_fossil_energy_oil +
        reduction_fossil_energy_gas,
    )
  }
  return fossilReduction
}

/**
 * Calculate & extrapolate carbon curve from reduction data
 */
export const calculateCarbonCurve = (
  deltaFossilReduction: number,
  fossilData: DataPoint[],
) => {
  fossilData[1].value -= deltaFossilReduction
  //for calculations below: all numbers come from B14:I17 section of the Emission.Budget tab of TEC sheet
  //all the ternary statements are extrapolations based on the 2030 value (also pulled from the TEC sheet)
  const rawValue = fossilData[1].value - (3.815 + 5.0 - 0.19)
  fossilData[2].value =
    (rawValue <= 26
      ? 14.72 + ((rawValue - 20) / 6) * 3.97
      : 18.69 + ((rawValue - 26) / 5.6) * 10.71) +
    (3.6903 + 4.5 - 0.37)
  fossilData[3].value =
    (rawValue <= 26
      ? 12 + ((rawValue - 20) / 6) * 1.25
      : 13.25 + ((rawValue - 26) / 5.6) * 12.65) +
    (3.629 + 3.8 - 0.58)
  fossilData[4].value =
    (rawValue <= 26
      ? 8.96 + ((rawValue - 20) / 6) * 0.64
      : 9.6 + ((rawValue - 26) / 5.6) * 12.5) +
    (3.382 + 3.2 - 0.89)
  fossilData[5].value =
    (rawValue <= 26
      ? 6 + ((rawValue - 20) / 6) * 1.31
      : 7.31 + ((rawValue - 26) / 5.6) * 11.09) +
    (3.054 + 2.5 - 1.26)
  fossilData[6].value =
    (rawValue <= 26
      ? 3.62 + ((rawValue - 20) / 6) * 1.68
      : 5.3 + ((rawValue - 26) / 5.6) * 9.7) +
    (2.8 + 1.7 - 2.0)
  fossilData[7].value =
    (rawValue <= 26
      ? 2 + ((rawValue - 20) / 6) * 1.56
      : 3.56 + ((rawValue - 26) / 5.6) * 6.44) +
    (2.5 + 1.2 - 3.0)

  return fossilData
}

export type TemperatureData = {
  '1.5Year': number
  '1.8Year': number
  '2.0Year': number
}

/**
 * Calculate predicted year to pass 1.5, 1.8, and 2.0 degree increases
 */
export const calculateTemperature = (fossilData: DataPoint[]) => {
  const cumulativeEmmissions2025To2060 = { 2025: 0 }
  let currTotal = 0
  for (let i = 0; i < fossilData.length - 1; i++) {
    cumulativeEmmissions2025To2060[2030 + i * 5] =
      ((fossilData[i].value + fossilData[i + 1].value) / 2) * 5 + currTotal
    currTotal = cumulativeEmmissions2025To2060[2030 + i * 5]
  }

  let onePointFiveYear = 0
  let onePointEightYear = 0
  let twoPointZeroYear = 0
  for (let i = 2026; i <= 2060; i++) {
    const current = 200 + cumulativeEmmissions2025To2060[i - ((i - 2025) % 5)]
    const next = 200 + cumulativeEmmissions2025To2060[i + 5 - ((i - 2025) % 5)]
    const currentValue =
      i % 5 == 0 ? current : current + ((i % 5) * (next - current)) / 5

    if (400 - currentValue < 0 && !onePointFiveYear) {
      onePointFiveYear = i - 1
    }
    if (850 - currentValue < 0 && !onePointEightYear) {
      onePointEightYear = i - 1
    }
    if (1150 - currentValue < 0 && !twoPointZeroYear) {
      twoPointZeroYear = i - 1
    }
    if (onePointFiveYear && onePointEightYear && twoPointZeroYear) {
      break
    }
  }
  if (!twoPointZeroYear) twoPointZeroYear = 2060

  return {
    '1.5Year': onePointFiveYear,
    '1.8Year': onePointEightYear,
    '2.0Year': twoPointZeroYear,
  }
}

/**
 * Calculate coal, gas, oil values regionally in response to user iteraction w/ sliders
 */
export const calculateRegionalCoalGasOil = (
  calculationData: RegionCalculationData,
  regionData: RegionData,
  region: string,
) => {
  const electricity_generation = calculationData.electricity_generation
  const climate_path_additional_electricity_gen =
    regionData.total[regionData.total.length - 1].value -
    electricity_generation.zero_carbon[2030] * 0.001

  const dnv_forecast =
    electricity_generation.oil[2030] /
    (electricity_generation.oil[2030] + electricity_generation.gas[2030])

  const additional_electricity_gen_coal = getElectricityGenerationCoal(region)
  const additional_electricity_gen_oil =
    dnv_forecast * (1 - additional_electricity_gen_coal)
  const additional_electricity_gen_gas =
    1 - (additional_electricity_gen_coal - additional_electricity_gen_oil)

  const displaced_electricity_coal =
    climate_path_additional_electricity_gen * additional_electricity_gen_coal
  const displaced_electricity_gas =
    climate_path_additional_electricity_gen * additional_electricity_gen_gas
  const displaced_electricity_oil =
    climate_path_additional_electricity_gen * additional_electricity_gen_oil
  const coal =
    0.001 * calculationData.electricity_generation.coal[2030] -
    displaced_electricity_coal
  const gas =
    0.001 * calculationData.electricity_generation.gas[2030] -
    displaced_electricity_gas
  const oil =
    0.001 * calculationData.electricity_generation.oil[2030] -
    displaced_electricity_oil
  return { coal, gas, oil }
}

const regions = [
  'chn',
  'nam',
  'lam',
  'ind',
  'sea',
  'mea',
  'opa',
  'eur',
  'ssa',
  'nee',
]
/**
 * Initialize values for every region on app start so bars are accurate on first interaction with a region
 */
export const calculateInitialCoalGasOil = (
  calculationData: CalculationData,
  graphData: GraphData,
) => {
  let coalgasoil = {} as CoalGasOilData
  for (const region of regions) {
    coalgasoil[region] = calculateRegionalCoalGasOil(
      calculationData[region],
      graphData[region],
      region,
    )
  }
  return coalgasoil
}

const technologies = [
  'solar',
  'wind',
  'biomass',
  'geothermal',
  'hydropower',
  'nuclear',
  'total',
]

/**
 * Calculate new global curves in response to resetting values in a single region
 */
export const calculateNewGlobalOnReset = (
  BAURegionData: RegionData,
  oldRegionData: RegionData,
  oldGlobalData: RegionData,
) => {
  const newGlobal: RegionData = {
    solar: [],
    wind: [],
    hydropower: [],
    biomass: [],
    geothermal: [],
    nuclear: [],
    total: [],
  }
  for (let i = 2025; i <= 2030; i++) {
    for (const technology of technologies) {
      newGlobal[technology].push({
        year: i,
        value:
          oldGlobalData[technology][i - 2025].value +
          (BAURegionData[technology][i - 2025].value -
            oldRegionData[technology][i - 2025].value),
      })
    }
  }
  return newGlobal
}
