import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Import Firestore instance
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import "./Chat.css";

const Chat = ({ partyId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
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
        timestamp: Timestamp.fromDate(new Date()),
      });
      setNewMessage("");
    }
  };

  return (
    <div className="chat">
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className="chat-message">
            <span>{message.text}</span>
            <span className="chat-timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
