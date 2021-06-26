const Payments = require('../models/paymentModel')
const Users = require('../models/userModel')
const Products = require('../models/productModel')

const paymentController = {

    //GET PAYMENT
    getPayments: async (req, res) => {
        try {
            const payments = await Payments.find()
            res.json(payments)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    //CREATE PAYMENT
    createPayments: async (req, res) => {
        try {

            const user = await Users.findById(req.user.id).select('name email phone')
            if (!user) {
                return res.status(400).json({ msg: "Username không tồn tại!" })
            }
            const { cart, paymentID, address } = req.body
            const { _id, name, email, phone } = user
            const newPayment = new Payments({
                user_id: _id,
                name,
                email,
                phone,
                address,
                cart,
                paymentID
            })

            cart.filter(item => {
                return sold(item._id, item.quantity, item.sold)
            })

            await newPayment.save()
            res.json({ msg: "Thanh toán thành công!" })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
}

const sold = async (id, quantity, oldSold) => {
    await Products.findOneAndUpdate({ _id: id }, {
        sold: quantity + oldSold
    })
}


module.exports = paymentController