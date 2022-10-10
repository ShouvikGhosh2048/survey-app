import { useEffect, useReducer, createContext } from "react"

export const AuthContext = createContext()

function authReducer(state, action) {
    switch(action.type) {
        case 'LOGIN': {
            return {
                user: action.payload
            }
        }
        case 'LOGOUT': {
            return {
                user: null
            }
        }
        default: {
            return state
        }
    }
}

export function AuthContextProvider({ children }) {
    // Initially the user is undefined (not null),
    // we use this to detect whether we have loaded the user from local storage.
    const [state, dispatch] = useReducer(authReducer, {})

    useEffect(() => {
        let user = localStorage.getItem('user')
        if (user) {
            dispatch({
                type: 'LOGIN',
                payload: JSON.parse(user)
            })
        }
        else {
            dispatch({
                type: 'LOGOUT'
            })
        }
    }, [])

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}