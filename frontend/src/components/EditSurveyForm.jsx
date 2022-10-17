const EditChoice = ({ choice, setChoice, index, deleteChoice }) => {
    return (
        <div>
            <label>Choice {index + 1}</label>
            <input type="text" value={choice} onChange={(e) => {setChoice(e.target.value)}}/>
            <button onClick={deleteChoice}>Delete</button>
        </div>
    )
}

const EditQuestion = ({ question, setQuestion, index, deleteQuestion }) => {
    function addChoice() {
        if (question.choices.length === 5) {
            return
        }
        setQuestion({
            ...question,
            choices: [...question.choices, '']
        })
    }

    function mapChoice(choice, index) {
        function setChoice(choice) {
            setQuestion({
                ...question,
                choices: [...question.choices.slice(0,index), choice, ...question.choices.slice(index + 1)]
            })
        }

        function deleteChoice() {
            setQuestion({
                ...question, 
                choices: [...question.choices.slice(0,index), ...question.choices.slice(index + 1)]
            })
        }

        return <EditChoice choice={choice} setChoice={setChoice} deleteChoice={deleteChoice} key={index} index={index}/>
    }

    return (
        <div>
            <p>Question {index + 1} <button onClick={deleteQuestion}>Delete question</button></p>
            { question.errors && (
                <ul>
                    { question.errors.map((error, index) => <li key={index}>{error}</li>) }
                </ul>
            )}
            <input type="text" placeholder="Question" value={question.text} onChange={(e) => {setQuestion({ ...question, text: e.target.value})}}/>
            <button onClick={addChoice}>Add choice</button>
            { question.choices.map(mapChoice) }
        </div>
    )
}

const EditSurveyForm = ({ survey, setSurvey, saveSurvey, disabled }) => {
    function addQuestion() {
        if (survey.questions.length === 10) {
            return
        }
        setSurvey({
            ...survey,
            questions: [...survey.questions, {
                text: '',
                choices: []
            }]
        })
    }

    function onSave() {
        let fieldErrorsExist = false

        let newSurvey = {}
        newSurvey.title = survey.title
        newSurvey.questions = []
        survey.questions.forEach(question => {
            newSurvey.questions.push({
                text: question.text,
                choices: [...question.choices]
            })
        })
        newSurvey.state = survey.state
        
        if (newSurvey.title.trim() === '') {
            fieldErrorsExist = true
            newSurvey.errors = ['Empty survey title']
        }

        if (newSurvey.questions.length === 0) {
            fieldErrorsExist = true
            if (!newSurvey.errors) {
                newSurvey.errors = []
            }
            newSurvey.errors.push('Survey needs at least one question')
        }

        newSurvey.questions.forEach(question => {
            let errors = []

            if (question.text === '') {
                errors.push('Empty question text')
            }

            if (question.choices.length <= 1) {
                errors.push('Question needs at least 2 choices')
            }

            for (let i = 0; i < question.choices.length; i++) {
                if (question.choices[i].trim() === '') {
                    errors.push('Question choices must be non empty')
                    break
                }
            }

            if (errors.length > 0) {
                question.errors = errors
                fieldErrorsExist = true
            }
        })

        setSurvey(newSurvey)

        if (!fieldErrorsExist) {
            saveSurvey(survey)
        }
    }

    function mapQuestion(question, index) {
        function setQuestion(question) {
            setSurvey({ 
                ...survey, 
                questions: [...survey.questions.slice(0,index), question, ...survey.questions.slice(index + 1)] 
            })
        }

        function deleteQuestion() {
            setSurvey({ 
                ...survey, 
                questions: [...survey.questions.slice(0,index), ...survey.questions.slice(index + 1)] 
            })
        }

        return <EditQuestion question={question} setQuestion={setQuestion} deleteQuestion={deleteQuestion} key={index} index={index}/>
    }

    return (
        <div>
            { survey.errors && (
                <ul>
                    { survey.errors.map((error, index) => <li key={index}>{error}</li>) }
                </ul>
            ) }
            <input type="text" value={survey.title} onChange={(e) => { setSurvey({ ...survey, title: e.target.value }) }}/>
            <button onClick={addQuestion}>Add a question</button>
            { survey.questions.map(mapQuestion) }
            <button onClick={onSave} disabled={disabled}>Save</button>
        </div>
    )
}

export default EditSurveyForm