import "dotenv/config"
import { pool } from "../index.ts"
import { Request, Response, NextFunction } from "express"

type GraphData = {
   year: number,
   value: number
}

type RegionData = {
    solar: GraphData[]
    wind: GraphData[]
    hydropower: GraphData[]
    geothermal: GraphData[]
    biomass: GraphData[]
    nuclear: GraphData[]
    total: GraphData[]
}

type InitialGraphData = {   
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

const regions = ["global","chn","ind","mea","nam","nee","sea","eur","lam","ssa","opa"]

export const getInitialGraphData = async (req: Request, res: Response, next: NextFunction) => {

    let results = {global:{}, chn:{},ind: {}, mea:{}, nam:{}, nee:{}, sea:{}, eur:{}, lam:{}, ssa:{}, opa:{}} as InitialGraphData

    const query= await pool.query('SELECT * FROM initial_graph_data');
    let rowNum = 0
    for(const row of query.rows){
        if(rowNum<=6){
            for(const region of regions){
                const regionKey = region as keyof typeof results
                const energyKey = row.energy_type as keyof typeof results[typeof regionKey]

                results[regionKey][energyKey] = results[regionKey][energyKey]?
                    [...results[regionKey][energyKey], {year:row.year, value:parseFloat(row[region])}]:
                    [{year:row.year, value:parseFloat(row[region])}]

                results[regionKey].total = results[regionKey].total?
                    [...results[regionKey].total, {year: row.year, value: parseFloat(row[region])}]:
                    [{year: row.year, value: parseFloat(row[region])}]
            }
        }else{
            for(const region of regions){
                const regionKey = region as keyof typeof results
                const energyKey = row.energy_type as keyof typeof results[typeof regionKey]
                results[regionKey][energyKey] = results[regionKey][energyKey]?
                    [...results[regionKey][energyKey], {year:row.year, value:parseFloat(row[region])}]:
                    [{year:row.year, value:parseFloat(row[region])}]

                results[regionKey].total[rowNum%7].value+=parseFloat(row[region])
            }
        }
        rowNum++
    }

    if(results!==null){
        res.status(200).json(results)
    }else{
        res.status(400)
    }
}

type YearRange = {
    "2024"?: number
    "2025"?: number
    "2026"?: number
    "2027"?: number
    "2028"?: number
    "2029"?: number
    "2030"?: number
    "2024-2030"?: number
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

type RenewableEnergyCalculationData = {
    installed_capacity: RawData
    forecast_cagr: RawData
    forecast_growth_rate: RawData
    capacity_factor: RawData
    electricity_generation: RawData,
    co2_emissions: RawData,
    region: string
}

export const getRegionCalculationData = async (req: Request, res: Response, next: NextFunction) =>{
    let technologies = ["solar", "wind", "biomass", "geothermal", "hydropower" , "nuclear"]
    let nonrenewables = ["coal", "gas", "oil", "zero_carbon"]

    const region = req.params.region
    
    const results = {installed_capacity: {}, forecast_cagr: {}, forecast_growth_rate: {}, capacity_factor: {}, electricity_generation: {}, co2_emissions:{}, region:region} as RenewableEnergyCalculationData

    //installed capacity
    const data_aggregation_installed_capacity_query = await pool.query("SELECT * FROM data_aggregation_installed_capacity WHERE region=$1 AND year=2024 AND (energy_type='Solar' OR energy_type='Wind');", [region])
    const transpose_installed_capacity_query = await pool.query("SELECT * FROM transpose_installed_capacity WHERE region=$1 AND year=2024 AND (energy_type='hydropower' OR energy_type='geothermal' OR energy_type='biomass_fired' OR energy_type='nuclear');", [region])
    const installed_capacity_rows = data_aggregation_installed_capacity_query.rows.concat(transpose_installed_capacity_query.rows)

    for(let i=0; i<installed_capacity_rows.length; i++){
        const techKey = technologies[i] as keyof typeof results.installed_capacity
        results.installed_capacity[techKey] = {"2024": installed_capacity_rows[i].value}
    }
    
    technologies = ["solar", "wind","hydropower", "geothermal", "biomass",  "nuclear"]  //query order is different from here on
    //forecast cagr
    const forecast_cagr_query = await pool.query("SELECT * FROM secondary_calculations_forecast_cagr WHERE region=$1", [region])
    for(let i = 0; i<forecast_cagr_query.rows.length; i++){
        const techKey = technologies[i] as keyof typeof results.forecast_cagr
        results.forecast_cagr[techKey] = {"2024-2030": forecast_cagr_query.rows[i].value}
    }

    //forecast_growth_rate
    const forecast_growth_rate_query = await pool.query("SELECT * FROM secondary_calculations_forecast_growth_rate WHERE region=$1 AND year>=2025", [region])
    for(let i = 0; i<forecast_growth_rate_query.rows.length; i++){
        const techKey = technologies[Math.floor(i/6)] as keyof typeof results.forecast_growth_rate
        const yearKey = forecast_growth_rate_query.rows[i].year
        results.forecast_growth_rate[techKey] = results.forecast_growth_rate[techKey]?
            {...results.forecast_growth_rate[techKey], [yearKey]:forecast_growth_rate_query.rows[i].value}: 
            {[yearKey]:forecast_growth_rate_query.rows[i].value}
    }

    //capacity_factor
    const capacity_factor_query = await pool.query("SELECT * FROM secondary_calculations_capacity_factor WHERE region=$1 AND year>=2024", [region])
    for(let i = 0; i<capacity_factor_query.rows.length; i++){
        const techKey = technologies[Math.floor(i/7)] as keyof typeof results.capacity_factor
        const yearKey = capacity_factor_query.rows[i].year
        results.capacity_factor[techKey] = results.capacity_factor[techKey]?
            {...results.capacity_factor[techKey], [yearKey]:capacity_factor_query.rows[i].value}:
            {[yearKey]:capacity_factor_query.rows[i].value}
    }

    //electricity_generation
    const transpose_electricity_generation_query = await pool.query("SELECT * FROM transpose_electricity_generation WHERE region=$1 AND year>=2025 AND (energy_type='coal_fired' OR energy_type='gas_fired' OR energy_type='oil_fired');", [region])
    const data_aggregation_total_zero_carbon_query = await pool.query("SELECT * FROM data_aggregation_electricity_generation WHERE region=$1 AND year>=2025 AND energy_type='Total Zero-Carbon';", [region])
    const electricity_generation_query = transpose_electricity_generation_query.rows.concat(data_aggregation_total_zero_carbon_query.rows)
    for(let i = 0; i<electricity_generation_query.length; i++){
        const nonrenewableKey = nonrenewables[Math.floor(i/6)] as keyof typeof results.electricity_generation
        const yearKey = electricity_generation_query[i].year
        results.electricity_generation[nonrenewableKey] = results.electricity_generation[nonrenewableKey]?
            {...results.electricity_generation[nonrenewableKey], [yearKey]:electricity_generation_query[i].value}:
            {[yearKey]:electricity_generation_query[i].value}
    }
    
    //co2 emissions
    const co2_emissions_query = await pool.query("SELECT * FROM transpose_co2_emissions WHERE region=$1 AND year>=2025 AND (energy_type='coal' OR energy_type='natural_gas' OR energy_type='oil')", [region])
    for(let i = 0; i<co2_emissions_query.rows.length; i++){
        const nonrenewableKey = nonrenewables[Math.floor(i/6)] as keyof typeof results.co2_emissions
        const yearKey = co2_emissions_query.rows[i].year
        results.co2_emissions[nonrenewableKey] = results.co2_emissions[nonrenewableKey]?
            {...results.co2_emissions[nonrenewableKey], [yearKey]:co2_emissions_query.rows[i].value}:
            {[yearKey]:co2_emissions_query.rows[i].value}
    }

    if(results!==null){
        res.status(200).json(results)
    }else{
        res.status(400)
    }
}

export const getInitialFossilData = async (req: Request, res: Response, next: NextFunction) => {
    let results = []
    const query = await pool.query("SELECT * FROM fossil_emissions_data WHERE region='global' AND year>=2024")
    let yearCount = 2024
    for(const row of query.rows){
        results.push({year: yearCount, value: parseFloat(row.value)})
        yearCount++
    }
    results.push({year: 2040, value: results[6].value>30?results[6].value*0.82:results[6].value>=25?results[6].value*0.71:results[6].value*0.6})
    results.push({year: 2050, value: results[6].value>30?results[7].value*0.71:results[6].value>=25?results[7].value*0.58:results[7].value*0.5})
    results.push({year: 2060, value: results[6].value>30?results[8].value*0.542:results[6].value>=25?results[8].value*0.436:results[8].value*0.33})

    if(results!==null){
        res.status(200).json(results)
    }else{
        res.status(400)
    }
}


/*
-Initial all region graph data stored in db
-Pulled on app start to initially populate graphs (global is also populated from sum)
-On clicking on a region, pull necessary calculation data from database for tha region (~150 numbers)
-In app calculations done when onSliderComplete which updates graph data for that region
-Sent back up to parent component to recalculate global (and save regional changes) 
*/