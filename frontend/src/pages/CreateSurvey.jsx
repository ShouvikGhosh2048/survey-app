import { useContext, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import EditSurveyForm from "../components/EditSurveyForm"
import { AuthContext } from "../contexts/AuthContext"

const CreateSurvey = () => {
    const { user, dispatch } = useContext(AuthContext)
    const [survey, setSurvey] = useState({
        title: '',
        questions: [],
    })
    const [error, setError] = useState('')
    const [disabled, setDisabled] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (user === null) {
            navigate('/')
        }
    }, [user])
    
    if (!user) {
        return null
    }
    else if (!user.isCoordinator) {
        return <p>You need to be a coordinator to create a survey</p>
    }

    async function saveSurvey(survey) {
        setDisabled(true)

        try {
            const response = await fetch('/api/survey', {
                method: 'POST',
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
                    navigate('/login')
                }
                else {
                    setError(json.error)
                    setDisabled(false)
                }
            }
        } catch (err) {
            setError('Survey creation failed')
            setDisabled(false)
        }
    }

    return (
        <div>
            <Link to="/user">Cancel</Link>
            { error && <p>{error}</p> }
            <EditSurveyForm survey={survey} setSurvey={setSurvey} saveSurvey={saveSurvey} disabled={disabled}/>
        </div>
    )
}

export default CreateSurvey