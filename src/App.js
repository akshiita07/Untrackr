import React, { useState } from "react";
import JSZip from "jszip";
import "./App.css";

const App = () => {
    const [unfollowers, setUnfollowers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);
        setError("");
        setUnfollowers([]);

        try {
            const zip = new JSZip();
            const contents = await zip.loadAsync(file);
            
            const followersFile = contents.files["connections/followers_and_following/followers_1.json"];
            const followingFile = contents.files["connections/followers_and_following/following.json"];
            
            if (!followersFile || !followingFile) {
                throw new Error("Required files not found in zip");
            }

            const followersData = JSON.parse(await followersFile.async("text"));
            const followingData = JSON.parse(await followingFile.async("text"));
            
            const followers = new Set(followersData.map(f => f.string_list_data[0].value));
            const following = followingData.relationships_following.map(f => f.string_list_data[0].value);
            
            const unfollowersList = following.filter(user => !followers.has(user));
            setUnfollowers(unfollowersList);
        } catch (err) {
            setError("Error processing file: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <div className="instagram-header">
                <div className="header-content">
                    <div className="logo">
                        <span className="instagram-logo">📷</span>
                        <span className="app-name">Untrackr</span>
                    </div>
                    <div className="header-icons">
                        <span className="icon">💔</span>
                        <span className="icon">📊</span>
                    </div>
                </div>
            </div>
            
            <div className="story-section">
                <div className="story-item active">
                    <div className="story-ring">
                        <span>📤</span>
                    </div>
                    <span>Upload</span>
                </div>
                <div className="story-item">
                    <div className="story-ring">
                        <span>👥</span>
                    </div>
                    <span>Analyze</span>
                </div>
                <div className="story-item">
                    <div className="story-ring">
                        <span>💔</span>
                    </div>
                    <span>Results</span>
                </div>
            </div>
            
            <div className="post-container">
                <div className="post-header">
                    <div className="post-user">
                        <div className="profile-pic">📋</div>
                        <div className="user-info">
                            <span className="username">instagram_help</span>
                            <span className="location">How to export data</span>
                        </div>
                    </div>
                    <span className="more-options">⋯</span>
                </div>
                
                <div className="post-content">
                    <div className="instruction-steps">
                        <div className="step">1. Go to <a href="https://accountscenter.instagram.com/info_and_permissions/" target="_blank" rel="noopener noreferrer">Account Center</a></div>
                        <div className="step">2. Export your information → Create export</div>
                        <div className="step">3. Export to device</div>
                        <div className="step">4. Select: <strong>followers and following only</strong></div>
                        <div className="step">5. Date range: <strong>all time</strong> | Format: <strong>JSON</strong></div>
                        <div className="step">6. Start export and download</div>
                    </div>
                </div>
            </div>

            <div className="upload-post">
                <div className="upload-area">
                    <input 
                        type="file" 
                        accept=".zip" 
                        onChange={handleFileUpload}
                        className="file-input"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="instagram-upload-btn">
                        <div className="upload-icon">📁</div>
                        <div className="upload-text">
                            <span>Upload your Instagram data</span>
                            <small>ZIP file from Instagram export</small>
                        </div>
                    </label>
                </div>
            </div>

            {loading && <div className="loading">Processing your data...</div>}
            {error && <div className="error">{error}</div>}
            
            {unfollowers.length > 0 && (
                <div className="results-section">
                    <div className="results-header">
                        <h3>💔 Not following you back ({unfollowers.length})</h3>
                    </div>
                    <div className="followers-list">
                        {unfollowers.map((username, index) => (
                            <div key={index} className="follower-item">
                                <div className="follower-info">
                                    <div className="follower-avatar">👤</div>
                                    <div className="follower-details">
                                        <span className="follower-username">{username}</span>
                                        <span className="follower-status">Not following back</span>
                                    </div>
                                </div>
                                <a 
                                    href={`https://instagram.com/${username}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="follow-btn"
                                >
                                    View
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="instagram-footer">
                <div className="footer-nav">
                    <div className="nav-item active">
                        <span className="nav-icon">🏠</span>
                        <span>Home</span>
                    </div>
                    <div className="nav-item">
                        <span className="nav-icon">🔍</span>
                        <span>Search</span>
                    </div>
                    <div className="nav-item">
                        <span className="nav-icon">➕</span>
                        <span>Upload</span>
                    </div>
                    <div className="nav-item">
                        <span className="nav-icon">💔</span>
                        <span>Untrack</span>
                    </div>
                    <div className="nav-item">
                        <span className="nav-icon">👤</span>
                        <span>Profile</span>
                    </div>
                </div>
                <div className="copyright">
                    <small>© 2025 Made with ❤️ by Akshita</small>
                </div>
            </div>
        </div>
    );
};

export default App;
