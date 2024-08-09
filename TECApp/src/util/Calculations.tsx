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

    const installed_capacity = calculationData.installed_capacity[newVal.technology]
    const forecast_cagr = calculationData.forecast_cagr[newVal.technology]
    const forecast_growth_rate = calculationData.forecast_growth_rate[newVal.technology]
    const capacity_factor = calculationData.capacity_factor[newVal.technology]

    const newCurve =  [
        {year:2024, value: 1000},
        {year:2025, value: 1000},
        {year:2026, value: 1000},
        {year:2027, value: 1000},
        {year:2028, value: 1000},
        {year:2029, value: 1000},
        {year:2030, value: 1000},
    ]

    let newTotal = []
    for(let i = 0; i<=6; i++){
        newTotal.push({year:2024+i, value:graphData.total[i].value + (newCurve[i].value-graphData[newVal.technology][i].value)})
    }
    
    return {...graphData, [newVal.technology]: newCurve, total:newTotal}
}
