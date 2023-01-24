import React from "react";
import "../App.css"

function GoogleButton(props) {
  return (
    <button
      className="account-button"
      disabled={props.isLoading}
      onMouseDown={props.handleGoogleLogin}
    >
      {props.isLoading ? (
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      ) : (
        "Continue With Google"
      )}
    </button>
  );
}

export default GoogleButton;
