import app from './app.js'

const port = 5001

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
