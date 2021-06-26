import React, { useContext, useState } from 'react'
import { GlobalState } from '../../GlobalState'
import { Link } from 'react-router-dom'
import Menu from './icon/menu.svg'
import Close from './icon/close.svg'
import Cart from './icon/cart.svg'
import axios from 'axios'

const Header = () => {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin
    const [cart] = state.userAPI.cart
    const [username] = state.userAPI.username
    const [menu, setMenu] = useState(false)

    const logout = () => {
        axios.get('/user/logout')
        window.location.href = "/"
        localStorage.removeItem('firstLogins')
    }

    const adminRouter = () => {
        return (
            <>
                <li className="nav-item">
                    <Link to='/'>Product</Link>
                    <ul className="nav-sub">
                        <li><Link to='/create_product'>Create</Link></li>
                    </ul>
                </li>
                <li className="nav-item">
                    <Link to='/category'>Category</Link>

                </li>
            </>
        )
    }
    const userRouter = () => {
        return (
            <>
                <li className="nav-item"><Link to='/'>Shop</Link></li>
            </>
        )
    }
    const loggedRouter = () => {
        return (
            <>
                <li className="nav-item">
                    <Link to='/user_info'>{username}</Link>
                    <ul className="nav-sub">
                        <li><Link to='/history'>History</Link></li>
                        <li><Link to='/' onClick={logout}>Logout</Link></li>
                    </ul>
                </li>
            </>
        )
    }

    const styleMenu = {
        left: menu ? 0 : "-100%"
    }

    return (
        <header>
            <div className='menu' onClick={() => setMenu(!menu)}>
                <img src={Menu} alt="" width="30px" />
            </div>

            <div className='logo'>
                <h1>
                    <Link to='/'>{isAdmin ? 'ADMIN' : 'ToryoStore'}</Link>
                </h1>
            </div>

            <ul style={styleMenu}>
                {isAdmin ? adminRouter() : userRouter()}
                {
                    isLogged ? loggedRouter() : <li className="nav-item"> <Link to='/login'>Login ☸ Register</Link></li>
                }

                <li onClick={() => setMenu(!menu)}>
                    <img src={Close} alt="" width="30px" className="menu" />
                </li>
            </ul>

            {
                isAdmin ? '' :
                    <div className="cart-icon">
                        <span>{cart.length}</span>
                        <Link to='/cart'>
                            <img src={Cart} alt="" width="30px" />
                        </Link>
                    </div>
            }


        </header>
    )
}

export default Header
