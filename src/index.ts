import express from "express"
import cors from "cors"
import authRoute from "./modules/auth/auth.routes.ts"


const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/auth", authRoute)

export default app

