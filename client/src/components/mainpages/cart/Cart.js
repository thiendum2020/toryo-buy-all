import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import PaypalButton from './PaypalButton'
import swal from 'sweetalert'

function Cart() {
    const state = useContext(GlobalState)
    const [cart, setCart] = state.userAPI.cart
    const [token] = state.token
    const [total, setTotal] = useState(0)

    useEffect(() => {
        const getTotal = () => {
            const total = cart.reduce((prev, item) => {
                return prev + (item.price * item.quantity)
            }, 0)
            setTotal(total)
        }

        getTotal()
    }, [cart])

    const addToCart = async (cart) => {
        await axios.patch('/user/addcart', { cart }, {
            headers: { Authorization: token }
        })
    }

    const increment = (id) => {
        cart.forEach(item => {
            if (item._id === id) {
                item.quantity += 1
            }
        })
        setCart([...cart])
        addToCart(cart)
    }

    const decrement = (id) => {
        cart.forEach(item => {
            if (item._id === id) {
                item.quantity === 1 ? item.quantity = 1 : item.quantity -= 1
            }
        })
        setCart([...cart])
        addToCart(cart)
    }

    const removeProduct = id => {
        swal({
            title: "Are you sure?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    swal("Removed!", {
                        icon: "success",
                    })
                    cart.forEach((item, index) => {
                        if (item._id === id) {
                            cart.splice(index, 1)
                        }
                    })
                    setCart([...cart])
                    addToCart(cart)
                } else {
                    swal("HAHA NOPE!");
                }
            })

    }


    const tranSuccess = async (payment) => {
        const { paymentID, address } = payment

        await axios.post('/api/payment', { cart, paymentID, address }, {
            headers: { Authorization: token }
        })

        setCart([])
        addToCart([])
        swal("Đã thanh toán thành công", "Đơn hàng đang được vận chuyển cho bạn!", "success")
    }

    if (cart.length === 0) {
        return <h2 style={{ textAlign: "center", fontSize: "2rem" }}>Cart Empty</h2>
    }

    return (
        <div>
            <div className="cart-container">
                <table>
                    <tbody>
                        <tr>
                            <th>Product</th>
                            <th style={{ textAlign: "center" }}>Quantity</th>
                            <th style={{ textAlign: "right" }}>Subtotal</th>
                        </tr>
                        {
                            cart.map(product => (
                                <tr className="cart-item" key={product._id}>
                                    <td>
                                        <div className="cart-info">
                                            <Link to={`/detail/${product._id}`}>
                                                <img src={product.image.url} alt="" />
                                            </Link>
                                            <div>
                                                <p>{product.name}</p>
                                                <small>{product.dateOfBirth}</small>
                                                <br />
                                                <small>{product.category}</small>
                                                <br />
                                                <small>Price: ${product.price}</small>
                                                <br />
                                                <small onClick={() => removeProduct(product._id)} class="remove">Remove</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <div className="amount">
                                            <button onClick={() => decrement(product._id)}> - </button>
                                            <span>{product.quantity}</span>
                                            <button onClick={() => increment(product._id)}> + </button>
                                        </div>
                                    </td>
                                    <td>$ {product.price * product.quantity}</td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
                <div className="total-price">
                    {/* <div className="shipping">
                        <h3>Shipping</h3>
                        <p>Name: {name}</p>
                        <p>Phone: {phone}</p>
                        <input type="text" name="address" required placeholder="Address"
                            value={addressUser.address} onChange={onChangeInput} />
                    </div> */}
                    <table>
                        <tbody>
                            <tr>
                                <td>Sub total</td>
                                <td>$ {total}</td>
                            </tr>
                            <tr>
                                <td>Tax</td>
                                <td>0</td>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td className="total">$ {total}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <div className="payment">
                                    <PaypalButton
                                        total={total}
                                        tranSuccess={tranSuccess}
                                    />
                                </div>
                            </tr>

                        </tbody>

                    </table>

                </div>
            </div>

        </div>
    )
}

export default Cart


