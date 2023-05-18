/**
 * This middleware sends error messages to a Slack channel
 */

const env = require('var');
const {logError, logErrorAndRequestAsync} = require('../operations/common/logging');

/**
 * Middleware for logging errors to Slack
 * @param err
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @param {function(*) : void} next
 * @returns {Promise<void>}
 */
const errorReportingMiddleware = async (err, req, res, next) => {
    try {
        /**
         * status codes to ignore
         * @type {number[]}
         */
        const statusCodeToIgnore = env.SLACK_STATUS_CODES_TO_IGNORE ?
            env.SLACK_STATUS_CODES_TO_IGNORE.split(',').map(x => parseInt(x)) :
            [200, 401, 404];
        if (!statusCodeToIgnore.includes(err.statusCode)) {
            err.statusCode = err.statusCode || 500;
            await logErrorAndRequestAsync({
                error: err,
                req
            });
        }
    } catch (e) {
        logError('Error sending slack message', {'error': e});
    } finally {
        next(err);
    }
};

module.exports = {
    errorReportingMiddleware
};
