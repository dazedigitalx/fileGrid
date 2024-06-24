import React, { useState, useEffect } from 'react';
import './Chat.css'; // Import or adjust styles as needed
import { useAuth } from '../AuthContext'; // Adjust the path based on your context

const Chat = ({ channel }) => {
    const { user } = useAuth(); // Assuming useAuth provides user info including token
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!channel || !user || !user.token) return; // Check if channel and user token exist

            try {
                const response = await fetch(`http://localhost:5000/api/channels/${channel.id}/messages`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`, // Include user token in the Authorization header
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch messages: ${response.statusText}`);
                }

                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error('Error fetching messages:', error);
                setError(`Error fetching messages: ${error.message}`);
            }
        };

        fetchMessages(); // Fetch messages when the component mounts or when channel changes
    }, [channel, user]);

    const handleSendMessage = async (e) => {
      e.preventDefault();
  
      try {
          if (!user || !user.token) {
              throw new Error('User not authenticated or token not available');
          }
  
          if (!channel) {
              throw new Error('No active channel selected');
          }
  
          const response = await fetch('http://localhost:5000/api/messages/send', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${user.token}`,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  channelId: channel.id,
                  message: newMessage,
                  created_at: new Date().toISOString(), // Example field if required by API
              }),
          });
  
          if (!response.ok) {
              throw new Error(`Failed to send message: ${response.statusText}`);
          }
  
          const sentMessage = await response.json();
          setMessages(prevMessages => [...prevMessages, sentMessage]);
          setNewMessage(''); // Clear newMessage state after sending
      } catch (error) {
          console.error('Error sending message:', error); // Log error to console
          setError(`Error sending message: ${error.message}`);
      }
  };
  
  
  

    return (
        <div className="chat">
            <h2>Channel: {channel.name}</h2>
            {error && <div className="error">Error: {error}</div>}
            <div className="messages">
                {messages.map(message => (
                    <div key={message.id}>
                        <strong>{message.senderId}</strong>: {message.content}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage}>
                <label>
                    New Message:
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
