import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  
  // --- 1. STATES (Data Store karne ke liye) ---
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const API_URL = "http://localhost:5000/api/links";


  // --- 2. SMART LOGIC (Auto Icon Detection) ---
  const getIcon = (title) => {
    const t = title.toLowerCase();

    if (t.includes('github'))    return "fab fa-github";
    if (t.includes('linkedin'))  return "fab fa-linkedin";
    if (t.includes('instagram')) return "fab fa-instagram";
    if (t.includes('youtube'))   return "fab fa-youtube";
    if (t.includes('leetcode'))  return "fas fa-code";
    
    return "fas fa-folder"; // Default Icon
  };


  // --- 3. FUNCTIONS (API Calls) ---
  const fetchLinks = async () => {
    try {
      const res = await axios.get(API_URL);
      setLinks(res.data);
    } catch (err) {
      console.error("Backend Error");
    }
  };

  useEffect(() => {
    fetchLinks();
    
    // Welcome message show karein 1 sec baad
    setTimeout(() => setShowWelcome(true), 1000);
    
    // 6 sec baad hide kar dein
    setTimeout(() => setShowWelcome(false), 6000);
  }, []);


  const addLink = async (e) => {
    e.preventDefault();
    
    if (!title || !url) return alert("Please fill both fields!");

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http')) cleanUrl = `https://${cleanUrl}`;

    try {
      await axios.post(API_URL, { title, url: cleanUrl });
      fetchLinks();
      setTitle(''); 
      setUrl('');
      setIsPanelOpen(false);
    } catch (err) {
      alert("Server error!");
    }
  };


  const deleteLink = async (id) => {
    if (window.confirm("Delete this folder?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchLinks();
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };


  // --- 4. UI STRUCTURE ---
  return (
    <div className="App">
      
      {/* Background Animated Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      {/* Welcome Message Popup */}
      {showWelcome && (
        <div className="welcome-toast">
          <div className="toast-icon">👋</div>
          <div className="toast-text">
            <h4>Welcome to my Portfolio!</h4>
            <p>I'm Navneet, a CS Student & Learner.</p>
          </div>
        </div>
      )}

      {/* Add Button Trigger */}
      <div className="add-trigger" onClick={() => setIsPanelOpen(true)}>
        <i className="fas fa-plus"></i>
      </div>

      {/* Side Panel Form */}
      <div className={`side-panel ${isPanelOpen ? 'open' : ''}`}>
        <div className="panel-header">
          <h3>Management Console</h3>
          <button className="close-btn" onClick={() => setIsPanelOpen(false)}>×</button>
        </div>

        <form onSubmit={addLink} className="panel-form">
          <label>FOLDER NAME</label>
          <input type="text" placeholder="e.g. LinkedIn" value={title} onChange={(e) => setTitle(e.target.value)} />
          
          <label>URL LINK</label>
          <input type="text" placeholder="e.g. linkedin.com/in/navneet" value={url} onChange={(e) => setUrl(e.target.value)} />
          
          <button type="submit" className="save-btn">SAVE DIRECTORY</button>
        </form>
      </div>

      {/* Main Content Card */}
      <div className="glass-card">
        
        <div className="profile-section">
          <div className="profile-ring" onClick={() => setIsImageOpen(true)}>
            <img src="/profile.jpg" alt="Navneet" className="profile-img" />
          </div>
          
          <h1 className="name-text">Navneet Kumar Saini</h1>
          <p className="bio-tag">TECH ENTHUSIAST | COMPUTER SCIENCE STUDENT</p>
        </div>

        {/* Dynamic Folder Grid */}
        <div className="folders-grid">
          {links.map(link => (
            <div key={link._id} className="folder-item">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="folder-content">
                <div className="icon-wrapper">
                  <i className={getIcon(link.title)}></i>
                </div>
                <h3>{link.title}</h3>
                <span className="open-label">Open</span>
              </a>
              <button className="del-btn" onClick={() => deleteLink(link._id)}>×</button>
            </div>
          ))}
        </div>

        {/* Resume Section */}
        <div className="resume-container">
          <div className="line-divider"></div>
          <p className="resume-info">Want to see my professional journey?</p>
          <a 
            href="https://drive.google.com/file/d/1zYjQEmuXcew3zzFvjXeWwhTvERAWhzpO/view?usp=sharing" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="resume-button"
          >
            <i className="fas fa-file-pdf"></i> VIEW RESUME
          </a>
        </div>

      </div>

      {/* Full Screen Image Modal */}
      {isImageOpen && (
        <div className="modal" onClick={() => setIsImageOpen(false)}>
          <img src="/profile.jpg" alt="Zoomed" className="zoomed-pic" />
        </div>
      )}

      {/* Overlay for Sidebar */}
      {isPanelOpen && <div className="blur-overlay" onClick={() => setIsPanelOpen(false)}></div>}

    </div>
  );
}

export default App;