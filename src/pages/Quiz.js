import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Quiz.module.css';
import { mockQuizQuestions } from '../data/mockQuizQuestions';

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleAnswer = (questionType, optionValue) => {
    const currentAnswer = answers[currentQuestionIndex];

    if (questionType === 'characteristic-checkbox') {
      const newAnswer = currentAnswer ? [...currentAnswer] : [];
      const itemIndex = newAnswer.indexOf(optionValue);
      if (itemIndex > -1) {
        newAnswer.splice(itemIndex, 1);
      } else {
        newAnswer.push(optionValue);
      }
      setAnswers(prev => ({ ...prev, [currentQuestionIndex]: newAnswer }));
    } else if (questionType === 'body-type-ranking') {
      setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionValue }));
    }
    else {
      setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionValue }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockQuizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Logic to process answers can be added here
      navigate('/diet-plan');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const renderQuestion = () => {
    const question = mockQuizQuestions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestionIndex];

    switch (question.questionType) {
      case 'dosha-selection':
        return (
          <div className={styles.doshaOptions}>
            {question.options.map((option, index) => (
              <div 
                key={index} 
                className={`${styles.doshaCard} ${currentAnswer === option.text ? styles.selected : ''}`}
                style={{'--dosha-color': option.color}}
                onClick={() => {
                    handleAnswer(question.questionType, option.text);
                }}
              >
                <img src={`/images/${option.icon}`} alt={option.text} />
                <h3>{option.text}</h3>
              </div>
            ))}
          </div>
        );
      case 'body-type-ranking':
        return (
            <div className={styles.bodyTypeOptions}>
                {question.options.map((option, index) => (
                    <div 
                        key={index} 
                        className={`${styles.bodyTypeCard} ${currentAnswer === option.text ? styles.selected : ''}`}
                        onClick={() => handleAnswer(question.questionType, option.text)}
                    >
                        <img src={`/images/${option.image}`} alt={option.text} />
                        <h4>{option.text}</h4>
                        <p>{option.description}</p>
                    </div>
                ))}
            </div>
        );
    case 'characteristic-checkbox':
        return (
            <div className={styles.characteristicOptions}>
                {question.options.map((option, index) => (
                    <div 
                        key={index} 
                        className={`${styles.characteristicCard} ${currentAnswer?.includes(option.title) ? styles.selected : ''}`}
                        onClick={() => handleAnswer(question.questionType, option.title)}
                    >
                        <h5>{option.title}</h5>
                        <ul>
                            {option.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        );
    case 'radio-select':
        return (
            <div className={styles.radioOptions}>
                {question.options.map((option, index) => (
                    <div 
                        key={index} 
                        className={`${styles.radioLabel} ${currentAnswer === option.text ? styles.selected : ''}`}
                        onClick={() => handleAnswer(question.questionType, option.text)}
                    >
                        <span className={styles.radioInput}></span>
                        {option.text}
                    </div>
                ))}
            </div>
        );
      default:
        return <div>Question type not supported</div>;
    }
  };

  const currentQuestion = mockQuizQuestions[currentQuestionIndex];

  return (
    <div className={styles.quiz}>
      <div className={styles.quizCard}>
        { currentQuestion.questionType !== 'dosha-selection' &&
            <p className={styles.progressIndicator}>
              QUESTION {currentQuestionIndex} OF {mockQuizQuestions.length - 1}
            </p>
        }
        <h2>{currentQuestion.questionText}</h2>

        <div className={styles.questionContent}>
            {renderQuestion()}
        </div>

        <div className={styles.navigation}>
          {currentQuestionIndex > 0 && (
            <button onClick={handleBack} className={styles.navButton}>Back</button>
          )}
          <button onClick={handleNext} className={styles.navButton}>
              {currentQuestionIndex === mockQuizQuestions.length - 1 ? 'View My Plan' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
