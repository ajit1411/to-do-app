const http = require('http')
const application = require('./../App')
const applicationPort = process.env.APP_PORT || 3000
const applicationServer = http.createServer(application)
applicationServer.listen(applicationPort)