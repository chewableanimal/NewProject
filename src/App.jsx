import { useState } from "react";
import "./App.css";
import { auth } from "./firebaseConfig";
import {
  signInWithRedirect,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {BsEyeFill,BsEyeSlashFill} from 'react-icons/bs'

function App() {
  const provider = new GoogleAuthProvider();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await signInWithRedirect(auth, provider);
      setIsLoading(false);
      console.log(response.user);
    } catch (err) {
      setIsLoading(false);
      setError(getErrorMessage(err.message));
      console.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password");
      return;
    }
    setIsLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      setIsLoading(false);
      console.log(response.user);
    } catch (err) {
      setIsLoading(false);
      setError(getErrorMessage(err.message));
      console.error(err.message);
    }
    console.log(auth.currentUser.email);
  };

  function getErrorMessage(error) {
    if (error.includes("email-already-in-use")) {
      return "The email address is already in use by another account.";
    } else if (error.includes("user-not-found")) {
      return "We couldn't find an account with that email.";
    } else if (error.includes("wrong-password")) {
      return "Invalid password. Please try again.";
    } else if (error.includes("invalid-email")) {
      return "Please enter a valid email address.";
    } else {
      return "An error occurred. Please try again later.";
    }
  }

  return (
    <div className="container">
      <form className="form-item" onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Enter email"
          type="email"
          value={formData.email}
          onChange={handleInput}
        />
        <div className="password-input">
          <input
            name="password"
            // className="password-input"
            placeholder="Enter password"
            type={passwordVisible ? "text" : "password"}
            value={formData.password}
            onChange={handleInput}
          />
          <i
            className="show-password-button"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? <BsEyeSlashFill /> : <BsEyeFill />}
          </i>
        </div>
        <button className="account-button" type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="spinner">
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>
          ) : (
            "Create Account"
          )}
        </button>
        <button
          className="account-button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="spinner">
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>
          ) : (
            "Sign In With Google"
          )}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default App;
