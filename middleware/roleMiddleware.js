const tokenService = require ('../service/token.service')
const Role = require('../models/Role')

module.exports = (rolesList) => {
    return async (req, res, next) => {
        if (req.method === 'OPTIONS') {
            next()
        }

        const roles = (await Promise.all(rolesList.map(async roleName => await Role.find({ value: roleName }))))[0].map(role => String(role._id))

        try {
            const token  = req.headers.authorization.split('=')[1]
            if (!token) {
                return res.status(401).json('Пользователь не авторизован')
            }
            const { roles: userRoles } = tokenService.accessTokenIsValid(token)
            let roleIsValid = userRoles.reduce((isValid, role) => roles.includes(role), false)

            if (!roleIsValid) {
                return res.status(403).json('Ошибка доступа')
            }
            next()
        } catch (e) {
            console.log(e)
            return res.status(401).json('Пользователь не авторизован')
        }
    }
}