import { Outlet, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

function PrivateRoutes() {
  const [currentUser, setCurrentUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,(user) => {
      setCurrentUser(user);
      console.log(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  console.log(currentUser);

  return currentUser ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoutes;
