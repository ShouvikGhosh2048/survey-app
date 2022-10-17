import { useContext } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { AuthContext } from "./contexts/AuthContext"

// https://stackoverflow.com/questions/45422409/handling-jwt-token-expiration-in-a-react-based-application

const App = () => {
    const { user, dispatch } = useContext(AuthContext)
    const navigate = useNavigate()

    function logout() {
        dispatch({
            type: 'LOGOUT'
        })
        localStorage.removeItem('user')
        navigate('/')
    }

    return (
        <div>
            <nav>
                <Link to="/">Home</Link>
                {user && (
                    <div>
                        <Link to="/user" className="userLink">{user.username}</Link>
                        <button onClick={logout}>Logout</button>
                    </div>
                )}
                {!user && (
                    <div>
                        <Link to="/signup">Signup</Link>
                        <Link to="/login">Login</Link>
                    </div>
                )}
            </nav>
            <Outlet />
        </div>
    )
}

export default App