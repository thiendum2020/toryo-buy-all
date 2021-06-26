import React, { useContext, useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import Loading from '../utils/loading/Loading.js'
import swal from 'sweetalert'

const initialState = {
    name: '',
    price: 0,
    dateOfBirth: '',
    description: '',
    movie: '',
    category: '',
    _id: ''
}

function CreateProduct() {

    const state = useContext(GlobalState)
    const [product, setProduct] = useState(initialState)
    const [products] = state.productsAPI.products
    const [token] = state.token
    const [loading, setLoading] = useState(false)
    const [categories] = state.categoriesAPI.categories
    const [isAdmin] = state.userAPI.isAdmin
    const [image, setImage] = useState(false)
    const history = useHistory()
    const params = useParams()
    const [onUpdate, setOnUpdate] = useState(false)
    const [callback, setCallback] = state.productsAPI.callback

    const uploadHandler = async e => {
        e.preventDefault()
        try {
            if (!isAdmin) {
                return swal("Error", "Bạn không có quyền ADMIN!", "error")
            }

            const file = e.target.files[0]

            console.log(file);
            if (!file) {
                return swal("Error", "File not exist!", "error")
            }
            if (file.size > 1024 * 1024 * 5) {
                return swal("Error", "File too large!", "error")
            }
            if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
                return swal("Error", "File format is incorrect!", "error")
            }

            let formData = new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload', formData, {
                headers: { 'content-type': 'multipart/form-data', Authorization: token }
            })
            setLoading(false)
            console.log(res);
            setImage(res.data)
        } catch (error) {
            swal("Error", `${error.msg}`, "error")
        }
    }

    const deleteImageHandler = async () => {
        try {
            if (!isAdmin) {
                return swal("Error", "Bạn không có quyền ADMIN!", "error")
            }
            setLoading(true)
            await axios.post('/api/destroy', { public_id: image.public_id }, {
                headers: { Authorization: token }
            })
            setLoading(false)
            setImage(false)
        } catch (error) {
            swal("Error", `${error.msg}`, "error")
        }
    }

    const handlerChangeInput = e => {
        const { name, value } = e.target
        setProduct({ ...product, [name]: value })
    }

    const styleUpload = {
        display: image ? "block" : "none"
    }

    const submitHandler = async e => {
        e.preventDefault()
        try {
            if (!isAdmin) {
                return swal("Error", "Bạn không có quyền ADMIN!", "error")
            }
            if (!image) {
                return swal("Error", "Chưa thêm hình cho sản phẩm!", "error")
            }
            if (onUpdate) {
                await axios.put(`/api/products/${product._id}`, { ...product, image }, {
                    headers: { Authorization: token }
                })
            } else {
                await axios.post('/api/products', { ...product, image }, {
                    headers: { Authorization: token }
                })
            }

            setCallback(!callback)
            setImage(false)
            setProduct(initialState)
            history.push('/')

        } catch (error) {
            swal("Error", `${error.response.data.msg}`, "error")
        }
    }
    useEffect(() => {
        if (params.id) {
            setOnUpdate(true)
            products.forEach(product => {
                if (product._id === params.id) {
                    setProduct(product)
                    setImage(product.image)
                }
            });
        } else {
            setOnUpdate(false)
            setProduct(initialState)
            setImage(false)
        }

    }, [params.id, products])

    return (
        <div className="create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={uploadHandler} />
                {
                    loading
                        ? <div className="file_img"><Loading /></div>
                        : <div className="file_img" style={styleUpload}>
                            <img src={image ? image.url : ''} alt="" />
                            <span onClick={deleteImageHandler}>X</span>
                        </div>
                }
            </div>

            <form onSubmit={submitHandler}>
                <div className="row-categories">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" required
                        value={product.name} onChange={handlerChangeInput} />
                </div>
                <div className="row-categories">
                    <label htmlFor="price">Price</label>
                    <input type="number" name="price" id="price" required
                        value={product.price} onChange={handlerChangeInput} />
                </div>
                <div className="row-categories">
                    <label htmlFor="dateOfBirth">Day of birth</label>
                    <input type="text" name="dateOfBirth" id="dateOfBirth" required
                        value={product.dateOfBirth} onChange={handlerChangeInput} />
                </div>
                <div className="row-categories">
                    <label htmlFor="description">Description</label>
                    <textarea type="text" name="description" id="description" required
                        value={product.description} rows="5" onChange={handlerChangeInput} />
                </div>
                <div className="row-categories">
                    <label htmlFor="movie">Movie</label>
                    <textarea type="text" name="movie" id="movie" required
                        value={product.movie} rows="5" onChange={handlerChangeInput} />
                </div>
                <div className="row">
                    <div className="select">
                        <select name="category" value={product.category} onChange={handlerChangeInput}>
                            <option value="hide">-- Chọn quốc gia --</option>
                            {
                                categories.map(category => (
                                    <option value={category.name} key={category._id}>
                                        {category.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <button type="submit">{onUpdate ? "UPDATE" : "CREATE"}</button>
                </div>

            </form>
        </div>
    )
}

export default CreateProduct
