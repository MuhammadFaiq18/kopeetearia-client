import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Content from "./components/Content";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
