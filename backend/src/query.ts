import "dotenv/config"
import { pool } from "../index.ts"
import { Request, Response, NextFunction } from "express"

const regions = ["global","chn","ind","mea","nam","nee","sea","eur","lam","ssa","opa"]


export const getAllDefaultValues = async (req: Request, res: Response, next: NextFunction) =>{
    const {global_tw} = req.query

    let results = {};
    for(const region of regions){
        const result = await pool.query(`SELECT * FROM allocation_defaults_${region} WHERE (global_tw=$1 AND category='altered') OR category!='altered'`, [global_tw])
        results = {...results, [region]:result.rows}
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