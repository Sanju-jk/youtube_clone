import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true
}))


//middlewares to handle, json req, url , cookie parser and    static assets
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



//routes
import userRouter from "./routes/user.routes.js"

//routes declaration 
// /api/v1/ is the base path url of our route
app.use("/api/v1/users", userRouter)


export {app}