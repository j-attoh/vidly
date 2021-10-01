const app = require('./server')
const logger  = require('./startup/logging')

const port = process.env.PORT || 3000 

app.listen(port , () => {
	logger.info(`connected to port : ${port}`)
})

