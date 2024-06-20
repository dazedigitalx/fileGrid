import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import NoteForm from './NoteForm'; // Make sure NoteForm is imported
import Notes from './Notes'; // Make sure Notes is imported

const Dashboard = () => {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [errorNotes, setErrorNotes] = useState('');

    // Function to fetch user's notes
    const fetchNotes = async () => {
        setLoadingNotes(true);
        try {
            const response = await fetch(`http://localhost:5000/api/notes?userId=${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setNotes(data);
            } else {
                setErrorNotes('Failed to fetch notes');
                console.error('Failed to fetch notes:', response.statusText);
            }
        } catch (error) {
            setErrorNotes('Error fetching notes');
            console.error('Error fetching notes:', error);
        } finally {
            setLoadingNotes(false);
        }
    };

    // Effect to fetch notes when component mounts
    useEffect(() => {
        fetchNotes();
    }, []); // Empty dependency array ensures it runs only on mount

    // Function to handle saving a new note
    const handleSaveNote = async (note) => {
        try {
            const response = await fetch('http://localhost:5000/api/notes', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: note.id, title: note.title, content: note.content }),
            });

            if (response.ok) {
                console.log('Note saved successfully');
                fetchNotes(); // Refresh notes after saving
            } else {
                console.error('Failed to save note:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving note:', error);
        }
    };

    return (
        <div>
            <h1>Welcome {user.username}</h1>
            <p>ID: {user.id}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Token: {user.token}</p>

            {/* Render NoteForm for adding new notes */}
            <NoteForm onSave={handleSaveNote} />

            {/* Render Notes component to display existing notes */}
            {loadingNotes ? (
                <p>Loading notes...</p>
            ) : errorNotes ? (
                <p style={{ color: 'red' }}>{errorNotes}</p>
            ) : (
                <Notes user={user} notes={notes} />
            )}
        </div>
    );
};

export default Dashboard;
