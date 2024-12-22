import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// app.use for middleware configuration me kaam aata hai 
// CORS_ORIGIN= * allow from everywhere

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credential: true
}))

app.use(express.json({limit: "16kb"}))
// url se data ayega to express ko smjhana kese configure krna hai 
app.use(express.urlencoded({extended: true , limit :"16kb" }))
// public folder assets
app.use(express.static("public"))
app.use(cookieParser())


// routes import
import userRouter from './routes/user.routes.js' 

// routes declaration
app.use("/api/v1/users" , userRouter)

// http://localhost:800/api/v1/users/register

export {app}






