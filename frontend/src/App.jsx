import { useContext } from "react"
import { Link, Outlet } from "react-router-dom"
import { AuthContext } from "./contexts/AuthContext"

const App = () => {
    const { user, dispatch } = useContext(AuthContext)

    function logout() {
        dispatch({
            type: 'LOGOUT'
        })
        localStorage.removeItem('user')
    }

    return (
        <div>
            <nav>
                <Link to="/">Home</Link>
                {user && (
                    <div>
                        <Link className="userLink">{user.username}</Link>
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