import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const QuestionResult = ({ question, counts, index }) => {
    return (
        <div>
            <p>Question {index + 1}</p>
            <p>{ question.text }</p>
            { question.choices.map((choice, index) => <p key={index}>{counts[index]} response{counts[index] !== 1 && 's'} - {choice}</p>)}
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
        <div>
            <p>{ result.survey.title }</p>
            <p>Total number of submissions: { result.numberOfSubmissions }</p>
            { result.survey.questions.map((question, index) => <QuestionResult question={question} counts={result.counts[index]} index={index} key={question._id}/>) }
        </div>
    )
}

export default Result