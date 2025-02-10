import express, {Router} from "express"
import "dotenv/config"
import { getAllDefaultValues, getMinMaxValues } from "./src/AllocationDefaults"
import Pool from "pg"
import cors from "cors"
import { getCalculationData, getInitialGraphData } from "./src/GraphData"
import { insertFeedback } from "./src/Feedback"

const app = express()
app.use(express.json())

const port = process.env.LOCAL_PORT

/**
 * Establish connection to DigitalOcean
 */
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
app.use(cors({
    origin: "*"
}))

router.get('/defaults', getAllDefaultValues)

router.get('/minmax', getMinMaxValues)

router.get('/initgraph', getInitialGraphData)

router.get('/calc', getCalculationData)

router.post('/feedback', insertFeedback)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})