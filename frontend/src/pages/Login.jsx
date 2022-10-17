import { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import LoginForm from '../components/LoginForm'

const Login = () => {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    // Check if logged in.
    useEffect(() => {
        if (user) {
            navigate('/user')
        }
    }, [user])

    // Render the form only when the user is null (undefined means that the user is being loaded from local storage).
    if (user !== null) {
        return null
    }

    return <LoginForm />
}

export default Login