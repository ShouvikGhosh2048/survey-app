import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const QuestionResult = ({ question, counts, index }) => {
    return (
        <div className="questionResult">
            <p>{ (index + 1) + ') ' + question.text }</p>
            <table>
                <thead>
                    <tr>
                        <th>Choice</th>
                        <th>Number of responses</th>
                    </tr>
                </thead>
                <tbody>
                    { question.choices.map((choice, index) => {
                            return (
                                <tr key={index}>
                                    <td>{ choice }</td>
                                    <td>{ counts[index] }</td>
                                </tr>
                            )
                    })}
                </tbody>
            </table>
        </div>
    )
}

const Result = () => {
    const [result, setResult] = useState(null)
    const [error, setError] = useState('')
    const { surveyId } = useParams()

    useEffect(() => {
        async function fetchResult() {
            try {
                const response = await fetch(`/api/result/${surveyId}`)
                const json = await response.json()
                if (response.ok) {
                    setResult(json)
                }
                else {
                    setError(json.error)
                }
            } catch (err) {
                setError("Couldn't fetch result")
            }
        }

        setResult(null)
        fetchResult()
    }, [surveyId])

    if (!result) {
        return (
            <div>
                { error && <p>{error}</p> }
            </div>
        )
    }

    return (
        <div className="resultsPage">
            <p>{ result.survey.title }</p>
            <p>Total number of submissions: { result.numberOfSubmissions }</p>
            { result.survey.questions.map((question, index) => <QuestionResult question={question} counts={result.counts[index]} index={index} key={question._id}/>) }
        </div>
    )
}

export default Result