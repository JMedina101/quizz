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

function Questions() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const actNum = searchParams.get("actNum");

  const navigate = useNavigate();

  const [displayQuestion, updateQuestion] = useState([]);
  const [questionsCount, updateQCounter] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuestionaire();
        updateQuestion(response.activities[actNum - 1]);
      } catch (error) {}
    };
    fetchData();
  }, []);

  const questionToBold = (question) => {
    if (question) {
      return question.replace(/\*(.*?)\*/g, "<span class= bolder>$1</span>");
    }
    return "";
  };

  const displayNewQuestion = (action) => {
    const isCorrect = displayQuestion.questions[questionsCount].is_correct;

    if (isCorrect === (action === "true")) {
      const updatedQuestion = { ...displayQuestion.questions[questionsCount] };
      // Update the necessary properties of the updatedQuestion object
      updatedQuestion.user_answers.push("Correct");

      console.log(updatedQuestion);
      const updatedQuestions = [...displayQuestion.questions];
      updatedQuestions[questionsCount] = updatedQuestion;

      const updatedDisplayQuestion = {
        ...displayQuestion,
        questions: updatedQuestions,
      };
      updateQuestion(updatedDisplayQuestion);
    }
    updateQCounter(questionsCount + 1);
    console.log(displayQuestion);

    if (questionsCount === displayQuestion.questions.length - 1) {
      navigate("/scores", {
        state: {
          displayQuestion: displayQuestion.questions,
          actNum: actNum,
        },
      });
    }
  };

  return (
    <div className="question-card__container">
      <div className="card-heading__container">
        <h1 className="activity_head head-1 heading">
          {displayQuestion?.activity_name}
        </h1>
        <h1 className="question-number head-2 heading">
          Q{displayQuestion?.questions?.[questionsCount]?.order}.
        </h1>
      </div>
      <div className="question-Container">
        <h1
          className="question head-1"
          dangerouslySetInnerHTML={{
            __html: questionToBold(
              displayQuestion?.questions?.[questionsCount]?.stimulus
            ),
          }}
        ></h1>
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
            <h1 className="head-1 heading">{scores?.activity_name} </h1>
            <h2 className="head-2 heading">Results</h2>
          </div>
          <div className="activity-container">
            {displayQuestion.map((currActivity) => (
              <div key={currActivity?.order} className="activty results">
                <h2>Q{currActivity?.order} </h2>
                <h2>
                  {currActivity.user_answers.length
                    ? currActivity?.user_answers
                    : "Wrong"}
                </h2>
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
              <h2>Home </h2>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
