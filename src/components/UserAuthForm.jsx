import { useState, useRef } from "react";
import { auth, db } from "../../firebaseConfig";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import GoogleButton from "./GoogleSignInButton";
import { Link, useNavigate } from "react-router-dom";

function AuthForm(props) {
  const provider = new GoogleAuthProvider();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const showPasswordRef = useRef(null);
  const linkRef = useRef(null);
  const navigate = useNavigate();

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
      const response = await signInWithPopup(auth, provider);
      setIsLoading(false);
      console.log(response.user);

      // Check if the user already exists in Firestore
      const usersCollection = collection(db, "users");
      const userDoc = doc(usersCollection, response.user.uid);
      const userDocSnapshot = await getDoc(userDoc);

      if (!userDocSnapshot.exists()) {
        // User does not exist, so add them to Firestore
        await setDoc(userDoc, {
          name: response.user.displayName,
          email: response.user.email,
          uid: response.user.uid,
        });
        console.log("New user added to Firestore with ID: ", userDoc.id);
      }

      navigate("/Dashboard");
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
    if (props.register && !isValidPassword(formData.password)) {
      setError("Password is not valid. Please try again.");
      return;
    }
    setIsLoading(true);
    try {
      const response = props.register
        ? await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          )
        : await signInWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
      if (props.register) {
        const usersCollection = collection(db, "users");
        const userDocRef = doc(usersCollection, response.user.uid);
        try {
          await setDoc(userDocRef, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            uid: response.user.uid,
          });
          console.log("Document written with ID: ", userDocRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
      setIsLoading(false);
      console.log(response.user);
      navigate("/Dashboard");
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
    } else if (
      error.includes("user-not-found") ||
      error.includes("wrong-password")
    ) {
      return "Incorrect username or password. Please try again.";
    } else if (error.includes("invalid-email")) {
      return "Please enter a valid email address.";
    } else if (error.includes("too-many-requests")) {
      return "Too many unsuccessful login attempts. Please try again later.";
    } else if (error.includes("user-disabled")) {
      return "User account has been disabled.";
    } else {
      return "An error occurred. Please try again later.";
    }
  };

  const handleBlur = (e) => {
    if (
      e.relatedTarget === showPasswordRef.current ||
      e.relatedTarget === linkRef.current
    ) {
      document.getElementById("pass").focus();
      return;
    }
    setTooltipVisible(false);
  };

  return (
    <div className="container">
      <form className="form-item" onSubmit={handleSubmit}>
        {props.register && (
          <div className="name-input-layout">
            <input
              name="firstName"
              className="input-form name-input"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInput}
            />
            <input
              name="lastName"
              className="input-form name-input"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInput}
            />
          </div>
        )}
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
        {props.register ? (
          <div>
            <span>
              Already have an account?{" "}
              <Link to="/" ref={linkRef} className="link-text">
                Sign In
              </Link>
            </span>
          </div>
        ) : (
          <div>
            <span style={{ color: "#181511" }}>
              Don't have an account?{" "}
              <Link to="/register" ref={linkRef} className="link-text">
                Create One
              </Link>
            </span>
          </div>
        )}

        <span className="or-text">OR</span>
        <GoogleButton
          isLoading={isLoading}
          handleGoogleLogin={handleGoogleLogin}
        />
        {error && <p className="error">{error}</p>}
        <p style={{ color: "#f7f7f7", width: "45vw" }}> </p>
      </form>
    </div>
  );
}

export default AuthForm;
