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

export const getAllCalculationData = async (req: Request, res: Response, next: NextFunction) =>{

}

export const getInitialGraphData = async (req: Request, res: Response, next: NextFunction) => {

    let results: InitialGraphData = {global:{solar:[],wind:[],hydropower:[],geothermal:[],biomass:[],nuclear:[],total:[]}, 
                                    chn:{solar:[],wind:[],hydropower:[],geothermal:[],biomass:[],nuclear:[],total:[]},
                                    ind: {solar:[],wind:[],hydropower:[],geothermal:[],biomass:[],nuclear:[],total:[]},
                                    mea:{solar:[],wind:[],hydropower:[],geothermal:[],biomass:[],nuclear:[],total:[]}, 
                                    nam:{solar:[],wind:[],hydropower:[],geothermal:[],biomass:[],nuclear:[],total:[]}, 
                                    nee:{solar:[],wind:[],hydropower:[],geothermal:[],biomass:[],nuclear:[],total:[]},
                                    sea:{solar:[],wind:[],hydropower:[],geothermal:[],biomass:[],nuclear:[],total:[]}, 
                                    eur:{solar:[],wind:[],hydropower:[],geothermal:[],biomass:[],nuclear:[],total:[]}, 
                                    lam:{solar:[],wind:[],hydropower:[],geothermal:[],biomass:[],nuclear:[],total:[]}, 
                                    ssa:{solar:[],wind:[],hydropower:[],geothermal:[],biomass:[],nuclear:[],total:[]}, 
                                    opa:{solar:[],wind:[],hydropower:[],geothermal:[],biomass:[],nuclear:[],total:[]}}

    const query= await pool.query('SELECT * FROM initial_graph_data');
    let counter = 0
    for(const row of query.rows){
        if(counter<=6){
            for(const region of regions){
                const regionKey = region as keyof typeof results
                const energyKey = row.energy_type as keyof typeof results[typeof regionKey]
                results[regionKey][energyKey].push({year:row.year, value:parseFloat(row[region])})
                results[regionKey].total.push({year: row.year, value: parseFloat(row[region])})
            }
        }else{
            for(const region of regions){
                const regionKey = region as keyof typeof results
                const energyKey = row.energy_type as keyof typeof results[typeof regionKey]
                results[regionKey][energyKey].push({year:row.year, value:parseFloat(row[region])})
                results[regionKey].total[counter%7].value+=parseFloat(row[region])
            }
        }
        counter++
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