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

/**
 * Get all initial graph data for every region so no initial calculations have to be done
 * Specific details for how this data is formatted and sent to frontend found in TEC developer documentation google doc
 */
export const getInitialGraphData = async (req: Request, res: Response, next: NextFunction) => {

    let results = {global:{}, chn:{},ind: {}, mea:{}, nam:{}, nee:{}, sea:{}, eur:{}, lam:{}, ssa:{}, opa:{}} as InitialGraphData

    const query= await pool.query('SELECT * FROM initial_graph_data');
    let rowNum = 0
    for(const row of query.rows){
        if(rowNum<6){
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

                results[regionKey].total[rowNum%6].value+=parseFloat(row[region])
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

type RegionCalculationData = {
    installed_capacity: ElectricityGenerationData
    capacity_factor: ElectricityGenerationData
    electricity_generation: CarbonBudgetData,
    co2_emissions: CarbonBudgetData,
    region: string
}

type CalculationData = {
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
 * Get all calculation data needed for every use-case for every region
 * Specific details for how this data is formatted and sent to frontend found in TEC developer documentation google doc
 */
export const getCalculationData = async (req: Request, res: Response, next: NextFunction) =>{
    
    const results = {
        global: {installed_capacity: {}, capacity_factor: {}, electricity_generation: {}, co2_emissions:{}, region:"global"},
        chn: {installed_capacity: {}, capacity_factor: {}, electricity_generation: {}, co2_emissions:{}, region:"chn"},
        nam: {installed_capacity: {}, capacity_factor: {}, electricity_generation: {}, co2_emissions:{}, region:"nam"},
        lam: {installed_capacity: {}, capacity_factor: {}, electricity_generation: {}, co2_emissions:{}, region:"lam"},
        ind: {installed_capacity: {}, capacity_factor: {}, electricity_generation: {}, co2_emissions:{}, region:"ind"},
        sea: {installed_capacity: {}, capacity_factor: {}, electricity_generation: {}, co2_emissions:{}, region:"sea"},
        mea: {installed_capacity: {}, capacity_factor: {}, electricity_generation: {}, co2_emissions:{}, region:"mea"},
        opa: {installed_capacity: {}, capacity_factor: {}, electricity_generation: {}, co2_emissions:{}, region:"opa"},
        eur: {installed_capacity: {}, capacity_factor: {}, electricity_generation: {}, co2_emissions:{}, region:"eur"},
        ssa: {installed_capacity: {}, capacity_factor: {}, electricity_generation: {}, co2_emissions:{}, region:"ssa"},
        nee: {installed_capacity: {}, capacity_factor: {}, electricity_generation: {}, co2_emissions:{}, region:"nee"},
    } as CalculationData

    let technologies = ["solar", "wind", "biomass", "geothermal", "hydropower" , "nuclear"]
    let nonrenewables = ["coal", "gas", "oil", "zero_carbon"]

    const data_aggregation_installed_capacity_query = await pool.query("SELECT * FROM data_aggregation_installed_capacity WHERE year=2024 AND (energy_type='Solar' OR energy_type='Wind');")
    const transpose_installed_capacity_query = await pool.query("SELECT * FROM transpose_installed_capacity WHERE year=2024 AND (energy_type='hydropower' OR energy_type='geothermal' OR energy_type='biomass_fired' OR energy_type='nuclear');")

    //installed capacity
    const installed_capacity_rows = data_aggregation_installed_capacity_query.rows.concat(transpose_installed_capacity_query.rows)
    for(let i=0; i<installed_capacity_rows.length; i++){
        const techKey = technologies[Math.floor(i/11)] as keyof typeof results.global.installed_capacity
        const region = installed_capacity_rows[i].region as keyof typeof results
        results[region].installed_capacity[techKey] = {"2024": parseFloat(installed_capacity_rows[i].value)}
    }

    technologies = ["solar", "wind","hydropower", "geothermal", "biomass",  "nuclear"]  //query order is different from here on

    //capacity_factor
    const capacity_factor_query = await pool.query("SELECT * FROM secondary_calculations_capacity_factor WHERE year>=2024")
    for(let i = 0; i<capacity_factor_query.rows.length; i++){
        const techKey = technologies[Math.floor(i/(7*11))] as keyof typeof results.global.capacity_factor
        const yearKey = capacity_factor_query.rows[i].year
        const region = capacity_factor_query.rows[i].region as keyof typeof results
        results[region].capacity_factor[techKey] = results[region].capacity_factor[techKey]?
            {...results[region].capacity_factor[techKey], [yearKey]:parseFloat(capacity_factor_query.rows[i].value)}:
            {[yearKey]:parseFloat(capacity_factor_query.rows[i].value)}
    }

    //electricity_generation
    const transpose_electricity_generation_query = await pool.query("SELECT * FROM transpose_electricity_generation WHERE year>=2025 AND (energy_type='coal_fired' OR energy_type='gas_fired' OR energy_type='oil_fired');")
    const data_aggregation_total_zero_carbon_query = await pool.query("SELECT * FROM data_aggregation_electricity_generation WHERE year>=2025 AND energy_type='Total Zero-Carbon';")
    const electricity_generation_query = transpose_electricity_generation_query.rows.concat(data_aggregation_total_zero_carbon_query.rows)
    for(let i = 0; i<electricity_generation_query.length; i++){
        const nonrenewableKey = nonrenewables[Math.floor(i/(6*11))] as keyof typeof results.global.electricity_generation
        const region = electricity_generation_query[i].region as keyof typeof results
        const yearKey = electricity_generation_query[i].year
        results[region].electricity_generation[nonrenewableKey] = results[region].electricity_generation[nonrenewableKey]?
        {...results[region].electricity_generation[nonrenewableKey], [yearKey]:parseFloat(electricity_generation_query[i].value)}:
        {[yearKey]:parseFloat(electricity_generation_query[i].value)}
    }

    //co2 emissions
    const co2_emissions_query = await pool.query("SELECT * FROM transpose_co2_emissions WHERE year>=2025 AND (energy_type='coal' OR energy_type='natural_gas' OR energy_type='oil')")
    for(let i = 0; i<co2_emissions_query.rows.length; i++){
        const nonrenewableKey = nonrenewables[Math.floor(i/(6*11))] as keyof typeof results.global.co2_emissions
        const region = co2_emissions_query.rows[i].region as keyof typeof results
        const yearKey = co2_emissions_query.rows[i].year
        results[region].co2_emissions[nonrenewableKey] = results[region].co2_emissions[nonrenewableKey]?
        {...results[region].co2_emissions[nonrenewableKey], [yearKey]:parseFloat(co2_emissions_query.rows[i].value)}:
        {[yearKey]:parseFloat(co2_emissions_query.rows[i].value)}
    }

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