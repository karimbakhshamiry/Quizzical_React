import React from "react";

export default function Quiz(props) {
    const answersArray = props.answers

    function setBackgroundColor(answer, status, isHeld, correctAnswer, presetBackground) {
        let color = ""
        if (status === 'start') {
            isHeld ? color =  "white" : color = "#DDEBF8"
        } else if (status === 'check' && isHeld) {
            color = presetBackground 
        } else if (status === 'check') {
            answer === correctAnswer ? color = "#94d7a271" : color = "#DDEBF8"
        }

        return color
    }

    const answersElement = answersArray.map(answer => {
        const answerStyle= {
            backgroundColor: setBackgroundColor(answer.answer, props.status, answer.isHeld, props.correctAnswer, answer.backgroundColor)
        }

        return (
            <div className="answer" onClick={props.status === "start" ? () => {props.handleClick(props.question, answer.answer)} : () => {return false}} style={answerStyle}>{answer.answer}</div>
        )
    })

    return (
        <div className="quiz_question">
            <div className="question">
                {props.question}
            </div>

            <div className="answers">
                {answersElement}
            </div>
        </div>
    )
}