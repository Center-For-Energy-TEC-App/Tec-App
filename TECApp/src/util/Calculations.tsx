import { RegionData, RenewableEnergyCalculationData } from '../api/requests'

type ValuePair = {
  technology: string
  value: number
}

export const calculateCurve = (
  newVal: ValuePair,
  graphData: RegionData,
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

  const climate_path_installed_capacty = {}
  let currValue = installed_capacity
  for (let i = 2024; i <= 2030; i++) {
    climate_path_installed_capacty[i] = currValue
    currValue = currValue * (1 + climate_path_growth_rate[i + 1])
  }

  const electricity_generation = {}
  for (let i = 2024; i <= 2030; i++) {
    electricity_generation[i] =
      climate_path_installed_capacty[i] * 8760 * capacity_factor[i] * 0.001
  }

  const newCurve = [
    { year: 2024, value: electricity_generation[2024] },
    { year: 2025, value: electricity_generation[2025] },
    { year: 2026, value: electricity_generation[2026] },
    { year: 2027, value: electricity_generation[2027] },
    { year: 2028, value: electricity_generation[2028] },
    { year: 2029, value: electricity_generation[2029] },
    { year: 2030, value: electricity_generation[2030] },
  ]

  const newTotal = []
  for (let i = 0; i <= 6; i++) {
    newTotal.push({
      year: 2024 + i,
      value:
        graphData.total[i].value +
        (newCurve[i].value - graphData[newVal.technology][i].value),
    })
  }

  return { ...graphData, [newVal.technology]: newCurve, total: newTotal }
}
