import express from "express"
import "dotenv/config"
import { getAll } from "./src/query"
import Pool from "pg"
import cors from "cors"

const app = express()
const port = process.env.LOCAL_PORT

const newPool = Pool.Pool;
export const pool = new newPool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    ssl: {
        rejectUnauthorized: false
    }
})

app.use(express.json())

app.use(cors({
    origin: "*"
}))

app.get('/', (req, res) => {
    getAll().then(response=>{
        res.status(200).send(response);
    }).catch(error=>{
        res.status(500).send(error);
    })
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})