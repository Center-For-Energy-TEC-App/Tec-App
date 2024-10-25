import { pool } from "../index.ts"
import { Request, Response, NextFunction } from "express"

type Feedback = {
    feedback: string
}
export const insertFeedback = async (req: Request, res: Response, next: NextFunction) =>{
    const {feedback} = req.body as Feedback
    const query = await pool.query("INSERT INTO feedback VALUES($1)", [feedback])
    if(query!==null){
        res.status(201).json(query);
    }else{
        res.status(400);
    }
}