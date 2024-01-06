const tokenService = require ('../service/token.service')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const token  = req.headers.authorization.split('=')[1]
        if (!token) {
            return res.status(401).json('Пользователь не авторизован')
        }
        const isValid = tokenService.accessTokenIsValid(token)
        if (!isValid) {
            return res.status(401).json('Пользователь не авторизован')
        }
        next()
    } catch (e) {
        console.log(e)
        return res.status(401).json('Пользователь не авторизован')
    }
}