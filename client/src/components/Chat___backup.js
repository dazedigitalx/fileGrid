import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const Chat = ({ channel }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch messages for the current channel
  const fetchMessages = async () => {
    setLoading(true);
    setError(null);

    try {
      if (channel && user) {
        const response = await fetch(`http://localhost:5000/api/channels/${channel.id}/messages`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }

        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      setError(`Error fetching messages: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages when channel changes
  useEffect(() => {
    fetchMessages();
  }, [channel, user]);

  // Function to handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('User not logged in');
      return;
    }

    try {
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
          userId: user.id,
          channelId: channel.id,
          message: newMessage,
          created_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const sentMessage = await response.json();
      setMessages(prevMessages => [...prevMessages, sentMessage]); // Update messages state correctly
      setNewMessage(''); // Clear newMessage state after sending
    } catch (error) {
      setError(`Error sending message: ${error.message}`);
    }
  };

  if (loading) {
    return <div>Loading messages...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Channel: {channel.name}</h2>
      <div>
        {messages.map(message => (
          <div key={message.id}>
    <strong>{message.senderId}</strong>: {message.content} {/* Use "content" here */}
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
