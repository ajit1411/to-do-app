module.exports = {
    StatusCodes: {
        OK: 200,
        created: 201,
        badRequest: 400,
        unAuthorized: 401,
        notFound: 404,
        methodNotAllowed: 405,
        resourceConflict: 409,
        serverError: 501,
        noData: 500
    },
    ResponseMessage: {
        unAuthorized: 'Unauthorized',
        failed: 'Failed',
        failedToProceed: 'Failed to process your request!',
        success: 'Success'
    },
    databases: {
        testing: 'todoapp'
    }
}