import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Import Firestore instance and auth
import { collection, addDoc, getDoc, doc, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import "./Chat.css";

const Chat = ({ partyId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("Unknown User");

  useEffect(() => {
    // Get the current user's username
    const fetchUsername = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        }
      }
    };

    fetchUsername();

    const messagesRef = collection(db, `watchParties/${partyId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesArray = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(data.timestamp)
        };
      });
      setMessages(messagesArray);
    });
    return () => unsubscribe();
  }, [partyId]);

  const sendMessage = async () => {
    if (newMessage.trim() !== "") {
      const messagesRef = collection(db, `watchParties/${partyId}/messages`);
      await addDoc(messagesRef, {
        text: newMessage,
        username: username,
        timestamp: Timestamp.fromDate(new Date()),
      });
      setNewMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat">
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className="chat-message">
            <p className="chat-username"><strong>{message.username}</strong></p>
            <br/>
            <p>{message.text}</p>
            <p className="chat-timestamp">{new Date(message.timestamp).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
