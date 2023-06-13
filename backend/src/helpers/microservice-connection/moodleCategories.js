const axios = require('axios');
const { apiurls } = require('../../config/config');
const getServiceUrl = require('../serviceUrlsHelper');
const { microservice } = require('../../config/messages');

/**
 * 
 * @param {Object} req 
 * @param {Array} uids 
*/
const moodleCategories = async (req) => {
    try {
        const baseUrl = await getServiceUrl(req, 'moodle')
        if (!baseUrl) throw new Error(microservice.baseurl_not_found)

        const config = {
            method: apiurls.getCategories.method,
            url: `${baseUrl}/${apiurls.getCategories.url}`,
            headers: {
                'accesstoken': req.headers.accesstoken,
                'Content-Type': 'application/json'
            }            
        }

        return await axios(config)

    } catch (error) {
        console.log(error.message)
        return []
    }
}

module.exports = moodleCategories