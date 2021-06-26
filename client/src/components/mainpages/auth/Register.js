import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
    const [user, setUser] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        phone: ''
    })

    const onChangeInput = e => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value })
    }

    const registerSubmit = async e => {
        e.preventDefault()
        try {
            await axios.post('/user/register', { ...user })
            localStorage.setItem('firstLogin', true)
            window.location.href = "/"
        } catch (error) {
            alert(error.response.data.msg)
        }
    }

    return (
        <div className="login-page">
            <form onSubmit={registerSubmit}>
                <h2>REGISTER</h2>
                <input type="text" name="username" required placeholder="Username"
                    value={user.username} onChange={onChangeInput} />

                <input type="password" name="password" required placeholder="Password" autoComplete="on"
                    value={user.password} onChange={onChangeInput} />

                <input type="text" name="name" required placeholder="Name"
                    value={user.name} onChange={onChangeInput} />

                <input type="email" name="email" required placeholder="Email"
                    value={user.email} onChange={onChangeInput} />

                <input type="number" name="phone" required placeholder="Phone"
                    value={user.phone} onChange={onChangeInput} />

                <div className="row">
                    <button type="submit" className="btn-login">REGISTER</button>
                    <Link to='/login'>LOGIN</Link>
                </div>
            </form>
        </div>
    )
}

export default Register
