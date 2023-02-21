import { Outlet, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

function PrivateRoutes() {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  // onAuthStateChanged(auth, (user) => {
  //   setCurrentUser(user);
  //   console.log(currentUser);
  // });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  
  return currentUser ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoutes;
