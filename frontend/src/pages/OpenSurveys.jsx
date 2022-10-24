import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Survey = ({ survey }) => {
    return (
        <div>
            <p>{ survey.title }</p>
            <Link to={`/create-response/${survey._id}`}>Take survey</Link>
        </div>
    )
}

const OpenSurveys = () => {
    const [surveys, setSurveys] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchSurveys() {
            setSurveys(null)
            try {
                const response = await fetch('/api/survey/open')
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
        <div>
            { error && <p>{error}</p> }
            { surveys && surveys.map(survey => <Survey survey={survey} key={survey._id}/>) }
        </div>
    )
}

export default OpenSurveys