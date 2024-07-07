import React, { useState, useEffect } from 'react';
import { rtdb } from '../services/firebase';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ [key: string]: string }>({});
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const chatRef = rtdb.ref('chats');
    chatRef.on('child_added', snapshot => {
      setMessages(prevMessages => ({
        ...prevMessages,
        [snapshot.key!]: snapshot.val()
      }));
    });
  }, []);

  const sendMessage = () => {
    const chatRef = rtdb.ref('chats');
    chatRef.push(newMessage);
    setNewMessage('');
  };

  return (
    <div>
      <div>
        {Object.keys(messages).map(key => (
          <div key={key}>{messages[key]}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
