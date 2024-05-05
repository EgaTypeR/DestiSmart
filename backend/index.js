require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
const morgan = require('morgan')

const SetupDB = require('./src/models/setupDB')
const AppError = require('./src/utils/appError')
const globalErrorHandler = require('./src/controllers/errController')

// Import Routers
const UserRouter = require('./src/routers/userRouter')
const ChattingRouter = require('./src/routers/chattingRoute')
const AuthRouter = require('./src/routers/authRoute')

const app = express()
SetupDB()
app.use(cors())
app.use(helmet())
app.use(express.json({
  limit: '15kb'
}))

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp());

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, Please try again in an hour!'
})
app.use('/api', limiter)

app.get('/', (req, res) => {
  return res.status(200).json({message: 'Hii, DestiSmart Here!'})
})

// Routes
app.use('/api/v1/user', UserRouter)
app.use('/api/v1/chat', ChattingRouter)
app.use('/api/v1/auth', AuthRouter)

// app.use('*', (req, res, next) => {
//   const err = new AppError(404, 'fail', 'undefined route');
//   next(err, req, res, next);
// });

app.use(globalErrorHandler)
app.use(morgan('dev'))

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})