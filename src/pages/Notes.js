import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Notes.css";

const API_BASE = "https://notes-backend-vug3.onrender.com"; // Deployed backend URL

const Notes = () => {
  const navigate = useNavigate();
  const user_id = Number(localStorage.getItem("user_id"));
  const username = localStorage.getItem("user_name") || "User";

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user_id) {
      navigate("/login");
    }
  }, [user_id, navigate]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogout, setShowLogout] = useState(false);

  const fetchNotes = async () => {
    if (!user_id) return; 
    try {
      const res = await axios.get(`${API_BASE}/notes/${user_id}`);
      setNotes(res.data);
      setFilteredNotes(res.data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while fetching notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [user_id]);

  // Live search whenever searchQuery or notes change
  useEffect(() => {
    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [searchQuery, notes]);

  const addOrUpdateNote = async () => {
    if (!title || !content) return alert("Enter title and content");

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/notes/${editingId}`, { title, content });
        alert("Note updated successfully");
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE}/notes`, { title, content, user_id });
        alert("Note added successfully");
      }
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while adding/updating the note");
    }
  };

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  const deleteNote = async (note_id) => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE}/notes/${note_id}`);
      alert("Note deleted successfully");
      fetchNotes();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting the note");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="notes-container">
      {/* Top bar with username and search */}
      <div className="notes-top-bar">
        <div className="user-name" onClick={() => setShowLogout(!showLogout)}>
          {username} ▼
          {showLogout && (
            <div className="logout-option" onClick={handleLogout}>
              Logout
            </div>
          )}
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <h2>{editingId ? "Update Note" : "Add Note"}</h2>
      <div className="notes-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />
        <button onClick={addOrUpdateNote}>{editingId ? "Update" : "Add"} Note</button>
      </div>

      <h3>All Notes:</h3>
      {filteredNotes.length === 0 && <p>No notes found.</p>}
      {filteredNotes.map((note) => (
        <div key={note.id} className="note-card">
          <h4>{note.title}</h4>
          <p>{note.content}</p>
          <p>
            Share URL:{" "}
            <a
              href={`${API_BASE}${note.share_url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {note.share_url}
            </a>
          </p>
          <button onClick={() => editNote(note)}>Edit</button>
          <button onClick={() => deleteNote(note.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Notes;
