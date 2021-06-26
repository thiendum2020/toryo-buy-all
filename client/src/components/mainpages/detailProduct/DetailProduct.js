import React, { useContext, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'

const DetailProduct = () => {
    const params = useParams()
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const addCart = state.userAPI.addCart
    const [detailProduct, setDetailProduct] = useState([])

    useEffect(() => {
        if (params.id) {
            products.forEach(product => {
                if (product._id === params.id) {
                    setDetailProduct(product)
                }
            })
        }
    }, [params.id, products])

    // console.log(detailProduct)

    if (detailProduct.length === 0) return null

    return (
        <>
            <div className="detail-product">
                <img src={detailProduct.image.url} alt="" />
                <div className="box-detail">
                    <div className="row">
                        <h1>{detailProduct.name}</h1>
                        <Link to='/category' className="text-link">
                            <h5>{detailProduct.category}</h5>
                        </Link>
                    </div>
                    <div className="row">
                        <h3>Details<i class="fa fa-indent"></i></h3>
                        <span>Sold: {detailProduct.sold}</span>
                    </div>
                    <p>{detailProduct.description}</p>
                    <h4>Date of birth:</h4><span> {detailProduct.dateOfBirth}</span> <br /><br />
                    <h4>Movie:</h4><p> {detailProduct.movie}</p>
                    <h2>$ {detailProduct.price}</h2>
                    <Link to='/cart' className="btn cart" onClick={() => addCart(detailProduct)}>
                        Buy Now
                    </Link>
                </div>
            </div>

            <div>
                <h2>Related Products</h2>
                <div className="products">
                    {
                        products.map(product => {
                            return product.category === detailProduct.category
                                ? <ProductItem key={product._id} product={product} /> : null
                        })
                    }

                </div>
            </div>
        </>
    )
}

export default DetailProduct
