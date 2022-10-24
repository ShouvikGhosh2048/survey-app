import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"

const Survey = ({ survey, setSurvey, setError }) => {
    const { user } = useContext(AuthContext)
    const [disabled, setDisabled] = useState(false)

    async function setSurveyState(state) {
        try {
            setDisabled(true)
            const response = await fetch(`/api/survey/${survey._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ state })
            })
            const json = await response.json()
            
            if (response.ok) {
                setSurvey({
                    ...survey,
                    state
                })
                setDisabled(false)
            }
            else {
                if (json.error === 'Invalid authorization') {
                    localStorage.removeItem('user')
                    dispatch({
                        type: 'LOGOUT'
                    })
                }
                else {
                    setError(json.error)
                    setDisabled(false)
                }
            }
        } catch(err) {
            setDisabled(false)
        }
    }

    function openSurvey() {
        setSurveyState('open')
    }

    function closeSurvey() {
        setSurveyState('closed')
    }

    return (
        <div>
            <p>{ survey.title }</p>
            <p>State: { survey.state }</p>
            { survey.state === 'saved' && <Link to={`/edit-survey/${survey._id}`}>Edit survey</Link> }
            { survey.state === 'saved' && <button onClick={openSurvey} disabled={disabled}>Open survey</button> }
            { survey.state === 'open' && <button onClick={closeSurvey} disabled={disabled}>Close survey</button> }
            { survey.state === 'closed' && <Link to={`/result/${survey._id}`}>View results</Link> }
        </div>
    )
}

const User = () => {
    const { user } = useContext(AuthContext)
    const [surveys, setSurveys] = useState(null)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (user === null) {
            navigate('/login')
        }
    }, [user])

    useEffect(() => {
        async function fetchSurveys() {
            if (user && user.isCoordinator) {
                setSurveys(null)
                try {
                    const response = await fetch('/api/survey', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    })
                    const json = await response.json()
                    if (response.ok) {
                        setSurveys(json)
                    }
                    else {
                        if (json.error === 'Invalid authorization') {
                            localStorage.removeItem('user')
                            dispatch({
                                type: 'LOGOUT'
                            })
                            navigate('/login')
                        }
                        else {
                            setError(json.error)
                        }
                    }
                } catch (err) {
                    setError("Couldn't fetch surveys")
                }
            }
        }
        fetchSurveys()
    }, [user])

    if (!user) {
        return null
    }
    return (
        <div>
            { user.isCoordinator && <Link to='/create-survey'>Create survey</Link>}
            { error && <p>{error}</p> }
            { surveys !== null && (
                <ul>
                    { surveys.map((survey, index) => <Survey key={survey._id} survey={survey} setSurvey={(survey) => { setSurveys([...surveys.slice(0,index), survey, ...surveys.slice(index+1)]) }} setError={setError}/>) }
                </ul>
            )}
        </div>
    )
}

export default User