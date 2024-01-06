const jwt = require('jsonwebtoken')
const { secret } = require('../config')

class TokenService {
    generate (id, roles) {
        const payload = { id, roles }
        return jwt.sign(payload, secret, { expiresIn: '1h' })
    }
    accessTokenIsValid (token) {
        try {
            return jwt.verify(token, secret)
        } catch (e) {
            return null
        }
    }
}

module.exports = new TokenService()
