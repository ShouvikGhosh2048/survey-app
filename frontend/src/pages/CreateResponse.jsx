import { useEffect, useContext, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"

const ResponseChoice = ({ question, choice, setChoice, disabled, index }) => {
    return (
        <div>
            { choice.error && <p>{ choice.error }</p>}
            <p>Question {index + 1}</p>
            <p>{ question.text }</p>
            { question.choices.map((questionChoice, index) => {
                return (
                    <div key={index}>
                        <input type="radio"
                                checked={ index === choice.choice }
                                onChange={
                                    (e) => {
                                        if (e.target.value === 'on' && !disabled) {
                                            setChoice({
                                                ...choice,
                                                choice: index
                                            })
                                        }
                                    }
                                }/>
                        <label>{ questionChoice }</label>
                    </div>
                )
            })}
        </div>
    )
}

const CreateResponseForm = ({ survey, response, setResponse, submitResponse, disabled }) => {
    function mapQuestion(question, index) {
        function setChoice(choice) {
            setResponse([...response.slice(0,index), choice, ...response.slice(index + 1)])
        }

        return <ResponseChoice question={question} choice={response[index]} setChoice={setChoice} disabled={disabled} index={index} key={question._id}/>
    }

    function onSubmit() {
        let errorExists = false
        let newResponse = []

        response.forEach(res => {
            let newRes = { choice: res.choice }
            if (newRes.choice === null) {
                errorExists = true
                newRes.error = 'Choice required'
            }
            newResponse.push(newRes)
        })

        setResponse(newResponse)
        if (!errorExists) {
            submitResponse(
                newResponse.map(res => res.choice)
            )
        }
    }

    return (
        <div>
            <p>{ survey.title }</p>
            { survey.error && <p>{ survey.error }</p> }
            { survey.questions.map(mapQuestion) }
            <button onClick={onSubmit}>Submit response</button>
        </div>
    )
}

const CreateResponse = () => {
    const { user, dispatch } = useContext(AuthContext)
    const [survey, setSurvey] = useState(null)
    const [response, setResponse] = useState(null)
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
                    // Check if user has already submitted a response
                    const response = await fetch(`/api/response/${surveyId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        },
                    })
                    if (response.ok) {
                        setDisabled(false)
                        setError('You have already submitted a response')
                        return
                    }
                    else if (response.status !== 404) {
                        const json = await response.json()
                        setDisabled(false)
                        setError(json.error)
                        return
                    }

                    const survey = await fetch(`/api/survey/${surveyId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        },
                    })
                    const json = await survey.json()
                    
                    if (survey.ok) {
                        setSurvey(json)
                        setResponse(new Array(json.questions.length).fill({ choice: null }))
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

        setSurvey(null)
        fetchSurvey()
    }, [user, surveyId])

    if (!user) {
        return null
    }

    async function submitResponse(response) {
        setDisabled(true)

        try {
            const res = await fetch(`/api/response/${surveyId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(response)
            })
            const json = await res.json()
            
            if (res.ok) {
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
        return (
            <div>
                { error && <p>{error}</p> }
            </div>
        )
    }
    else if (survey.state !== 'open') {
        return <p>The survey is currently {survey.state}</p>
    }

    return (
        <div>
            <Link to="/user">Cancel</Link>
            { error && <p>{error}</p> }
            { survey && <CreateResponseForm survey={survey} response={response} setResponse={setResponse} submitResponse={submitResponse} disabled={disabled}/> }
        </div>
    )
}

export default CreateResponse