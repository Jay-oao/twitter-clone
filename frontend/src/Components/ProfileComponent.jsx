import React from 'react';
import '../css/profile.css'; 

function ProfileComponent() {
  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="profile-picture-container">
          <img
            src="https://via.placeholder.com/150x150?text=Profile"
            alt="Profile"
            className="profile-picture"
          />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">User Name</h1>
          <p className="profile-bio">This is the user's bio. Add more details here.</p>
          <button className="edit-profile-button">Edit Profile</button>
        </div>
      </header>
      <section className="profile-stats">
        <div className="stats-item">
          <p className="stats-count">123</p>
          <p className="stats-label">Following</p>
        </div>
        <div className="stats-item">
          <p className="stats-count">456</p>
          <p className="stats-label">Followers</p>
        </div>
      </section>
      <section className="profile-tweets">
        <h2 className="tweets-title">Tweets</h2>
        <div className="tweet-list">
          <div className="tweet-card">
            <p className="tweet-content">This is a sample tweet from the user.</p>
          </div>
          <div className="tweet-card">
            <p className="tweet-content">Another tweet by the user.</p>
          </div>
          {/* Add more tweet cards as needed */}
        </div>
      </section>
    </div>
  );
}

export default ProfileComponent;
