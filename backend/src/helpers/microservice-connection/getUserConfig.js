const axios = require('axios');
const { apiurls } = require('../../config/config');
const getServiceUrl = require('../serviceUrlsHelper');
const { microservice } = require('../../config/messages');

/**
 * 
 * @param {Object} req 
 * @param {Array} uids 
*/
const getUserConfig = async (req) => {
    try {
        const baseUrl = await getServiceUrl(req, 'users')
    if (!baseUrl) throw new Error(microservice.baseurl_not_found)

        const config = {
            method: apiurls.userConfig.method,
            url: `${baseUrl}/${apiurls.userConfig.url}`,
            headers: {
                'accesstoken': req.headers.accesstoken,
                'Content-Type': 'application/json'
            }
        }
    
        return axios(config)

    } catch (error) {
    throw new Error(error.message)
    }
}

module.exports = getUserConfig