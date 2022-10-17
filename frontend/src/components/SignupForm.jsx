import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'

const SignupForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    })
    const [error, setError] = useState('')
    const [disabled, setDisabled] = useState(false)
    const { dispatch } = useContext(AuthContext)
    
    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            setError("The passwords don't match")
            return
        }
        setDisabled(true)
        try {
            let response = await fetch('/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            const json = await response.json()
            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(json))
                dispatch({
                    type: 'LOGIN',
                    payload: json
                })
            }
            else {
                setError(json.error)
                setDisabled(false)
            }
        } catch (err) {
            setError("Couldn't signup")
            setDisabled(false)
        }
    }

    return (
        <div className="centerFormContainer">
            <h1>Sign Up</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type='text' name='username' id='username' placeholder='Username' value={formData.username} onChange={handleChange} disabled={disabled} required/>
                <input type='password' name='password' id='password' placeholder='Password' value={formData.password} onChange={handleChange} disabled={disabled} required/>
                <input type='password' name='confirmPassword' id='confirmPassword' placeholder='Confirm password' value={formData.confirmPassword} onChange={handleChange} disabled={disabled} required/>
                <input type='submit' value='Signup' disabled={disabled}/>
            </form>
        </div>
    )
}

export default SignupForm