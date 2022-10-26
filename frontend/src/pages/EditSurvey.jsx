import { useEffect, useContext, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import EditSurveyForm from "../components/EditSurveyForm"
import { AuthContext } from "../contexts/AuthContext"

const EditSurvey = () => {
    const { user, dispatch } = useContext(AuthContext)
    const [survey, setSurvey] = useState(null)
    const [error, setError] = useState('')
    const [disabled, setDisabled] = useState(false)
    const navigate = useNavigate()
    const { surveyId } = useParams()

    useEffect(() => {
        if (user === null) {
            navigate('/login')
        }
    }, [user])

    useEffect(() => {
        async function fetchSurvey() {
            if (user) {
                setDisabled(true)
                try {
                    const response = await fetch(`/api/survey/${surveyId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        },
                    })
                    const json = await response.json()
                    
                    if (response.ok) {
                        setSurvey(json)
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
                } catch (err) {
                    setDisabled(false)
                }
            }
        }
        fetchSurvey()
    }, [user])

    if (!user) {
        return null
    }
    else if (!user.isCoordinator) {
        return <p>You need to be a coordinator to edit a survey.</p>
    }

    async function saveSurvey(survey) {
        setDisabled(true)

        try {
            const response = await fetch(`/api/survey/${surveyId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(survey)
            })
            const json = await response.json()
            
            if (response.ok) {
                navigate('/user')
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
        } catch (err) {
            setDisabled(false)
        }
    }

    if (!survey) {
        return null
    }
    else if (survey.state !== 'saved') {
        return <p>The survey is currently {survey.state} and can't be edited.</p>
    }

    return (
        <div>
            <Link to="/user">Cancel</Link>
            { error && <p>{error}</p> }
            { survey && <EditSurveyForm survey={survey} setSurvey={setSurvey} saveSurvey={saveSurvey} disabled={disabled}/> }
        </div>
    )
}

export default EditSurvey