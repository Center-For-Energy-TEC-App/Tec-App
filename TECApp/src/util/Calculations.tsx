import { RegionData, RenewableEnergyCalculationData } from '../api/requests'

type ValuePair = {
  technology: string
  value: number
}

export const calculateCurve = (
  newVal: ValuePair,
  regionGraphData: RegionData,
  globalGraphData: RegionData,
  calculationData: RenewableEnergyCalculationData,
) => {
  const installed_capacity =
    calculationData.installed_capacity[newVal.technology]['2024']
  const forecast_cagr =
    calculationData.forecast_cagr[newVal.technology]['2024-2030']
  const forecast_growth_rate =
    calculationData.forecast_growth_rate[newVal.technology]
  const capacity_factor = calculationData.capacity_factor[newVal.technology]

  const climate_path_cagr =
    Math.pow(newVal.value / installed_capacity, 1 / 6) - 1
  const climate_path_minus_forecast = climate_path_cagr - forecast_cagr

  const climate_path_growth_rate = {}
  for (let i = 2025; i <= 2030; i++) {
    climate_path_growth_rate[i] =
      parseFloat(forecast_growth_rate[i]) + climate_path_minus_forecast
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
      regionGraphData[newVal.technology][i - 2024].value

    newRegionTechnology.push({ year: i, value: electricity_generation })

    newRegionTotal.push({
      year: i,
      value: regionGraphData.total[i - 2024].value + valueChange,
    })
    newGlobalTechnology.push({
      year: i,
      value: globalGraphData[newVal.technology][i - 2024].value + valueChange,
    })
    newGlobalTotal.push({
      year: i,
      value: globalGraphData.total[i - 2024].value + valueChange,
    })
  }

  return {
    regional: {
      ...regionGraphData,
      [newVal.technology]: newRegionTechnology,
      total: newRegionTotal,
    },
    global: {
      ...globalGraphData,
      [newVal.technology]: newGlobalTechnology,
      total: newGlobalTotal,
    },
  }
}

let technologies = [
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
