const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const StatusCodes = require('./../Utilities/Constants').StatusCodes

app.use(bodyParser.urlencoded({ urlencoded: false }))
app.use(bodyParser.json({}))

// Add routes to the apis
const Tasks = require('./APIs/Routes/Tasks')
const Users = require('./APIs/Routes/User')
const Buckets = require('./APIs/Routes/Buckets')

app.use((req, res, next) => {
    req.header('Access-Control-Allow-Origin', '*')
    req.header('Access-Control-Allow-Header', '*')
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
        res.status(StatusCodes.OK).json({})
    }
    next()
})

// Route all the requests for `/task` to the Tasks
app.use('/task', Tasks)
// Route all the requests for `/user` to the Users
app.use('/user', Users)
// Route all the requests for `/bucket` to Buckets
app.use('/bucket', Buckets)

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = StatusCodes.notFound
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || StatusCodes.serverError).json({
        'error': error.message || 'Something went wrong!'
    })
})

module.exports = app