const express = require('express')
const router = express.Router()
const DbOps = require('./../../../../Utilities/Database')
const StatusCode = require('./../../../../Utilities/Constants').StatusCodes
const UserVerification = require('./../../../../Utilities/Middleware/UserVerification')
const Constants = require('../../../../Utilities/Constants')
const { getUserDataFromToken } = require('../../../../Utilities/User')
const { Db } = require('mongodb')


// Fetch my buckets
router.get('/my-buckets', UserVerification, (req, res, next) => {
    getUserDataFromToken(req.headers.authorization, (userData) => {
        if (userData) {
            DbOps.read(Constants.databases.testing, 'buckets')
                .then(result => {
                    res.status(Constants.StatusCodes.OK).json({
                        'status': Constants.ResponseMessage.success,
                        'my-buckets': result['documents']
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
            res.status(Constants.StatusCodes.unAuthorized).json({
                'status': Constants.ResponseMessage.failed,
                'message': Constants.ResponseMessage.unAuthorized
            })
        }
    })
})

// Get all the tasks for the selected bucket
router.get('/:bucketId', UserVerification, (req, res, next) => {
    getUserDataFromToken(req.headers.authorization, (userData) => {
        if (userData) {
            const bucketId = req.params.bucketId
            if (bucketId) {
                DbOps.read(Constants.databases.testing, 'tasks', { 'parent.bucketId': bucketId, 'user.userId': userData['userId'] })
                    .then(result => {
                        res.status(Constants.StatusCodes.OK).json({
                            'status': 'success',
                            'myTasks': result['documents']
                        })
                    })
            }
            else {
                res.status(Constants.StatusCodes.badRequest).json({
                    'status': Constants.ResponseMessage.failed,
                    'error': Constants.ResponseMessage.failedToProceed
                })
            }
        }
        else{
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
            const bucketDetails = req.body.bucketDetails
            if (bucketDetails) {
                const bucketId = `bucket-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
                bucketDetails['user'] = userData
                bucketDetails['bucketId'] = bucketId
                bucketDetails['createdOn'] = new Date().toISOString()
                DbOps.insertOne(Constants.databases.testing, 'buckets', bucketDetails)
                    .then(result => {
                        res.status(Constants.StatusCodes.created).json({
                            'status': 'success',
                            'message': 'bucket created',
                            'bucketData': bucketDetails
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

// Delete the bucket
router.delete('/:bucketId', UserVerification, (req, res, next) => {
    getUserDataFromToken(req.headers.authorization, (userData) => {
        if (userData) {
            let bucketId = req.params.bucketId
            if (bucketId) {
                DbOps.deleteOne(Constants.databases.testing, 'buckets', { 'bucketId': bucketId, 'user.userId': userData['userId'] })
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
                    'message': 'No bucketId found'
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