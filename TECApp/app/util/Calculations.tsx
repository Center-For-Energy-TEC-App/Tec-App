import { RegionData, CalculationData } from '../api/requests'
import { DataPoint } from '../components/DataVisualizations/BAUComparison'
import { getElectricityGenerationCoal } from './ValueDictionaries'

export const calculateEnergyCurve = (
  newVal: number,
  technologyChanged: string,
  regionGraphData: RegionData,
  globalGraphData: RegionData,
  calculationData: CalculationData,
) => {
  const installed_capacity =
    calculationData.installed_capacity[technologyChanged]['2024']
  const forecast_cagr =
    calculationData.forecast_cagr[technologyChanged]['2024-2030']
  const forecast_growth_rate =
    calculationData.forecast_growth_rate[technologyChanged]
  const capacity_factor = calculationData.capacity_factor[technologyChanged]

  const climate_path_cagr = Math.pow(newVal / installed_capacity, 1 / 6) - 1
  const climate_path_minus_forecast = climate_path_cagr - forecast_cagr

  const climate_path_growth_rate = {}
  for (let i = 2025; i <= 2030; i++) {
    climate_path_growth_rate[i] =
      forecast_growth_rate[i] + climate_path_minus_forecast
  }

  const newRegionTechnology = []
  const newRegionTotal = []
  const newGlobalTechnology = []
  const newGlobalTotal = []
  let climate_path_installed_capacty = installed_capacity
  for (let i = 2024; i <= 2030; i++) {
    const electricity_generation =
      climate_path_installed_capacty * 8760 * capacity_factor[i] * 0.001
    climate_path_installed_capacty =
      climate_path_installed_capacty * (1 + climate_path_growth_rate[i + 1])

    const valueChange =
      electricity_generation -
      regionGraphData[technologyChanged][i - 2024].value

    newRegionTechnology.push({ year: i, value: electricity_generation })

    newRegionTotal.push({
      year: i,
      value: regionGraphData.total[i - 2024].value + valueChange,
    })
    newGlobalTechnology.push({
      year: i,
      value: globalGraphData[technologyChanged][i - 2024].value + valueChange,
    })
    newGlobalTotal.push({
      year: i,
      value: globalGraphData.total[i - 2024].value + valueChange,
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

export const calculateCarbonReductions = (
  region: string,
  calculationData: CalculationData,
  regionData: RegionData,
  currFossilReduction: number,
  fossilData: DataPoint[]
) => {
  const electricity_generation = calculationData.electricity_generation
  const co2_emissions = calculationData.co2_emissions

  const climate_path_additional_electricity_gen =
      regionData.total[regionData.total.length-1].value -
      electricity_generation.zero_carbon * 0.001


    const dnv_forecast = electricity_generation.oil / (electricity_generation.oil + electricity_generation.gas)

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
      displaced_electricity_coal / (electricity_generation.coal * 0.001)
    const reduction_electricity_gen_oil =
      displaced_electricity_oil / (electricity_generation.oil * 0.001)
    const reduction_electricity_gen_gas =
      displaced_electricity_gas / (electricity_generation.gas * 0.001)

    const reduction_fossil_energy_coal =
      reduction_electricity_gen_coal * co2_emissions.coal
    const reduction_fossil_energy_oil =
      reduction_electricity_gen_oil * co2_emissions.oil
    const reduction_fossil_energy_gas =
      reduction_electricity_gen_gas * co2_emissions.gas

    const fossilReduction = reduction_fossil_energy_coal + reduction_fossil_energy_oil + reduction_fossil_energy_gas

    const newFossilData = calculateCarbonCurve(fossilReduction-currFossilReduction, fossilData)
    console.log(newFossilData)

    return {newFossilReduction: fossilReduction, newFossilData: newFossilData}
  
}

export const calculateCarbonCurve = (deltaFossilReduction: number, fossilData: DataPoint[]) =>{
  fossilData[1].value -= deltaFossilReduction
  fossilData[2].value = fossilData[1].value<=26?(14.72+((fossilData[1].value-20)/6)*3.97):(18.69+((fossilData[1].value-26)/5.6)*10.71)
  fossilData[3].value = fossilData[1].value<=26?(12+((fossilData[1].value-20)/6)*1.25):(13.25+((fossilData[1].value-26)/5.6)*12.65)
  fossilData[4].value = fossilData[1].value<=26?(8.96+((fossilData[1].value-20)/6)*0.64):(9.6+((fossilData[1].value-26)/5.6)*12.5)
  fossilData[5].value = fossilData[1].value<=26?(6+((fossilData[1].value-20)/6)*1.31):(7.31+((fossilData[1].value-26)/5.6)*11.09)
  fossilData[6].value = fossilData[1].value<=26?(3.62+((fossilData[1].value-20)/6)*1.68):(5.3+((fossilData[1].value-26)/5.6)*9.7)
  fossilData[7].value = fossilData[1].value<=26?(2+((fossilData[1].value-20)/6)*1.56):(3.56+((fossilData[1].value-26)/5.6)*6.44)
  
  return fossilData
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
  for (let i = 2024; i <= 2030; i++) {
    for (const technology of technologies) {
      newGlobal[technology].push({
        year: i,
        value:
          oldGlobalData[technology][i - 2024].value +
          (BAURegionData[technology][i - 2024].value -
            oldRegionData[technology][i - 2024].value),
      })
    }
  }
  return newGlobal
}
