const jwt = require('jsonwebtoken')
const StatusCodes = require('./.././../Constants').StatusCodes

module.exports = (req, res, next) => {
    if (req.headers.authorization) {
        try {
            let userToken = req.headers.authorization.split(' ').pop()
            let isVerified = jwt.verify(userToken, 'secret')
            if (isVerified) {
                next()
            }
            else {
                res.status(StatusCodes.unAuthorized).json({
                    'status': 'failed',
                    'message': 'Unauthorized User'
                })
            }
        } catch (error) {
            res.status(StatusCodes.unAuthorized).json({
                'status': 'failed',
                'message': 'Unauthorized User'
            })
        }
    }
    else {
        res.status(StatusCodes.unAuthorized).json({
            'status': 'failed',
            'message': 'Unauthorized User'
        })
    }
}