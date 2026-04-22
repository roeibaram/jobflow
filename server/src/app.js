import cors from 'cors'
import express from 'express'
import applicationRoutes from './routes/applicationRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/applications', applicationRoutes)

export default app
