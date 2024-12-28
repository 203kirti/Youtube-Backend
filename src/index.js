import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from "./app.js";

dotenv.config({
    path: './.env'
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , ()=> {
        console.log(`server is running at port : ${process.env.PORT}`);
    })
})
.catch ((err) => {
    console.log("MONGO DB connection fail !!! ", err);
})














/*

import express from "express"
const app = express()
 
// iife function in JS (immediate invoked function expression (IIfe )
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI} / ${DB_NAME}`)
        app.on("error" ,(error) => {
            console.log("ERROR express is having some error :", error);
            throw err 
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT} `);
        } )

    }catch(error){
        console.error("ERROR :" , error)
        throw err
    }
}
) ()

*/