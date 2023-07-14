import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { fetchQuestionaire } from "./../Api";
import { GameData, Activity, Round } from "./models/data";
import React from "react";

function Home() {
  // A use state  which stores the value fetched from the Api endpoint
  // then sets the Heading display in JSX
  const [headerValues, setHeader] = useState<GameData>();
  const [activityValues, setActivity] = useState<(Activity | Round)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // An api call to fetch the question
        const response: GameData = await fetchQuestionaire();
        setHeader(response);
        setActivity(response.activities);
      } catch (error) {
        // Handle error appropriately
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-container card">
      <div className="card-heading">
        <h1 className="head-1 heading">{headerValues?.heading} Hello</h1>
        <h2 className="head-2 heading">{headerValues?.name}</h2>
      </div>
      <div className="activity-container">
        {activityValues.map((currActivity) => (
          <div key={currActivity.order} className="activity">
            <Link
              to={{
                pathname: "/questions",
                search: `?actNum=${currActivity.order}`,
              }}
              className="activity-link"
            >
              <h2 className="activty">
                {(currActivity as Activity)?.activity_name}
              </h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
