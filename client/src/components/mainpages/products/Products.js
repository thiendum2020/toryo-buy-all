import React, { useContext } from 'react'
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'
import Loading from '../utils/loading/Loading.js'
import Filters from './Filters'

const Products = () => {
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token

    return (
        <>
            <div className="products">
                {
                    products.map(product => {
                        return <ProductItem key={product._id} product={product} isAdmin={isAdmin} token={token} />

                    })
                }
            </div>
            {products.length === 0 && <Loading />}
        </>
    )
}

export default Products
