import { BrowserRouter } from "react-router-dom";
import "./App.css";
import MainRoute from "./screens/MainRoute";
import { Suspense } from "react";
import Loading from "./components/Loading";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <MainRoute />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
