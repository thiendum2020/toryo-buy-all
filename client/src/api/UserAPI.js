import { useState, useEffect } from 'react'
import axios from 'axios'
import swal from 'sweetalert'

function UserAPI(token) {

    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [cart, setCart] = useState([])
    const [username, setUsername] = useState([])
    const [name, setName] = useState([])
    const [phone, setPhone] = useState([])
    const [history, setHistory] = useState([])

    useEffect(() => {
        if (token) {
            const getUser = async () => {
                try {
                    const res = await axios.get('/user/info', {
                        headers: { Authorization: token }
                    })
                    setIsLogged(true)
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)
                    setUsername(res.data.username)
                    setName(res.data.name)
                    setPhone(res.data.phone)
                    setCart(res.data.cart)
                } catch (error) {
                    alert(error.response.data.msg)
                }
            }

            getUser()
        }
    }, [token])



    const addCart = async (product) => {
        if (!isLogged) return alert('Đăng nhập để mua hàng!')
        const check = cart.every(item => {
            return item._id !== product._id
        })

        if (check) {
            setCart([...cart, { ...product, quantity: 1 }])

            await axios.patch('/user/addcart', { cart: [...cart, { ...product, quantity: 1 }] }, {
                headers: { Authorization: token }
            })
            swal("Đã thêm vào giỏ hàng thành công!", "", "success")

        } else {
            swal("Sản phẩm đã được thêm vào giỏ hàng!", "", "warning")
        }
    }

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        username: [username, setUsername],
        name: [name, setName],
        phone: [phone, setPhone],
        addCart: addCart,
        history: [history, setHistory],

    }

}

export default UserAPI
