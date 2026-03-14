import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const API_URL = "http://localhost:5000/api/links";

  // Fetching data from Cloud MongoDB
  const fetchLinks = async () => {
    try {
      const res = await axios.get(API_URL);
      setLinks(res.data);
    } catch (err) {
      console.error("Backend offline. Please run 'node server.js' in backend terminal.");
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const addLink = async (e) => {
    e.preventDefault();
    if (!title || !url) return alert("Please fill both Title and URL!");
    try {
      await axios.post(API_URL, { title, url });
      fetchLinks(); // Refresh from Cloud
      setTitle(''); setUrl('');
      setIsPanelOpen(false);
    } catch (err) {
      alert("Error saving data to Cloud.");
    }
  };

  const deleteLink = async (id) => {
    if (window.confirm("Delete this directory?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchLinks();
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  return (
    <div className="App">
      {/* Animated Background Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      {/* Sidebar Add Trigger */}
      <div className="add-trigger" onClick={() => setIsPanelOpen(true)} title="Add Directory">
        <i className="fas fa-plus"></i>
      </div>

      {/* Side Drawer Panel */}
      <div className={`side-panel ${isPanelOpen ? 'open' : ''}`}>
        <div className="panel-header">
          <h3>Management Console</h3>
          <button className="close-btn" onClick={() => setIsPanelOpen(false)}>×</button>
        </div>
        <form onSubmit={addLink} className="panel-form">
          <input type="text" placeholder="Folder Title (e.g. Portfolio)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="text" placeholder="Destination URL" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button type="submit" className="save-btn">SAVE DIRECTORY</button>
        </form>
      </div>

      {/* Main UI Container */}
      <div className="glass-card">
        <div className="main-container">
          <div className="header">
            {/* Click to Zoom Profile Photo */}
            <div className="profile-ring" onClick={() => setIsImageOpen(true)}>
              <img src="/profile.jpg" alt="Navneet" className="profile-img" onError={(e) => e.target.src = "https://via.placeholder.com/150"} />
            </div>
            <h1 className="profile-name">Navneet Kumar Saini</h1>
            <p className="status-tag">FULL STACK DEVELOPER | AI & ML ENGINEER</p>
            
            <div className="about-section">
              <p>Passionate about crafting intelligent digital ecosystems. Specializing in MERN Stack, AI models, and modern UI architectures.</p>
            </div>
          </div>

          <div className="folders-grid">
            {links.map(link => (
              <div key={link._id} className="folder-card-wrapper">
                <a href={link.url} target="_blank" rel="noreferrer" className="folder-card">
                  <div className="folder-icon-box">
                    <i className={link.title.toLowerCase().includes('github') ? "fab fa-github" : "fas fa-folder"}></i>
                  </div>
                  <h3>{link.title}</h3>
                  <span>Open Folder</span>
                </a>
                <button onClick={() => deleteLink(link._id)} className="mini-delete-btn">×</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Image Viewer (Modal) */}
      {isImageOpen && (
        <div className="modal-overlay" onClick={() => setIsImageOpen(false)}>
          <div className="modal-content">
            <img src="/profile.jpg" alt="Profile Full View" className="zoomed-img" />
            <p className="close-hint">Click anywhere to close</p>
          </div>
        </div>
      )}

      {/* Panel Overlay */}
      {isPanelOpen && <div className="overlay" onClick={() => setIsPanelOpen(false)}></div>}
    </div>
  );
}

export default App;