import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchQuestionaire } from "./../Api";

import { GameData, Question, Activity, Round } from "./../models/data";
import React from "react";

function Questions() {
  const navigate = useNavigate();
  // fetches the current location path
  const location = useLocation();
  // gets the query parameters and specifically gets the actNum
  const searchParams = new URLSearchParams(location.search);
  const getActNum = searchParams.get("actNum");
  const actNum = parseInt(getActNum!);

  // Gets the questions either for Activity 1 or Activity 2 onwards
  const [displayQuestion, setQuestion] = useState<Question[]>([]);
  //Serves as the index of the Rounds
  const [roundsCount, setRoundsCount] = useState(0);
  // Serves as the index of the Questions
  const [questionsCount, updateQCounter] = useState(0);
  const [display, setDisplay] = useState<Activity | Round | null>(null);
  //an indicator when a new round starts
  const [showRoundStartPrompt, setShowRoundStartPrompt] = useState(true);

  // Keeps track scores for activity 1
  const Activity1Counter = useRef(0);
  // Keeps track scores for activity 2 onwards
  const otherActivity = useRef(0);

  // fetching the data from the api endpoint
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: GameData = await fetchQuestionaire();

        if (actNum === 1) {
          setQuestion(response.activities[0].questions);
          setDisplay(response.activities[0]);
        } else {
          setQuestion(response.activities[actNum - 1]?.questions || []);
          setDisplay(response.activities[actNum - 1]);
        }
      } catch (error) {
        // Handle error appropriately
      }
    };
    fetchData();
  }, [actNum]);

  useEffect(() => {
    if (roundsCount > 0) {
      setShowRoundStartPrompt(true);
    }
    const totalDuration = 3000; // Animation delay (1500 milliseconds) + Animation duration (1500 milliseconds)

    const timeout = setTimeout(() => {
      setShowRoundStartPrompt(false);
    }, totalDuration);

    return () => clearTimeout(timeout);
  }, [roundsCount]);

  const displayNewQuestion = (action: string) => {
    const qTotal =
      actNum === 1
        ? displayQuestion.length
        : displayQuestion[roundsCount]?.questions?.length || 0;
    // gets current question
    const currentQuestion =
      actNum === 1
        ? displayQuestion[questionsCount]
        : displayQuestion[roundsCount]?.questions?.[questionsCount] ?? null;
    // checker for the answered question
    if (currentQuestion?.is_correct === (action === "true")) {
      const updatedQuestion: Question = { ...currentQuestion };
      updatedQuestion.user_answers.push("Correct");

      if (actNum === 1) {
        const updatedQuestions = [...displayQuestion];
        updatedQuestions[questionsCount] = updatedQuestion;

        setQuestion(updatedQuestions);
        Activity1Counter.current += 1;
      } else {
        const updatedQuestions = [...displayQuestion];
        const currentRound = updatedQuestions[roundsCount];
        if (currentRound && currentRound.questions) {
          currentRound.questions[questionsCount] = updatedQuestion;
          setQuestion(updatedQuestions);
          otherActivity.current += 1;
        }
      }
    }

    updateQCounter(questionsCount + 1);

    // rendering the scores page and passing  value to the scores component
    if (actNum === 1) {
      if (questionsCount === qTotal - 1) {
        navigate("/scores", {
          state: {
            displayQuestion: displayQuestion,
            actNum: actNum,
            Activity1Counter: Activity1Counter.current,
          },
        });
      }
    } else {
      if (
        questionsCount === qTotal - 1 &&
        roundsCount === displayQuestion.length - 1
      ) {
        navigate("/scores", {
          state: {
            displayQuestion: displayQuestion,
            actNum: actNum,
            otherActivity: otherActivity.current,
          },
        });
      } else if (questionsCount === qTotal - 1) {
        setRoundsCount(roundsCount + 1);
        updateQCounter(0);
      }
    }
  };
  //Gets the current questions and adding a bold style
  const questionToBold = (question?: string) => {
    if (question) {
      return question.replace(/\*(.*?)\*/g, "<span class='bolder'>$1</span>");
    }
    return "";
  };
  return (
    <>
      {showRoundStartPrompt && actNum !== 1 ? (
        <div className="question-card__container round-start-prompt ">
          <div className="card-heading__container">
            <h2 className="activity_head head-1 heading">
              {(display as Activity)?.activity_name}
            </h2>
            <h2 className="question-number head-2 heading">
              {displayQuestion[roundsCount]?.round_title}
            </h2>
          </div>
        </div>
      ) : (
        <div className="question-card__container">
          <div className="card-heading__container">
            <h1 className="activity_head head-1 heading">
              {actNum === 1
                ? (display as Activity)?.activity_name
                : (displayQuestion[roundsCount] as Round)?.round_title}
            </h1>
            <h1 className="question-number head-2 heading">
              Q
              {actNum === 1
                ? displayQuestion[questionsCount]?.order ?? ""
                : displayQuestion[roundsCount]?.questions?.[questionsCount]
                    ?.order ?? ""}
              .
            </h1>
          </div>
          <div className="question-Container">
            <h1
              className="question head-1"
              dangerouslySetInnerHTML={{
                __html:
                  actNum === 1
                    ? questionToBold(
                        displayQuestion[questionsCount]?.stimulus ?? ""
                      )
                    : questionToBold(
                        displayQuestion[roundsCount]?.questions?.[
                          questionsCount
                        ]?.stimulus ?? ""
                      ),
              }}
            ></h1>
          </div>
          <div className="answer-block">
            <button
              className="btn-questions"
              // triggering the displayNewQuestions and passing true as a parameter
              onClick={() => displayNewQuestion("true")}
            >
              Correct
            </button>
            <button
              className="btn-questions"
              // triggering the displayNewQuestions and passing true as a parameter
              onClick={() => displayNewQuestion("false")}
            >
              Incorrect
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Questions;
