import "dotenv/config"
import { pool } from "../index.ts"

export const getAll = async () =>{
    try{
        return await new Promise(function (resolve, reject){
            pool.query("SELECT * FROM test_table", (error, results)=>{
                if(results && results.rows){
                    resolve(results.rows)
                }else{
                    reject(new Error("no results found"))
                }
            })
        })
    }catch(error_1){
        console.error(error_1)
        throw new Error("Error")
    }
}