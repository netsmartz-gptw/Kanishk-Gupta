const axios = require('axios')
const { SERVER_ERROR } = require('../config/messages')

const requestToken = async () => {
  try {
    const res = await axios.post('http://localhost:3000/users/signIn', {
      username: process.env.JEST_COGNITO_LOGIN_USERNAME,
      password: process.env.JEST_COGNITO_LOGIN_PASSWORD
    })

    return res?.data?.response?.token?.accessToken;
  }
  catch (err) {
    throw new Error(SERVER_ERROR)
  }
}
module.exports = requestToken