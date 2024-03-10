const userRouter = require('./userRouter');

function SetupRouter(app) {
  app.use('/api/v1/user', userRouter)

  
}

module.exports = SetupRouter;