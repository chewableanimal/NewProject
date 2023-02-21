import { useState } from "react";
import "../App.css";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
function LogOutButton() {
  const navigate = useNavigate();
  const handleLogOut = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signOut(auth);
      navigate("/");
      console.log("User has been logged out");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  return (
    <button
      className="account-button"
      disabled={isLoading}
      onMouseDown={handleLogOut}
    >
      {isLoading ? (
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      ) : (
        "Log Out"
      )}
    </button>
  );
}

export default LogOutButton;
