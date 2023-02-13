import AuthPage from "./pages/AuthPage";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage register={false} />} />
      <Route path="/Register" element={<AuthPage register={true} />} />
    </Routes>
  );
}

export default App;
