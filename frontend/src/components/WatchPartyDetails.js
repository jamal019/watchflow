import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, doc, getDoc, setDoc, onSnapshot, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import "./WatchPartyDetails.css";
import Chat from "./Chat"; 

const WatchPartyDetails = () => {
  const { partyId } = useParams();
  const navigate = useNavigate();
  const [partyDetails, setPartyDetails] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [notes, setNotes] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const parties = JSON.parse(localStorage.getItem("watchParties")) || [];
    const party = parties.find((party) => party.id === partyId);
    setPartyDetails(party);

    // Fetch notes from Firestore
    const notesRef = doc(db, "watchParties", partyId);
    getDoc(notesRef).then((docSnap) => {
      if (docSnap.exists()) {
        setNotes(docSnap.data().notes || "");
      }
    });

    // Fetch messages from Firestore
    const messagesRef = collection(db, `watchParties/${partyId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesArray);
    });
    return () => unsubscribe();
  }, [partyId]);

  const handleDeleteParty = () => {
    const parties = JSON.parse(localStorage.getItem("watchParties")) || [];
    const updatedParties = parties.filter((party) => party.id !== partyId);
    localStorage.setItem("watchParties", JSON.stringify(updatedParties));
    navigate("/watchparty");
  };

  const handleSaveNotes = async () => {
    const notesRef = doc(db, "watchParties", partyId);
    await setDoc(notesRef, { notes }, { merge: true });
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const messagesRef = collection(db, `watchParties/${partyId}/messages`);
      await addDoc(messagesRef, {
        text: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    }
  };

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("de-DE", options);
  };

  if (!partyDetails) {
    return <div>Loading...</div>;
  }

  return (
    <section className="details-page watchparty-details-page">
      <div className="modal-details-text">
        <h2>{partyDetails.name}</h2>
        <p>{formatDate(partyDetails.date)} um {partyDetails.time}</p>
        {partyDetails.trailerKey ? (
          <div className="modal-details-video-container">
            <iframe
              className="modal-details-video"
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${partyDetails.trailerKey}`}
              title="YouTube video player"
              autoPlay="1"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p>Trailer not available</p>
        )}
        <p>Movie: {partyDetails.movieTitle}</p>
        <p>{partyDetails.movieOverview}</p>
        <h3>Where to watch</h3>
        <div className="providers">
          {partyDetails.provider && partyDetails.provider.flatrate && partyDetails.provider.flatrate.length > 0 ? (
            <>
              <ul>
                {partyDetails.provider.flatrate.map((prov) => (
                  <li key={prov.provider_id}>
                    <a target="_blank" href={partyDetails.provider.link} rel="noreferrer">
                      <img
                        src={`https://image.tmdb.org/t/p/w45${prov.logo_path}`}
                        alt={prov.provider_name}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No providers available</p>
          )}
        </div>
        <p>Participants: {partyDetails.participants ? partyDetails.participants.join(", ") : "No participants yet"}</p>

        <div className="button-container">
          <button onClick={() => setShowConfirmDelete(true)} className="watchpartydetails-button">Delete Watch Party</button>
          <button onClick={() => setShowConfirmDelete(true)} className="watchpartydetails-button">Invite to Watch Party</button>
        </div>

        {showConfirmDelete && (
          <div className="confirm-delete-dialog">
            <p>Do you really want to delete this Watch Party?</p>
            <button onClick={handleDeleteParty} className="confirm-button">Yes</button>
            <button onClick={() => setShowConfirmDelete(false)} className="cancel-button">No</button>
          </div>
        )}

        <div className="notes-section">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter your notes here..."
          ></textarea>
          <button onClick={handleSaveNotes} className="save-notes-button">Save Notes</button>
        </div>

        <Chat partyId={partyId} />
      </div>
    </section>
  );
};

export default WatchPartyDetails;
