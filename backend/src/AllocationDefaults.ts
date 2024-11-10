import "dotenv/config"
import { pool } from "../index.ts"
import { Request, Response, NextFunction } from "express"

const regions = ["global","chn","ind","mea","nam","nee","sea","eur","lam","ssa","opa"]

type RegionInfo = {
    solar: number
    wind: number
    hydropower: number
    geothermal: number
    biomass: number
    nuclear: number
}

type RegionalDefaultValues = {
    2025: RegionInfo
    bau: RegionInfo
    dynamic: RegionInfo
}

type DefaultValues = {
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

export const getAllDefaultValues = async (req: Request, res: Response, next: NextFunction) =>{
    let results  =
         {global: {2025: {}, bau: {}, dynamic: {}}, 
         chn:{2025: {}, bau: {}, dynamic: {}}, 
         ind:{2025: {}, bau: {}, dynamic: {}}, 
         mea:{2025: {}, bau: {}, dynamic: {}}, 
         nam:{2025: {}, bau: {}, dynamic: {}}, 
         nee:{2025: {}, bau: {}, dynamic: {}},
         sea:{2025: {}, bau: {}, dynamic: {}}, 
         eur:{2025: {}, bau: {}, dynamic: {}}, 
         lam:{2025: {}, bau: {}, dynamic: {}}, 
         ssa:{2025: {}, bau: {}, dynamic: {}}, 
         opa:{2025: {}, bau: {}, dynamic: {}}} as DefaultValues

    let technologies = ["solar", "wind", "biomass", "geothermal", "hydropower" , "nuclear"]

    const data_aggregation_installed_capacity_query = await pool.query("SELECT * FROM data_aggregation_installed_capacity WHERE (year=2025 OR year=2030) AND (energy_type='Solar' OR energy_type='Wind');")
    const transpose_installed_capacity_query = await pool.query("SELECT * FROM transpose_installed_capacity WHERE (year=2025 OR year=2030) AND (energy_type='hydropower' OR energy_type='geothermal' OR energy_type='biomass_fired' OR energy_type='nuclear');")
    const installed_capacity_rows = data_aggregation_installed_capacity_query.rows.concat(transpose_installed_capacity_query.rows)

    for(let i=0; i<installed_capacity_rows.length; i++){
        const techKey = technologies[Math.floor(i/(2*11))] as keyof typeof results.global.bau
        const region = installed_capacity_rows[i].region as keyof typeof results
        if(parseInt(installed_capacity_rows[i].year)===2025){
            results[region][2025][techKey] =  parseInt(parseFloat(installed_capacity_rows[i].value).toFixed(0))
        }else{
            results[region]["bau"][techKey] =  parseInt(parseFloat(installed_capacity_rows[i].value).toFixed(0))
            results[region]["dynamic"][techKey] =  parseInt(parseFloat(installed_capacity_rows[i].value).toFixed(0))
        }
    }
    
    if(results!==null){
        res.status(200).json(results)
    }else{
        res.status(400)
    }
}

export const getMinMaxValues = async (req: Request, res: Response, next: NextFunction) =>{
    const results  = await pool.query('SELECT * FROM min_max_values')
    let transposedResults = 
        {global: {min: {}, max:{}}, 
        chn:{min: {}, max:{}}, 
        ind:{min: {}, max:{}}, 
        mea:{min: {}, max:{}}, 
        nam:{min: {}, max:{}}, 
        nee:{min: {}, max:{}},
        sea:{min: {}, max:{}}, 
        eur:{min: {}, max:{}}, 
        lam:{min: {}, max:{}}, 
        ssa:{min: {}, max:{}}, 
        opa:{min: {}, max:{}}}
    for(const row of results.rows){
        for(const region of regions){
            const region_key = region as keyof typeof transposedResults
            const category_key = row['category'] as keyof typeof transposedResults[typeof region_key]
            transposedResults[region_key][category_key] = {...transposedResults[region_key][category_key], [row["energy_type"]]: row[region]}
        }
    }
    if(results!==null){
        res.status(200).json(transposedResults)
    }else{
        res.status(400)
    } 
}