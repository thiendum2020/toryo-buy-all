const Users = require('../models/userModel')

const authAdmin = async (req, res, next) => {
    try {
        //Get user information by ID
        const user = await Users.findOne({
            _id: req.user.id
        })
        if (user.role === 0) {
            return res.status(400).json({ msg: "Không có quyền ADMIN!" })
        }
        next()
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

module.exports = authAdmin