const Role = require('./models/Role')
const User = require('./models/User')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const tokenService = require('./service/token.service')

class AuthController {
    async registration (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Ошибка при регистрации', errors })
            }
            const {username, password} = req.body
            const candidate = await User.findOne({ username })
            console.log(candidate)
            if (candidate) {
                return res.status(400).json({ message: 'Пользователь с таким именем существует' })
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({ value: 'USER' })
            const user = new User({ username, password: hashPassword, roles: [userRole._id] })
            await user.save()
            return res.json({ message: 'Пользователь успешно зарегистрирован' })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Registration error' })
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })
            if (!user) {
                return res.status(400).json({ message: 'Неверное имя пользователя' })
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({ message: 'Неверный пароль' })
            }
            const token = tokenService.generate(user._id, user.roles)
            return res.json({ token })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Login error' })
        }
    }

    async getUsers (req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Get users error' })
        }
    }
}

module.exports = new AuthController()
