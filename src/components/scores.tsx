import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, Question, Round } from "../../public/models/data";
import { fetchQuestionaire } from "../Api";
import React from "react";

function ScoreDisplay() {
  const location = useLocation();
  const displayQuestion = location.state?.displayQuestion as
    | Question[]
    | undefined;

  const actNum = location.state?.actNum;

  const activityScore1 = location.state?.Activity1Counter;
  const otherActivity = location.state?.otherActivity;

  const [scores, displayScores] = useState<Activity | Round | null>(null);

  console.log(displayQuestion);
  console.log(activityScore1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuestionaire();
        displayScores(response.activities[actNum - 1]);
      } catch (error) {}
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="results-container">
        <div className="card results-cards">
          <div className="card-heading">
            <h1 className="head-1 heading">
              {(scores as Activity)?.activity_name}
            </h1>
            <h2 className="head-2 heading">Results</h2>
            <h2 className="heading">
              Score: {actNum === 1 ? activityScore1 : otherActivity}
            </h2>
          </div>

          <div className="result-cards activity-container">
            {actNum === 1
              ? displayQuestion?.map((currQ: Question) => (
                  <div className="activty results" key={currQ?.order}>
                    <h2>Q{currQ?.order}</h2>
                    {currQ?.user_answers.length ? (
                      <h2 className="">{currQ?.user_answers}</h2>
                    ) : (
                      <h2>Wrong</h2>
                    )}
                  </div>
                ))
              : Object.values(displayQuestion as Round[]).map(
                  (eachQ: Round) => (
                    <div key={eachQ?.round_title}>
                      <div className="activty round-container">
                        <h2 className="round-results">{eachQ?.round_title}</h2>
                      </div>
                      {eachQ.questions.map((fetchedQ: Question) => (
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
                  )
                )}
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

export default ScoreDisplay;
