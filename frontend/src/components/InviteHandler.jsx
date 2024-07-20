import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const InviteHandler = () => {
  const { partyId } = useParams();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const checkAndAddParticipant = async () => {
      if (loading) return; // Warten bis der Auth-State geladen ist
      if (!user) {
        alert("You must be logged in to join the watch party.");
        navigate("/");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const username = userSnap.exists() ? userSnap.data().username : "Unknown User";

      const partyRef = doc(db, "watchParties", partyId);
      const partySnap = await getDoc(partyRef);
      if (partySnap.exists()) {
        const partyData = partySnap.data();
        if (!partyData.participants[user.uid]) {
          await setDoc(partyRef, {
            participants: {
              ...partyData.participants,
              [user.uid]: {
                username: username,
                role: "participant"
              }
            }
          }, { merge: true });
          console.log("User added as participant");
        }
        navigate(`/watchparty/${partyId}`);
      } else {
        console.error("No such document!");
        navigate("/watchparty");
      }
    };

    checkAndAddParticipant();
  }, [partyId, navigate, user, loading]);

  return <div>Joining watch party...</div>;
};

export default InviteHandler;
