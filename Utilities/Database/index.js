const mongo = require('mongodb').MongoClient
const DB_HOST = 'mongodb://localhost:27017'
module.exports = {
    read: function (databaseName, collectionName, query = {}, projections = { '_id': 0 }) {
        return new Promise((resolve, reject) => {
            if (databaseName && collectionName) {
                mongo.connect(DB_HOST, (error, dbClient) => {
                    if (error) {
                        dbClient.close()
                        reject(error)
                    }
                    else {
                        let fetchedDocs = []
                        const database = dbClient.db(databaseName)
                        let dbCursor = database.collection(collectionName).find(query).project(projections)
                        dbCursor.forEach(document => {
                            fetchedDocs.push(document)
                        }, () => {
                            dbClient.close()
                            resolve({
                                'documents': fetchedDocs
                            })
                        })
                    }
                })
            }
            else {
                reject({
                    'message': 'No databaseName or collectionName found!'
                })
            }
        })
    },
    insertOne: function (databaseName, collectionName, documentToInsert) {
        return new Promise((resolve, reject) => {
            if (databaseName && collectionName) {
                mongo.connect(DB_HOST, (error, dbClient) => {
                    if (error) {
                        dbClient.close()
                        reject(error)
                    }
                    else {
                        const database = dbClient.db(databaseName)
                        database.collection(collectionName).insertOne(documentToInsert, (error, result) => {
                            if (error) {
                                reject(error)
                            }
                            else {
                                resolve({
                                    'status': 'inserted'
                                })
                            }
                        })
                    }
                })
            }
            else {
                reject({
                    'message': 'No databaseName or collectionName found!'
                })
            }
        })
    },
    updateOne: function (databaseName, collectionName, filter, dataToUpdate) {
        return new Promise((resolve, reject) => {
            if (databaseName && collectionName) {
                mongo.connect(DB_HOST, (error, dbClient) => {
                    if (error) {
                        dbClient.close()
                        reject(error)
                    }
                    else {
                        const database = dbClient.db(databaseName)
                        database.collection(collectionName).updateOne(filter, { '$set': dataToUpdate }, (error, result) => {
                            if (error) {
                                dbClient.close()
                                reject(error)
                            }
                            else {
                                dbClient.close()
                                resolve(result)
                            }
                        })
                    }
                })
            }
            else {
                reject({
                    'message': 'No databaseName or collectionName found!'
                })
            }
        })
    },
    deleteOne: function (databaseName, collectionName, filter) {
        return new Promise((resolve, reject) => {
            if (filter) {
                mongo.connect(DB_HOST, (error, dbClient) => {
                    if (error) {
                        reject(error)
                    }
                    else {
                        const database = dbClient.db(databaseName)
                        database.collection(collectionName).deleteOne(filter, (error, result) => {
                            if (error) {
                                dbClient.close()
                                reject(error)
                            }
                            else {
                                dbClient.close()
                                resolve({
                                    'message': 'record deleted'
                                })
                            }
                        })
                    }
                })
            }
            else {
                reject({
                    error: new Error('No filter found to delete document')
                })
            }
        })
    }
}