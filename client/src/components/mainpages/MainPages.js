import React, { useContext } from 'react'
import { Switch, Route } from 'react-router-dom'
import Products from './products/Products'
import DetailProduct from './detailProduct/DetailProduct'
import Login from './auth/Login'
import Register from './auth/Register'
import Cart from './cart/Cart'
import OrderHistory from './history/OrderHistory'
import OrderDetails from './history/OrderDetails'
import Categories from './categories/Categories'
import CreateProduct from './createProduct/CreateProduct'
import NotFound from './utils/NotFound/NotFound'
import { GlobalState } from '../../GlobalState'

function MainPages() {

    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin

    return (
        <Switch>
            <Route path='/' exact component={Products} />
            <Route path='/detail/:id' exact component={DetailProduct} />
            <Route path='/login' exact component={isLogged ? NotFound : Login} />
            <Route path='/register' exact component={isLogged ? NotFound : Register} />
            <Route path='/cart' exact component={Cart} />
            <Route path='/create_product' exact component={isAdmin ? CreateProduct : NotFound} />
            <Route path='/update_product/:id' exact component={isAdmin ? CreateProduct : NotFound} />
            <Route path='/history' exact component={isLogged ? OrderHistory : NotFound} />
            <Route path='/history/:id' exact component={isLogged ? OrderDetails : NotFound} />
            <Route path='/category' exact component={isAdmin ? Categories : NotFound} />




            <Route path='*' exact component={NotFound} />
        </Switch>
    )
}

export default MainPages
