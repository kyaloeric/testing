import express, { json ,Request,Response,NextFunction} from "express";
import dotenv from 'dotenv'

import cors from "cors"
import userRouter from "./routes/userRoutes";


dotenv.config()

const app=express();

app.use(json());

app.use(cors())



app.use('/users',userRouter)



app.use((error:Error,req:Request,res:Response,next:NextFunction)=>{
    res.json({
        message:error
    })

})

const port=process.env.PORT || 4000;
app.listen(port,()=>{
    console.log(`This App is running on port:${port}`);
    
})