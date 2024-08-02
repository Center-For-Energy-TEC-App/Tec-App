import "dotenv/config"
import { pool } from "../index.ts"
import { Request, Response, NextFunction } from "express"

export const getDefaultValues = async (req: Request, res: Response, next: NextFunction) =>{
    const {region, category, global_tw} = req.params
    
    const results = await pool.query(`SELECT * FROM allocation_defaults_${region} WHERE category=$1 AND global_tw=$2`, [category, global_tw])
    if(results!==null){
        res.status(200).json(results.rows)
    }else{
        res.status(400)
    }
}