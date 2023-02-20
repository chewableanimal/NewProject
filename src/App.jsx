import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import { Route, Routes } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";
function App() {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/Dashboard" element={<Dashboard />} />
      </Route>
      <Route path="/" element={<AuthPage register={false} />} />
      <Route path="/Register" element={<AuthPage register={true} />} />
    </Routes>
  );
}

export default App;

// import { useEffect, useState } from "react";
// import { Route, Routes } from "react-router-dom";
// import { auth } from "../firebaseConfig";
// import Dashboard from "./pages/Dashboard";

// function App() {
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setCurrentUser(user);
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   return (
//     <Routes>
//       <Route index element={HomePage} />

//       <Route path="/SignIn" element={<AuthPage register={false} />} />
//       <Route path="/SignUp" element={<AuthPage register={true} />} />
//       <Route path="/Dashboard" element={Dashboard} />
//     </Routes>
//   );
// }

// export default App;
