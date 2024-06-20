import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext';
import './Chat.css'; // Ensure to import your CSS file for styling

const Chat = ({ user }) => {
    const [chatMessages, setChatMessages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const fetchChatMessages = async () => {
        setLoading(true);
        setError(null); // Clear previous error
        try {
            const response = await fetch('http://localhost:5000/api/chat/', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Filter messages to display only those from the authenticated user
                const userMessages = data.filter(message => message.userId === user.id);
                setChatMessages(userMessages);
            } else {
                setError(`Failed to fetch chat messages: ${response.statusText}`);
            }
        } catch (error) {
            setError(`Error fetching chat messages: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChatMessages();
    }, []); // Only run once on component mount

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/chat/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    content: newMessage,
                    created_at: new Date().toISOString(), // Example timestamp
                }),
            });

            if (response.ok) {
                console.log('Message sent successfully');
                const sentMessage = {
                    id: Date.now(), // Assuming the server returns an ID, use that instead
                    content: newMessage,
                    userId: user.id,
                    created_at: new Date().toISOString(),
                };
                setChatMessages([...chatMessages, sentMessage]); // Update state with new message
                setNewMessage(''); // Clear input after sending
            } else {
                console.error('Failed to send message:', response.statusText);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // const handleDeleteMessage = async (messageId) => {
    //     try {
    //         const response = await fetch(`http://localhost:5000/api/chat/messages/${messageId}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Authorization': `Bearer ${user.token}`,
    //             },
    //         });

    //         if (response.ok) {
    //             console.log('Message deleted successfully');
    //             // Remove the deleted message from state
    //             const updatedMessages = chatMessages.filter(message => message.id !== messageId);
    //             setChatMessages(updatedMessages);
    //         } else {
    //             console.error('Failed to delete message:', response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('Error deleting message:', error);
    //     }
    // };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chat-container">
            <div className="messages-container">
                {loading ? (
                    <p>Loading chat messages...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    chatMessages.map(message => (
                        <div key={message.id} className="message">
                            <div className="message-content">{message.content}</div>
                            <div className="message-info">
                                <span className="message-user-id">From User ID: {message.userId}</span>
                                <span className="message-timestamp">Timestamp: {message.created_at}</span>
                                {/* <button onClick={() => handleDeleteMessage(message.id)} className="delete-button">Delete</button> */}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="message-input"
                />
                <button onClick={handleSendMessage} className="send-button">Send</button>
            </div>
        </div>
    );
};

export default Chat;
