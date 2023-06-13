const axios = require('axios');
const { apiurls } = require('../../config/config');
const getServiceUrl = require('../serviceUrlsHelper');
const { microservice } = require('../../config/messages');

/**
 * 
 * @param {Object} req 
 * @param {Array} uids 
*/
const createNotifications = async (req, notifications) => {

    try {
        const baseUrl = await getServiceUrl(req, 'users')
        if (!baseUrl) throw new Error(microservice.baseurl_not_found)

        const config = {
            method: apiurls.createNotifications.method,
            url: `${baseUrl}/${apiurls.createNotifications.url}`,
            headers: {
                'apikey': process.env.NODE_API_KEY,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ notifications })
        }

        return axios(config)

    }
    catch (error) {
        throw new Error(error.message)
    }
}

module.exports = createNotifications