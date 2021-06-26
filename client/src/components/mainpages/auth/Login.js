import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'


const Login = () => {

    const [user, setUser] = useState({
        username: '',
        password: ''
    })

    const onChangeInput = e => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value })
    }

    const loginSubmit = async e => {
        e.preventDefault()
        try {
            await axios.post('/user/login', { ...user })
            localStorage.setItem('firstLogin', true)
            window.location.href = "/"
        } catch (error) {
            alert(error.response.data.msg)
        }
    }

    return (
        <div className="login-page">
            <form onSubmit={loginSubmit}>
                <h2>LOGIN</h2>
                <input type="text" name="username" required placeholder="Username"
                    value={user.username} onChange={onChangeInput} />
                <input type="password" name="password" required placeholder="Password" autoComplete="on"
                    value={user.password} onChange={onChangeInput} />
                <div className="row">
                    <button type="submit" className="btn-login">LOGIN</button>
                    <Link to='/register'>REGISTER</Link>
                </div>
            </form>
        </div>
    )
}

export default Login
