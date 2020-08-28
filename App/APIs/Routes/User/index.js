const express = require('express')
const router = express.Router()
const DbOps = require('./../../../../Utilities/Database')
const Constants = require('./../../../../Utilities/Constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Db } = require('mongodb')


// Fecth all users
router.get('/all', (req, res, next) => {
    DbOps.read(Constants.databases.testing, 'users', {}, { '_id': 0, 'password': 0 })
        .then(result => {
            res.status(Constants.StatusCodes.OK).json({
                'users': result['documents']
            })
        })
        .catch(error => {
            res.status(Constants.StatusCodes.badRequest).json(error)
        })
})

// Get user token using user credentials
router.post('/login', (req, res, next) => {
    const userDetails = req.body.userDetails
    if (userDetails) {
        if ('email' in userDetails && 'password' in userDetails) {
            DbOps.read(Constants.databases.testing, 'users', { 'email': userDetails['email'] })
                .then(result => {
                    if (result['documents'].length >= 1) {
                        let currentUser = result['documents'][0]
                        bcrypt.compare(userDetails['password'], currentUser['password'], (error, decrypted) => {
                            if (decrypted) {
                                delete currentUser['password']
                                let token = jwt.sign(currentUser, 'secret', { expiresIn: '1h' })
                                if (token) {
                                    res.status(Constants.StatusCodes.OK).json({
                                        'status': 'Authorized User',
                                        'jwt': token
                                    })
                                }
                                else {
                                    res.status(Constants.StatusCodes.unAuthorized).json({
                                        'status': 'failed',
                                        'message': 'Unauthorized User'
                                    })
                                }
                            }
                            else {
                                res.status(401).json({
                                    'status': 'failed',
                                    'message': 'Unauthorized User'
                                })
                            }
                        })
                    }
                    else {
                        let error = new Error('Unauthorized')
                        error.status = Constants.StatusCodes.unAuthorized
                        next(error)
                    }
                })
                .catch(error => {
                    res.status(Constants.StatusCodes.badRequest).json({
                        'error': error
                    })
                })
        }
        else {
            let error = new Error('Unauthorized')
            error.status = Constants.StatusCodes.unAuthorized
            next(error)
        }
    }
    else {
        let error = new Error('Unauthorized')
        error.status = Constants.StatusCodes.unAuthorized
        next(error)
    }
})

// Create a new user 
router.post('/new', (req, res, next) => {
    const userData = req.body.userDetails
    if (userData && 'email' in userData && 'password' in userData) {
        DbOps.read(Constants.databases.testing, 'users', { 'email': userData['email'] })
            .then(result => {
                if (result['documents'].length >= 1) {
                    res.status(Constants.StatusCodes.resourceConflict).json({
                        'status': 'failed',
                        'message': 'User exists'
                    })
                }
                else {
                    bcrypt.hash(userData['password'], 10, (error, hashedPassword) => {
                        if (error) {
                            res.status(Constants.StatusCodes.serverError).json({
                                'status': 'failed',
                                'message': error
                            })
                        }
                        else {
                            userData['password'] = hashedPassword
                            userData['userId'] = `user-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
                            DbOps.insertOne(Constants.databases.testing, 'users', userData)
                                .then(result => {
                                    res.status(Constants.StatusCodes.created).json({
                                        'status': 'success',
                                        'message': 'user created'
                                    })
                                })
                                .catch(error => {
                                    res.status(Constants.StatusCodes.serverError).json(error)
                                })
                        }
                    })
                }
            })
            .catch(error => {
                res.status(Constants.StatusCodes.serverError).json(error)
            })
    }
    else {
        res.status(Constants.StatusCodes.badRequest).json({
            'status': 'failed',
            'message': 'No userDetails found or incomplete data'
        })
    }
})



module.exports = router