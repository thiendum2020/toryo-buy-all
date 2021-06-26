import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import CartPlus from '../../../headers/icon/cart-plus.svg'
import Trash from '../../../headers/icon/trash.svg'
import Edit from '../../../headers/icon/edit.svg'
import { GlobalState } from '../../../../GlobalState'
import axios from 'axios'
import swal from 'sweetalert'



function ProductItem({ product, isAdmin, token }) {
    const state = useContext(GlobalState)
    const addCart = state.userAPI.addCart
    const [callback, setCallback] = state.productsAPI.callback

    const deleteProduct = async () => {
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
                        const deleteImage = async () => await axios.post('/api/destroy', { public_id: product.image.public_id }, {
                            headers: { Authorization: token }
                        })
                        const deleteProduct = async () => await axios.delete(`/api/products/${product._id}`, {
                            headers: { Authorization: token }
                        })
                        deleteImage()
                        deleteProduct()
                        setCallback(!callback)
                        swal("Removed!", {
                            icon: "success",
                        })


                    } else {
                        swal("HAHA NOPE!")
                    }
                })

        } catch (error) {
            swal("Error", `${error.response.data.msg}`, "error")
        }
    }

    return (
        <div className="product_card">

            <Link to={`/detail/${product._id}`} className="text-link">
                <img src={product.image.url} alt="" />
            </Link>

            <div className="product_box">
                <div className="row">
                    <Link to={`/detail/${product._id}`} className="text-link">
                        <h2 title={product.name}>{product.name}</h2>
                    </Link>
                    <p>{product.category}</p>
                </div>
                <div className="row">
                    <span>{product.dateOfBirth}</span>
                    <span>Sold: {product.sold}</span>
                </div>
            </div>
            <div className="row">
                <p>${product.price}</p>
                {
                    isAdmin
                        ?
                        <>
                            <Link id="btn-edit" to={`/update_product/${product._id}`}>
                                <img src={Edit} alt="" className="edit-icon" />
                            </Link>
                            <Link id="btn-trash" to='#' onClick={deleteProduct}>
                                <img src={Trash} alt="" className="trash-icon" />
                            </Link>
                        </>

                        :
                        <>
                            <Link id="btn-buy" className="btn" to='#' onClick={() => addCart(product)}>
                                <img src={CartPlus} alt="" className="cart-plus-icon" />

                            </Link>
                        </>
                }

            </div>
        </div >
    )
}

export default ProductItem
