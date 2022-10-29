import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Survey = ({ survey }) => {
    return (
        <div>
            <p>{ survey.title }</p>
            <Link to={`/result/${survey._id}`}>View results</Link>
        </div>
    )
}

const ClosedSurveys = () => {
    const [surveys, setSurveys] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchSurveys() {
            setSurveys(null)
            try {
                const response = await fetch('/api/survey/closed')
                const json = await response.json()
                if (response.ok) {
                    setSurveys(json)
                }
                else {
                    setError(json.error)
                }
            } catch (err) {
                setError("Couldn't fetch surveys")
            }
        }
        fetchSurveys()
    }, [])

    return (
        <div className="closedSurveysPage">
            { error && <p>{error}</p> }
            <div className="surveyList">
                { surveys && surveys.map(survey => <Survey survey={survey} key={survey._id}/>) }
            </div>
        </div>
    )
}

export default ClosedSurveys