import React, { useContext, useState } from 'react'
import { GlobalState } from '../../../GlobalState'
import swal from 'sweetalert'
import axios from 'axios'


const Categories = () => {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [categories, setCategories] = state.categoriesAPI.categories
    const [category, setCategory] = useState('')
    // const [callback, setCallback] = state.categoriesAPI.callback
    const [onEdit, setOnEdit] = useState(false)
    const [id, setID] = useState('')

    const createCategory = async e => {
        e.preventDefault()
        try {
            if (onEdit) {
                const res = await axios.put(`/api/category/${id}`, { name: category }, {
                    headers: { Authorization: token }
                })
                swal("Success", "Cập nhật Category thành công!", "success")
            } else {
                const res = await axios.post('/api/category', { name: category }, {
                    headers: { Authorization: token }
                })
                swal("Success", "Đã tạo Category mới thành công!", "success")

            }
            setOnEdit(false)
            setCategory('')
            setCategories([...categories])

        } catch (error) {
            swal("Error", `${error.response.data.msg}`, "error")
        }
    }

    const editCategory = async (id, name) => {
        setID(id)
        setCategory(name)
        setOnEdit(true)
        setCategories([...categories])
    }

    const deleteCategory = async id => {
        try {

            swal({
                title: "Are you sure?",
                text: "",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        const del = async () =>
                            await axios.delete(`/api/category/${id}`, {
                                headers: { Authorization: token }
                            })
                        del()

                        swal("Removed!", {
                            icon: "success",
                        })
                        setCategories([...categories])
                    } else {
                        swal("HAHA NOPE!")
                    }
                })

        } catch (error) {
            swal("Error", `${error.response.data.msg}`, "error")
        }
    }

    return (
        <>
            <div className="categories">
                <form onSubmit={createCategory}>
                    <label htmlFor="category">Category</label>
                    <input type="text" name="category" value={category} required
                        onChange={e => setCategory(e.target.value)} />
                    <button type="submit"><i className="btn-save fa fa-save"></i></button>
                </form>
            </div>
            <div className="categories-list">
                {
                    categories.map(category => (
                        <div className="categories-item" key={category._id}>
                            <p>{category.name}</p>
                            <div className="btn-action">
                                <i className="btn-edit fa fa-edit" onClick={() => editCategory(category._id, category.name)}></i>
                                <i className="btn-delete fa fa-times-circle" onClick={() => deleteCategory(category._id)}></i>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default Categories
