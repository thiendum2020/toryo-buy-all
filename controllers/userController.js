const Users = require('../models/userModel')
const Payments = require('../models/paymentModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userController = {

    //REGISTER
    register: async (req, res) => {
        try {
            const { username, password, name, email, phone } = req.body

            const userName = await Users.findOne({ username })
            const emailUser = await Users.findOne({ email })
            if (userName) {
                return res.status(400).json({ msg: "Username đã tồn tại!" })
            }
            if (emailUser) {
                return res.status(400).json({ msg: "Email đã tồn tại!" })
            }
            if (password.length < 6) {
                return res.status(400).json({ msg: "Password quá ngắn! Phải nhập từ 6 kí tự trở lên!" })
            }

            //Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                username,
                password: passwordHash,
                name,
                email,
                phone
            })

            //Save MongoDB
            await newUser.save()

            //Create JsonWebToken to Authentication
            const accessToken = createAccessToken({ id: newUser._id })
            const refreshToken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            res.json({ accessToken })
            // res.json(newUser)
            // res.json({ msg: "Đăng ký thành công!" })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    //LOGIN
    login: async (req, res) => {
        try {
            const { username, password } = req.body

            const user = await Users.findOne({ username })

            if (!user) {
                return res.status(400).json({ msg: "Username không tồn tại!" })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ msg: "Sai password! Hãy nhập lại!" })
            }

            //If login success, create access token and refresh token
            const accessToken = createAccessToken({ id: user._id })
            const refreshToken = createRefreshToken({ id: user._id })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.json({ accessToken })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    // LOGOUT
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshToken', { path: '/user/refresh_token' })
            return res.json({ msg: "Đã đăng xuất!" })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    //REFRESH TOKEN
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshToken
            if (!rf_token) {
                return res.status(400).json({ msg: "Hãy đăng nhập hoặc đăng ký tài khoản!" })
            }
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.status(400).json({ msg: "Hãy đăng nhập hoặc đăng ký tài khoản!" })
                }
                const accessToken = createAccessToken({ id: user.id })

                res.json({ accessToken })

            })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }

    },

    //GET USER
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if (!user) return res.status(400).json({ msg: "User không tồn tại!" })

            res.json(user)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    //ADD TO CART
    addCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)
            if (!user) {
                return res.status(400).json({ msg: "Username không tồn tại!" })
            }

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                cart: req.body.cart
            })

            return res.json({ msg: "Đã thêm vào giỏ hàng!" })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    //ORDER HISTORY
    history: async (req, res) => {
        try {
            const history = await Payments.find({ user_id: req.user.id })

            res.json(history)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' })
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userController