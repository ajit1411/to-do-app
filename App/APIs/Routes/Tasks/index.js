const express = require('express')
const router = express.Router()
const DbOps = require('./../../../../Utilities/Database')
const StatusCode = require('./../../../../Utilities/Constants').StatusCodes
const UserVerification = require('./../../../../Utilities/Middleware/UserVerification')
const Constants = require('../../../../Utilities/Constants')
const { getUserDataFromToken } = require('../../../../Utilities/User')
const { Db } = require('mongodb')
// Get user tasks with buckets
router.get('/my-tasks', UserVerification, (req, res, next) => {
    getUserDataFromToken(req.headers.authorization, (userData) => {
        if (userData) {
            Promise.all([DbOps.read(Constants.databases.testing, 'tasks', { 'user.userId': userData['userId'] }), DbOps.read(Constants.databases.testing, 'buckets', { 'user.userId': userData['userId'] })])
                .then(result => {
                    let responseBody = {
                        'myTaks': result[0]['documents'],
                        'myBuckets': result[1]['documents']
                    }
                    res.status(200).json(responseBody)
                })
                .catch(error => {
                    res.status(501).json({
                        'error': error
                    })
                })
        }
        else {
            res.status(Constants.StatusCodes.unAuthorized).json({
                'status': Constants.ResponseMessage.failed,
                'message': Constants.ResponseMessage.unAuthorized
            })
        }
    })
})

// Create new task
router.post('/new', UserVerification, (req, res, next) => {
    getUserDataFromToken(req.headers.authorization, (userData) => {
        if (userData) {
            const taskDetails = req.body.taskDetails
            if (taskDetails) {
                taskDetails['user'] = userData
                taskDetails['taskId'] = `task-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
                taskDetails['createdOn'] = new Date().toISOString()
                DbOps.insertOne(Constants.databases.testing, 'tasks', taskDetails)
                    .then(result => {
                        res.status(Constants.StatusCodes.created).json({
                            'status': 'success',
                            'message': 'task created'
                        })
                    })
                    .catch(error => {
                        res.status(Constants.StatusCodes.serverError).json({
                            'status': 'failed',
                            'message': error
                        })
                    })
            }
            else {
                res.status(Constants.StatusCodes.badRequest).json({
                    'status': 'failed',
                    'message': 'No taskDetails found'
                })
            }
        }
        else {
            res.status(Constants.StatusCodes.unAuthorized).json({
                'status': 'failed',
                'message': 'Unauthorized'
            })
        }
    })
})

// Update the task
router.post('/:taskId', UserVerification, (req, res, next) => {
    getUserDataFromToken(req.headers.authorization, (userData) => {
        if (userData) {
            let taskId = req.params.taskId
            let taskData = req.body.taskData
            if (taskId && taskData) {
                DbOps.updateOne(Constants.databases.testing, 'tasks', { 'taskId': taskId, 'user.userId': userData['userId'] }, taskData)
                    .then(result => {
                        res.status(Constants.StatusCodes.OK).json({
                            'status': Constants.ResponseMessage.success,
                            'message': 'Task updated'
                        })
                    })
                    .catch(error => {
                        res.status(Constants.StatusCodes.badRequest).json({
                            'status': Constants.ResponseMessage.failed,
                            'message': error
                        })
                    })
            }
            else {
                res.status(Constants.StatusCodes.badRequest).json({
                    'status': Constants.ResponseMessage.failed,
                    'message': 'No taskId or taskData found'
                })
            }
        }
        else {
            res.status(Constants.StatusCodes.unAuthorized).json({
                'status': Constants.ResponseMessage.failed,
                'message': Constants.ResponseMessage.unAuthorized
            })
        }
    })
})

// Delete the task
router.delete('/:taskId', UserVerification, (req, res, next) => {
    getUserDataFromToken(req.headers.authorization, (userData) => {
        if (userData) {
            let taskId = req.params.taskId
            if (taskId) {
                DbOps.deleteOne(Constants.databases.testing, 'tasks', { 'taskId': taskId, 'user.userId': userData['userId'] })
                    .then(result => {
                        res.status(Constants.StatusCodes.OK).json({
                            'status': Constants.ResponseMessage.success
                        })
                    })
                    .catch(error => {
                        res.status(Constants.StatusCodes.badRequest).json({
                            'status': Constants.ResponseMessage.failed,
                            'message': error
                        })
                    })
            }
            else {
                res.status(Constants.StatusCodes.badRequest).json({
                    'status': Constants.ResponseMessage.failed,
                    'message': 'No taskId found'
                })
            }
        }
        else {
            res.status(Constants.StatusCodes.unAuthorized).json({
                'status': Constants.ResponseMessage.failed,
                'message': Constants.ResponseMessage.unAuthorized
            })
        }
    })
})



module.exports = router