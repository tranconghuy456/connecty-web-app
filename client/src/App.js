import { BrowserRouter } from "react-router-dom";
import "./App.css";
import MainRoute from "./screens/MainRoute";

function App() {
  return (
    <BrowserRouter>
      <MainRoute />
    </BrowserRouter>
  );
}

export default App;
