import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, doc, getDoc, setDoc, onSnapshot, addDoc, serverTimestamp, query, orderBy, deleteDoc } from "firebase/firestore";
import "./WatchPartyDetails.css";
import Chat from "./Chat"; 
import debounce from 'lodash/debounce';

const WatchPartyDetails = () => {
  const { partyId } = useParams();
  const navigate = useNavigate();
  const [partyDetails, setPartyDetails] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const modalRef = useRef(null);

  useEffect(() => {
    const fetchPartyDetails = async () => {
      const partyRef = doc(db, "watchParties", partyId);
      const partySnap = await getDoc(partyRef);
      if (partySnap.exists()) {
        setPartyDetails(partySnap.data());
        console.log("Party details fetched successfully:", partySnap.data());
      } else {
        console.error("No such document!");
      }
    };

    fetchPartyDetails();

    const notesRef = doc(db, "watchParties", partyId);
    getDoc(notesRef).then((docSnap) => {
      if (docSnap.exists()) {
        setNotes(docSnap.data().notes || "");
      }
    });

    const messagesRef = collection(db, `watchParties/${partyId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesArray);
    });
    return () => unsubscribe();
  }, [partyId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowInviteModal(false);
      }
    };
    
    if (showInviteModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInviteModal]);

  const handleDeleteParty = async () => {
    const partyRef = doc(db, "watchParties", partyId);
    await deleteDoc(partyRef);
    navigate("/watchparty");
  };

  const saveNotes = debounce(async (newNotes) => {
    const notesRef = doc(db, "watchParties", partyId);
    await setDoc(notesRef, { notes: newNotes }, { merge: true });
  }, 1000); // Adjust the debounce delay as needed

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    saveNotes(newNotes);
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

  const handleInviteEmailChange = (e) => {
    setInviteEmail(e.target.value);
  };

  const handleSendInvite = () => {
    console.log(`Invitation sent to ${inviteEmail}`);
    setInviteEmail("");
    setShowInviteModal(false);
  };

  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}/watchparty/${partyId}/invite`;
    navigator.clipboard.writeText(inviteLink)
      .then(() => alert("Einladungslink kopiert!"))
      .catch((err) => console.error("Fehler beim Kopieren des Links: ", err));
  };

  const handleShareLink = () => {
    const inviteLink = `${window.location.origin}/watchparty/${partyId}/invite`;
    if (navigator.share) {
      navigator.share({
        title: 'Einladung zur Watch Party',
        url: inviteLink
      }).then(() => {
        console.log("Link erfolgreich geteilt");
      }).catch((err) => console.error("Fehler beim Teilen des Links: ", err));
    } else {
      alert("Teilen wird von Ihrem Browser nicht unterstützt");
    }
  };

  useEffect(() => {
    const checkAndAddParticipant = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const partyRef = doc(db, "watchParties", partyId);
      const partySnap = await getDoc(partyRef);
      if (partySnap.exists()) {
        const partyData = partySnap.data();
        if (!partyData.participants[user.uid]) {
          await setDoc(partyRef, {
            participants: {
              [user.uid]: {
                username: user.displayName || "Unknown User",
                role: "participant"
              }
            }
          }, { merge: true });
          console.log("User added as participant");
          setPartyDetails({ ...partyData, participants: { ...partyData.participants, [user.uid]: { username: user.displayName || "Unknown User", role: "participant" } } });
        }
      }
    };

    checkAndAddParticipant();
  }, [partyId]);

  if (!partyDetails) {
    return <div>Loading...</div>;
  }

  return (
    <section className="details-page watchparty-details-page">
      <div className="modal-details-text">
        <h2>{partyDetails.name}</h2>
        <h3>Movie: {partyDetails.movieTitle}</h3>
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
        <p>{partyDetails.movieOverview}</p>
        <h4>Party Time: {formatDate(partyDetails.date)} at {partyDetails.time}</h4>
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
        <h3>Participants:</h3>
        <ul>
          {partyDetails.participants && Object.values(partyDetails.participants).map((participant, index) => (
            <li key={index}>
              {participant.username}
            </li>
          ))}
        </ul>
        <div className="button-container">
          <button onClick={() => setShowInviteModal(true)} className="watchpartydetails-button">Invite to Watch Party</button>
          <button onClick={() => setShowConfirmDelete(true)} className="watchpartydetails-button">Delete Watch Party</button>
        </div>
        {showConfirmDelete && (
          <div className="confirm-delete-dialog">
            <p>Do you really want to delete this Watch Party?</p>
            <button onClick={handleDeleteParty} className="confirm-button">Yes</button>
            <button onClick={() => setShowConfirmDelete(false)} className="cancel-button">No</button>
          </div>
        )}
        {showInviteModal && (
          <div className="invite-modal">
            <div className="invite-modal-content" ref={modalRef}>
              <span className="close" onClick={() => setShowInviteModal(false)}>&times;</span>
              <h2>Invite to Watch Party</h2>
              <input 
                type="email" 
                placeholder="Enter email address" 
                value={inviteEmail}
                onChange={handleInviteEmailChange}
              />
              <button onClick={handleSendInvite} className="invite-button">Send Invite</button>
              <button onClick={handleCopyLink} className="copy-link-button">Copy Invite Link</button>
              <button onClick={handleShareLink} className="share-link-button">Share Invite Link</button>
            </div>
          </div>
        )}
        <div className="notes-section">
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Enter your notes here..."
          ></textarea>
        </div>
        <Chat partyId={partyId} />
      </div>
    </section>
  );
};

export default WatchPartyDetails;
