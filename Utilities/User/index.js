const jwt = require('jsonwebtoken')
const DbOps = require('./../Database')
const databases = require('./../Constants').databases
module.exports = {
    getUserDataFromToken: function (authHeader, callback) {
        const userData = jwt.decode(authHeader.split(' ').pop())
        if (userData) {
            DbOps.read(databases.testing, 'users', {'email': userData['email']}, {'_id': 0, 'password': 0})
            .then(result => {
                if(result['documents'].length >= 1){
                    callback(result['documents'][0])
                }
                else{
                    callback(null)
                }
            })
            .catch(error => {
                callback(null)
            })
        }
        else {
            callback(null)
        }
    }
}