import { db, auth } from "../../firebaseConfig";
import LogOutButton from "../components/LogOutButton";
import { useState, useEffect } from "react";
import { collection, doc, getDoc } from "firebase/firestore";

function Dashboard() {
  const getUserDisplayName = async (uid) => {
    const usersCollection = collection(db, "users");
    const userDoc = doc(usersCollection, uid);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return userData.name;
    } else {
      throw new Error("User document does not exist");
    }
  };

  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const name = await getUserDisplayName(user.uid);
        setDisplayName(name);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      <p>Welcome, {displayName}!</p>
      <LogOutButton/>
    </div>
  );
}

export default Dashboard;
