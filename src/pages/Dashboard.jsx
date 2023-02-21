import React from "react";
import { getAuth } from "firebase/auth";
import LogOutButton from "../components/LogOutButton";

function Dashboard() {
  const auth = getAuth();

  return (
    <div>
      <span>{auth.currentUser.displayName} </span>
      <LogOutButton />
    </div>
  );
}

export default Dashboard;
