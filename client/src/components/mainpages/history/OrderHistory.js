import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'

function OrderHistory() {

    const state = useContext(GlobalState)
    const [history, setHistory] = state.userAPI.history
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token

    useEffect(() => {

        if (token) {
            const getHistory = async () => {
                if (isAdmin) {
                    const res = await axios.get('/api/payment', {
                        headers: { Authorization: token }
                    })
                    setHistory(res.data)
                } else {
                    const res = await axios.get('/user/history', {
                        headers: { Authorization: token }
                    })
                    setHistory(res.data)
                }
            }
            getHistory()
        }
    }, [token, isAdmin, setHistory])

    return (
        <div className="order-container">
            <div className="title">
                <h2>History</h2>
                <p>Total: {history.length}</p>
            </div>

            <div className="history-content">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            history.map(item => (
                                <tr className="cart-item" key={item._id}>
                                    <td style={{ textAlign: "center" }}>{item.paymentID}</td>
                                    <td style={{ textAlign: "center" }}>{item.createdAt.substring(0, 10)}</td>
                                    <td>
                                        <Link to={`/history/${item._id}`} className="view">View</Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderHistory
