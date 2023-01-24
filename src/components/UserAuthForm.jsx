import { useState, useRef } from "react";
import { auth } from "../firebaseConfig";
import {
  signInWithRedirect,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import GoogleButton from "./GoogleSignInButton";

function AuthForm(props) {
  const provider = new GoogleAuthProvider();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const showPasswordRef = useRef(null);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  const checkPasswordRequirements = (password) => {
    const requirements = [
      /.{8,}/, // Minimum length of 8 characters
      /[A-Z]/, // Contains an uppercase letter
      /[a-z]/, // Contains a lowercase letter
      /[0-9]/, // Contains a number
      /[!@#\$%\^\&*\)\(+=._-]/, // Contains a special character
    ];

    return requirements.map((regex) => regex.test(password));
  };

  const isValidPassword = (password) => {
    const metRequirements = checkPasswordRequirements(password);
    return metRequirements.every((req) => req);
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

  //todo fix error messages for sign in and add routing
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password");
      return;
    }
    if (props.register && !isValidPassword(formData.password)) {
      setError("Password is not valid. Please try again.");
      return;
    }
    setIsLoading(true);
    try {
      const response = (await props.register)
        ? createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          )
        : signInWithEmailAndPassword(auth, formData.email, formData.password);
      setIsLoading(false);
      console.log(response.user);
    } catch (err) {
      setIsLoading(false);
      setError(getErrorMessage(err.message));
      console.error(err.message);
    }
    // console.log(auth.currentUser.email);
  };

  const getErrorMessage = (error) => {
    if (error.includes("email-already-in-use")) {
      return "The email address is already in use by another account.";
    } else if (error.includes("user-not-found")) {
      return "We couldn't find an account with that email.";
    } else if (error.includes("wrong-password")) {
      return props.register
        ? "Invalid password. Please try again."
        : "Wrong email or password";
    } else if (error.includes("invalid-email")) {
      return "Please enter a valid email address.";
    } else {
      return "An error occurred. Please try again later.";
    }
  };

  const handleBlur = (e) => {
    if (e.relatedTarget === showPasswordRef.current) {
      document.getElementById("pass").focus();
      return;
    }
    setTooltipVisible(false);
  };

  return (
    <div className="container">
      <form className="form-item" onSubmit={handleSubmit}>
        <input
          name="email"
          className="input-form"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleInput}
        />
        <div className="password-input">
          <input
            name="password"
            className="input-form"
            placeholder="Enter password"
            type={passwordVisible ? "text" : "password"}
            value={formData.password}
            onChange={handleInput}
            onFocus={() => setTooltipVisible(true)}
            onBlur={handleBlur}
            id="pass"
            maxLength={50}
          />

          <i
            className="show-password-button"
            onClick={togglePasswordVisibility}
            ref={showPasswordRef}
            id="eyeIcon"
            tabIndex={0}
          >
            {passwordVisible ? <BsEyeSlashFill /> : <BsEyeFill />}
          </i>
        </div>
        {props.register && tooltipVisible && (
          <div className="password-tooltip">
            <p>Password must:</p>
            <ul>
              <li
                className={`requirement ${
                  checkPasswordRequirements(formData.password)[0]
                    ? "requirementMet"
                    : "requirementNotMet"
                }`}
              >
                Be between 8 - 50 characters
              </li>
              <li
                className={`requirement ${
                  checkPasswordRequirements(formData.password)[1]
                    ? "requirementMet"
                    : "requirementNotMet"
                }`}
              >
                Contain at least 1 uppercase letter
              </li>
              <li
                className={`requirement ${
                  checkPasswordRequirements(formData.password)[2]
                    ? "requirementMet"
                    : "requirementNotMet"
                }`}
              >
                Contain at least 1 lowercase letter
              </li>
              <li
                className={`requirement ${
                  checkPasswordRequirements(formData.password)[3]
                    ? "requirementMet"
                    : "requirementNotMet"
                }`}
              >
                Contain at least 1 number
              </li>
              <li
                className={`requirement ${
                  checkPasswordRequirements(formData.password)[4]
                    ? "requirementMet"
                    : "requirementNotMet"
                }`}
              >
                Contain at least 1 special character
              </li>
            </ul>
          </div>
        )}
        <button
          className="account-button"
          disabled={isLoading}
          onMouseDown={handleSubmit}
        >
          {isLoading ? (
            <div className="spinner">
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>
          ) : props.register ? (
            "Sign Up"
          ) : (
            "Sign In"
          )}
        </button>
        <span className="or-text">OR</span>
        <GoogleButton
          isLoading={isLoading}
          handleGoogleLogin={handleGoogleLogin}
        />
        {error && <p className="error">{error}</p>}
        <p style={{ color: "#f7f7f7", width: "50vw" }}> </p>
      </form>
    </div>
  );
}

export default AuthForm;