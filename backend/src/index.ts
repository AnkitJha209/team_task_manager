import express, { type Request } from 'express'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/health-check', (req: Request, res) => {
  res.status(200).json({ status: 'ok' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
