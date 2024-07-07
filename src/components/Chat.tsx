import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onChildAdded, DataSnapshot } from 'firebase/database';
import { app } from '../firebase';

interface Message {
  id: string;
  text: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const db = getDatabase(app);
    const chatRef = ref(db, 'chats');

    const unsubscribe = onChildAdded(chatRef, (snapshot: DataSnapshot) => {
      setMessages(prevMessages => [
        ...prevMessages,
        { id: snapshot.key as string, text: snapshot.val() as string }
      ]);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const db = getDatabase(app);
    const chatRef = ref(db, 'chats');
    push(chatRef, newMessage);
    setNewMessage('');
  };

  return (
    <div>
      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {messages.map(message => (
          <div key={message.id}>{message.text}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;