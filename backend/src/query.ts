import "dotenv/config"
import { pool } from "../index.ts"
import { Request, Response, NextFunction } from "express"

const regions = ["global","chn","ind","mea","nam","nee","sea","eur","lam","ssa","opa"]

type DefaultValues = {
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

type RegionalValues = {
    global: DefaultValues[]
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

export const getAllDefaultValues = async (req: Request, res: Response, next: NextFunction) =>{
    // const {global_tw} = req.query

    // let results = {}
    // for(const region of regions){
    //     const result = await pool.query(`SELECT * FROM allocation_defaults_${region} WHERE (global_tw=$1 AND category='altered') OR category!='altered'`, [global_tw])
    //     results = {...results, [region]:result.rows}

    let results: RegionalValues  = {global: [], chn:[], ind:[], mea:[], nam:[], nee:[],sea:[], eur:[], lam:[], ssa:[], opa:[]}
    const query= await pool.query('SELECT * FROM allocation_defaults')
    for(const row of query.rows){
        const regionKey = row.region as keyof typeof results
        const values = row as DefaultValues
        if(row.category==='2023'){
            results[regionKey].push(values)
        }else{
            results[regionKey].push(values)
            results[regionKey].push(values)

        }
    }
    console.log(results)
    
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