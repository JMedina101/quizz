import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

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
    <div className="home-container card">
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

// function RoundStartModal({ roundNumber }) {
//   return (
//     // <div className="round-start-prompt">
//     //   <h2>Round {roundNumber} is starting!</h2>
//     //   <button onClick={onStartRound}>Start Round</button>
//     // </div>
//   );
// }

function Questions() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const actNum = searchParams.get("actNum");

  const navigate = useNavigate();

  const [displayQuestion, updateQuestion] = useState([]);
  const [questionsCount, updateQCounter] = useState(0);
  const [roundsCount, setRoundsCount] = useState(0);
  const [display, setDisplays] = useState([]);
  const [showRoundStartPrompt, setShowRoundStartPrompt] = useState(true);

  const [activityScore1, setActivityScore1] = useState(0);
  const Activity1Counter = useRef(0);
  const otherActivity = useRef(0);

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

  useEffect(() => {
    if (roundsCount > 0) {
      setShowRoundStartPrompt(true);
    }
  }, [roundsCount]);

  useEffect(() => {
    const totalDuration = 3000; // Animation delay (5000 milliseconds) + Animation duration (3000 milliseconds)

    const timeout = setTimeout(() => {
      setShowRoundStartPrompt(false);
    }, totalDuration);

    return () => clearTimeout(timeout);
  }, [roundsCount]);

  // const handleStartRound = () => {
  //   setShowRoundStartPrompt(false);
  // };

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
        Activity1Counter.current += 1;

        console.log(Activity1Counter);
      } else {
        const updatedQuestions = [...displayQuestion];
        updatedQuestions[roundsCount].questions[questionsCount] =
          updatedQuestion;
        updateQuestion(updatedQuestions);
        otherActivity.current += 1;
      }
    }

    updateQCounter(questionsCount + 1);

    if (actNum === "1") {
      if (questionsCount === qTotal - 1) {
        navigate("/scores", {
          state: {
            displayQuestion: displayQuestion,
            actNum: actNum,
            Activity1Counter: Activity1Counter,
          },
        });

        console.log(Activity1Counter);
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
            otherActivity: otherActivity,
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
    <>
      {showRoundStartPrompt && actNum !== "1" ? (
        <div className="question-card__container round-start-prompt ">
          <div className="card-heading__container">
            <h2 className="activity_head head-1 heading">
              {display?.activity_name}
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
              {actNum === "1" ? display?.activity_name : display?.activity_name}
              {actNum !== "1" &&
                ` / ${displayQuestion[roundsCount]?.round_title}`}
            </h1>
            <h1 className="question-number head-2 heading">
              Q
              {actNum === "1"
                ? displayQuestion[questionsCount]?.order
                : displayQuestion[roundsCount]?.questions[questionsCount]
                    ?.order}
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
      )}
    </>
  );
}

function ScoreDisplay() {
  const location = useLocation();
  const displayQuestion = location.state?.displayQuestion;
  const actNum = location.state?.actNum;

  const activityScore1 = location.state?.Activity1Counter;
  const otherActivity = location.state?.otherActivity;

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

  // Object.values(displayQuestion).forEach((eachQ) => {
  //   eachQ.questions.forEach((fetchedQ) => {
  //     console.log(fetchedQ.stimulus);
  //   });
  // });

  return (
    <>
      <div className="results-container">
        <div className="card results-cards">
          <div className="card-heading">
            <h1 className="head-1 heading">{scores?.activity_name}</h1>
            <h2 className="head-2 heading">Results</h2>
            <h2 className="heading">
              Score:{" "}
              {actNum === "1" ? activityScore1.current : otherActivity.current}
            </h2>
          </div>

          <div className="result-cards activity-container">
            {actNum === "1"
              ? displayQuestion.map((currQ) => (
                  <div className="activty results" key={currQ?.order}>
                    <h2>Q{currQ?.order}</h2>

                    {currQ?.user_answers.length ? (
                      <h2 className="">{currQ?.user_answers}</h2>
                    ) : (
                      <h2>Wrong</h2>
                    )}
                  </div>
                ))
              : Object.values(displayQuestion).map((eachQ) => (
                  <div key={eachQ?.round_title}>
                    <div className="activty round-container">
                      <h2 className="round-results">{eachQ?.round_title}</h2>
                    </div>
                    {eachQ.questions.map((fetchedQ) => (
                      <div className="activty results" key={fetchedQ?.order}>
                        <h2>{fetchedQ?.order}</h2>
                        {fetchedQ?.user_answers.length ? (
                          <h2>{fetchedQ?.user_answers}</h2>
                        ) : (
                          <h2>Wrong</h2>
                        )}
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
