import React from "react";
import Quiz from "./Quiz";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function MainPage() {
    const [gameStatus, setGameStatus] = React.useState('stop')
    const [questionsObject, setQuestionsObject] = React.useState([])
    const [score, setScore] = React.useState(0)
    const [rounds, setRounds] = React.useState(0)

    // functions that sets game Status
    function startGame() {
        setGameStatus('start')
        setScore(0)
    }
    function checkAnswers() {
        setGameStatus('check')
        questionsObject.forEach(question => {
            if (question.heldAnswer[0] === question.correct_answer) {
                setScore(prevState => prevState + 1)
            }
        })
    }

    function playAgain() {
        setScore(0)
        setGameStatus('start')
        setQuestionsObject([])
        setRounds(prevState => prevState +1)
    }

    React.useEffect(()=> {
        fetch('https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple')
        .then(response => response.json())

        .then(data => {

            // NEW CODE THAT IS ABOUT TO WORK
            data.results.forEach(result => {
                // console.log(result)

                    setQuestionsObject((prevState) => {
                        const question = {
                            id: nanoid(),
                            question: result.question,
                            answers: [...result.incorrect_answers, result.correct_answer].sort(() => Math.random() - 0.5).map((answer) =>{
                                return {
                                    answer : answer,
                                    isHeld : false,
                                    backgroundColor: answer === result.correct_answer ? "#94D7A2" : "#F8BCBC"
                                }
                            }),
                            correct_answer: result.correct_answer,
                            heldAnswer: []
                        }
                        
                        return [...prevState, question]
                    })

            })
        })
    }, [rounds])
    

    function switchHeldAnswer(question, answer) {

        setQuestionsObject((prevState) => {
            const updatedState = []
            prevState.forEach((currentQuesion) => {

                if (currentQuesion.question === question) {
                    let tempHeldAnswer = [...currentQuesion.heldAnswer]
                    const updatedAnswer = []
                    currentQuesion.answers.map((currentAnswer) => {
                        if (currentAnswer.answer === answer) {

                            if (currentAnswer.isHeld) {
                                tempHeldAnswer = []
                                updatedAnswer.push({
                                    ...currentAnswer,
                                    isHeld: false
                                })
                            } else {
                                if (currentQuesion.heldAnswer.length === 0) {
                                    tempHeldAnswer = [currentAnswer.answer]
                                    updatedAnswer.push({
                                        ...currentAnswer,
                                        isHeld: true
                                    })
                                } else {
                                    updatedAnswer.push(currentAnswer)
                                }
                            }
                        } else {
                
                            updatedAnswer.push(currentAnswer)
                        }
                
                        return updatedAnswer
                    })
                
                    updatedState.push({
                        ...currentQuesion,
                        answers: updatedAnswer,
                        heldAnswer: tempHeldAnswer
                    })
                    
                
                } else {
                
                    updatedState.push(currentQuesion)
                
                }
            })

            return updatedState
        })

    }

    function generateQuestions() {
        const questions = questionsObject.map(questionObj => {
            return <Quiz status={gameStatus} handleClick={switchHeldAnswer} key={questionObj.id} question={questionObj.question} answers={questionObj.answers} correctAnswer={questionObj.correct_answer}/>
        })

        return questions
    }
    
    return (
        gameStatus === 'stop' ?
        
            <section className="welcome">
                <span className="blob top_blob"></span>
                <div className="container welcome__container">
                    <h1 className="game_title">Quizzical</h1>
                    <p className="game_subtitle">Some description if needed</p>
                    <button className="start_game" onClick={startGame}>Start Quiz</button>
                </div>
                <span className="blob bottom_blob"></span>
            </section>

        :

            <section className="game_page">
                <span className="blob top_blob top_blob_game "></span>
                <div className="container game_page__container">
                    {generateQuestions()}
                    {
                        gameStatus === 'start' && 
                        
                        <div className="score_container">
                            <button className="submit_answers" onClick={checkAnswers}>Check Answer</button>
                        </div>
                    }

                    {
                        gameStatus === 'check' &&
                        <div className="score_container">
                            { (gameStatus === 'check' && score > questionsObject.length /1.5) && <Confetti height={1000}/>}
                            <span className="score">You scored {`${score} / ${questionsObject.length}. ${score > questionsObject.length/1.5 ? 'You Rock!!  ' : 'You must have tried hard. Maybe next time...  '}`}</span><button className="play_again" onClick={playAgain}> Play Again</button>
                        </div>
                    }
                </div>
                <span className="blob bottom_blob bottom_blob_game"></span>
            </section>
    )
}


