require('dotenv').config()
const express = require('express')
const cors = require('cors')
// const SetupDB = require('./models/setupDB')
const SetupRouter = require('./routers/setupRouter')




const app = express()
app.use(cors())
app.options('*', cors())

app.get('/kon', (req, res) => {
  return res.status(200).json({message: 'Hello World'})
})


// const db = SetupDB()
SetupRouter(app)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})