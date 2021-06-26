const Category = require('../models/categoryModel')

const categoryController = {

    //GET CATEGORY
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find()
            res.json(categories)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    //CREATE CATEGORY
    createCategory: async (req, res) => {
        try {
            //If user have role = 1 ====> ADMIN
            //Only Admin can create, update, delete
            const { name } = req.body
            const category = await Category.findOne({ name })
            if (category) {
                return res.status(400).json({ msg: "Category đã có!" })
            }
            const newCategory = new Category({ name })

            await newCategory.save()
            res.json('Đã tạo category mới thành công!')
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    //DELETE CATEGORY
    deleteCategory: async (req, res) => {
        try {
            //If user have role = 1 ====> ADMIN
            //Only Admin can create, update, delete
            await Category.findByIdAndDelete(req.params.id)
            res.json('Đã xóa category thành công!')
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    //UPDATE CATEGORY
    updateCategory: async (req, res) => {
        try {
            //If user have role = 1 ====> ADMIN
            //Only Admin can create, update, delete
            const { name } = req.body
            await Category.findOneAndUpdate({ _id: req.params.id }, { name })
            res.json({ msg: "Cập nhật Category thành công!" })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

}


module.exports = categoryController