import express from "express"
import cors from "cors"
import authRoute from "./modules/auth/auth.routes.ts"
import contestRoute from "./modules/contests/contests.routes.ts"

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/auth", authRoute)
app.use("/api", contestRoute)

export default app

