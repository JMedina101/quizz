import Home from "./components/home.tsx";
import ScoreDisplay from "./components/scores.tsx";
import Questions from "./components/questions.tsx";

import { Route, Routes } from "react-router-dom";

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
export default App;
