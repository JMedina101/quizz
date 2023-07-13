import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { fetchQuestionaire } from "./Api";

import {
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

function App() {
  return (
    <div className="canvas">
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/scores" element={<ScoreDisplay />} />
        </Routes>
      </main>
    </div>
  );
}

function Home() {
  const [headerValues, HeaderValue] = useState(null);
  const [activityValues, updateActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuestionaire();

        HeaderValue(response);
        updateActivity(response.activities);
        console.log(response.activities);
      } catch (error) {}
    };
    fetchData();
  }, []);

  return (
    <div className="card">
      <div className="card-heading">
        <h1 className="head-1 heading">{headerValues?.heading}</h1>
        <h2 className="head-2 heading">{headerValues?.name}</h2>
      </div>
      <div className="activity-container">
        {activityValues.map((currActivity) => (
          <div key={currActivity?.order} className="activity">
            <Link
              to={{
                pathname: "/questions",
                search: `?actNum=${currActivity?.order}`,
              }}
              className="activity-link"
            >
              <h2 className="activty">{currActivity?.activity_name}</h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
const questionToBold = (question) => {
  if (question) {
    return question.replace(/\*(.*?)\*/g, "<span class='bolder'>$1</span>");
  }
  return "";
};

function Questions() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const actNum = searchParams.get("actNum");

  const navigate = useNavigate();

  const [displayQuestion, updateQuestion] = useState([]);
  const [questionsCount, updateQCounter] = useState(0);
  const [roundsCount, setRoundsCount] = useState(0);
  const [display, setDisplays] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuestionaire();

        if (actNum === "1") {
          updateQuestion(response.activities[0].questions);
          setDisplays(response.activities[0]);
        } else {
          updateQuestion(response.activities[actNum - 1].questions);
          setDisplays(response.activities[actNum - 1]);
        }
      } catch (error) {}
    };
    fetchData();
  }, []);

  // // how to handle async
  // useEffect(() => {
  //   if (roundsCount === 0) {
  //     updateQCounter(0);
  //   }
  // }, [roundsCount]);

  // useEffect(() => {
  //   if (actNum !== 1 && displayQuestion.questions) {
  //     setRoundsCount(displayQuestion.questions.length);
  //   } else {
  //     console.log("Not working");
  //   }
  // }, [actNum, displayQuestion.questions]);

  const displayNewQuestion = (action) => {
    const qTotal =
      actNum === "1"
        ? displayQuestion.length
        : displayQuestion[roundsCount]?.questions?.length;

    const currentQuestion =
      actNum === "1"
        ? displayQuestion[questionsCount]
        : displayQuestion[roundsCount]?.questions[questionsCount];

    if (currentQuestion?.is_correct === (action === "true")) {
      const updatedQuestion = { ...currentQuestion };
      updatedQuestion.user_answers.push("Correct");

      if (actNum === "1") {
        const updatedQuestions = [...displayQuestion];
        updatedQuestions[questionsCount] = updatedQuestion;
        updateQuestion(updatedQuestions);
      } else {
        const updatedQuestions = [...displayQuestion];
        updatedQuestions[roundsCount].questions[questionsCount] =
          updatedQuestion;
        updateQuestion(updatedQuestions);
      }
    }

    updateQCounter(questionsCount + 1);

    if (actNum === "1") {
      if (questionsCount === qTotal - 1) {
        navigate("/scores", {
          state: {
            displayQuestion: displayQuestion,
            actNum: actNum,
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
          },
        });
      } else if (questionsCount === qTotal - 1) {
        setRoundsCount(roundsCount + 1);
        updateQCounter(0);
      }
    }
  };

  // if (questionsCount === currentQuestion.length - 1) {
  //   navigate("/scores", {
  //     state: {
  //       displayQuestion: displayQuestion,
  //       actNum: actNum,
  //     },
  //   });
  // }

  // if (questionsCount === qTotal) {
  //   setRoundsCount(roundsCount + 1);
  //   updateQCounter(0);
  // }

  return (
    <div className="question-card__container">
      <div className="card-heading__container">
        <h1 className="activity_head head-1 heading">
          {actNum === "1" ? display?.activity_name : display?.activity_name} /
          {displayQuestion[roundsCount]?.round_title}
        </h1>
        <h1 className="question-number head-2 heading">
          Q
          {actNum === "1"
            ? displayQuestion[roundsCount]?.order
            : displayQuestion[roundsCount]?.questions[questionsCount]?.order}
          .
        </h1>
      </div>
      <div className="question-Container">
        <h1
          className="question head-1"
          dangerouslySetInnerHTML={{
            __html:
              actNum === "1"
                ? questionToBold(displayQuestion[questionsCount]?.stimulus)
                : questionToBold(
                    displayQuestion[roundsCount]?.questions[questionsCount]
                      ?.stimulus
                  ),
          }}
        ></h1>
        <h1>{}</h1>
        {/* <GetQuestions
          questions={displayQuestion?.questions[0]?.round_title}
          actNum={actNum}
        /> */}
      </div>
      <div className="answer-block">
        <button
          className="btn-questions"
          onClick={() => displayNewQuestion("true")}
        >
          Correct
        </button>
        <button
          className="btn-questions"
          onClick={() => displayNewQuestion("false")}
        >
          Incorrect
        </button>
      </div>
    </div>
  );
}

function ScoreDisplay() {
  const location = useLocation();
  const displayQuestion = location.state?.displayQuestion;
  const actNum = location.state?.actNum;
  console.log(displayQuestion);
  const [scores, updateScore] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuestionaire();
        updateScore(response.activities[actNum - 1]);
      } catch (error) {}
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="results-container">
        <div className="card results-cards">
          <div className="card-heading">
            <h1 className="head-1 heading">{scores?.activity_name}</h1>
            <h2 className="head-2 heading">Results</h2>
          </div>
          <div className="activity-container">
            {displayQuestion.map((currActivity) => (
              <div key={currActivity?.order} className="activity results">
                <h2>
                  Q
                  {actNum === "1"
                    ? currActivity?.order
                    : currActivity?.questions
                        ?.map((round) =>
                          round?.questions
                            ?.map((question) => question?.order)
                            .join(", ")
                        )
                        .join(", ")}
                </h2>
                <h2>
                  {currActivity?.user_answers?.length
                    ? currActivity?.user_answers
                    : "Wrong"}
                </h2>
                {actNum !== "1" &&
                  currActivity?.questions?.map((round) => (
                    <div key={round?.order} className="nested-round">
                      <h3>{round?.round_title}</h3>
                      {round?.questions?.map((question) => (
                        <div key={question?.order} className="nested-question">
                          <p>
                            Q{question?.order}: {question?.stimulus}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <div className="home_container">
            <Link
              to={{
                pathname: "/",
              }}
              className="activity-link"
            >
              <h2>Home</h2>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
