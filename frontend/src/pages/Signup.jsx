import { useEffect, useContext, useState } from 'react'
import { Form, useActionData, useNavigate, useNavigation } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export async function action({ request }) {
    const formData = Object.fromEntries(await request.formData())
    if (formData.password !== formData.confirmPassword) {
        return {
            error: "The passwords don't match",
        }
    }
    try {
        let response = await fetch('/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        return (await response.json())
    } catch (err) {
        return {
            error: "Couldn't create the user"
        }
    }
}

const Signup = () => {
    const actionData = useActionData()
    const [username, setUsername] = useState('')
    const { user, dispatch } = useContext(AuthContext)
    const navigate = useNavigate()
    const navigation = useNavigation()

    // Check if logged in.
    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [user])

    // When user is created.
    useEffect(() => {
        // actionData is a string only when it is the JSON web token.
        if (typeof actionData === 'string') {
            let user = {
                username,
                token: actionData,
            }
            localStorage.setItem('user', JSON.stringify(user))
            dispatch({
                type: 'LOGIN',
                payload: user
            })
            navigate('/')
        }
    }, [actionData, username])

    // Render the form only when the user is null (undefined means that the user is being loaded from local storage).
    if (user !== null) {
        return <div></div>
    }

    return (
        <div className="centerFormContainer">
            <h1>Sign Up</h1>
            {actionData && <p className="error">{actionData.error}</p>}
            <Form method='post' action='/signup'>
                <input type='text' name='username' id='username' placeholder='Username' value={username} onChange={(e) => {setUsername(e.target.value)}} disabled={navigation.state !== 'idle'} required/>
                <input type='password' name='password' id='password' placeholder='Password' disabled={navigation.state !== 'idle'} required/>
                <input type='password' name='confirmPassword' id='confirmPassword' placeholder='Confirm password' disabled={navigation.state !== 'idle'} required/>
                <input type='submit' value='Signup' disabled={navigation.state !== 'idle'}/>
            </Form>
        </div>
    )
}

export default Signup