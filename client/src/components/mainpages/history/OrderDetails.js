import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'

function OrderDetails() {

    const state = useContext(GlobalState)
    const [history] = state.userAPI.history
    const [orderDetails, setOderDetails] = useState([])

    const params = useParams()

    useEffect(() => {
        if (params.id) {
            history.forEach(item => {
                if (item._id === params.id) {
                    setOderDetails(item)
                }
            });
        }

    }, [params.id, history])
    console.log(orderDetails)

    if (orderDetails.length === 0) {
        return null
    }


    return (
        <>
            <div className="back">
                <Link to={'/history'}>
                    <i class="fa fa-caret-left"></i>
                    <span>  Order History</span>
                </Link>
            </div>

            <div className="cart-container">
                <div className="history-content">
                    <table>
                        <thead>
                            <tr>
                                <th>NAME</th>
                                <th>ADDRESS</th>
                                <th>POSTAL CODE</th>
                                <th>COUNTRY CODE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: "center" }}>{orderDetails.address.recipient_name}</td>
                                <td style={{ textAlign: "center" }}>{orderDetails.address.line1 + " - " + orderDetails.address.city}</td>
                                <td style={{ textAlign: "center" }}>{orderDetails.address.postal_code}</td>
                                <td style={{ textAlign: "center" }}>{orderDetails.address.country_code}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="cart-container">
                <div className="history-content">
                    <table style={{ margin: "30px 0" }}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th style={{ textAlign: "right" }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orderDetails.cart.map(item => (
                                    <tr className="cart-item" key={item._id}>
                                        <td>
                                            <div className="cart-info">
                                                <Link to={`/detail/${item._id}`}>
                                                    <img src={item.image.url} alt="" />
                                                </Link>
                                                <div>
                                                    <p>{item.name}</p>
                                                    <small>{item.dateOfBirth}</small>
                                                    <br />
                                                    <small>{item.category}</small>
                                                    <br />
                                                    <small>Price: ${item.price}</small>
                                                    <br />
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: "center" }}>{item.quantity}</td>
                                        <td>$ {item.price * item.quantity}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default OrderDetails
