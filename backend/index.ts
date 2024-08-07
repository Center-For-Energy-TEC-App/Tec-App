import express, {Router} from "express"
import "dotenv/config"
import { getAllDefaultValues, getMinMaxValues } from "./src/query"
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

const router = Router()

app.use(router)
app.use(express.json())
app.use(cors({
    origin: "*"
}))

router.get('/defaults', getAllDefaultValues)

router.get('/minmax', getMinMaxValues)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})