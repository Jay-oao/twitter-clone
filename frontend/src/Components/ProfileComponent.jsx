import React, { useEffect, useState } from 'react';
import '../css/profile.css'; 
import { followProfile, getProfileDetails } from '../api/ProfileApiService'; // Assume there's an updateProfile API
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useParams } from 'react-router-dom';

function ProfileComponent() {
  const [info, setInfo] = useState({});
  const { profileId } = useParams();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getProfileInfo = async () => {
      try {
        const response = await getProfileDetails(profileId || sessionStorage.getItem("id"));
        setInfo(response.data);
        setUsername(response.data.username);
        setBio(response.data.bio);
      } catch (err) {
        console.log(err);
      }
    };
    getProfileInfo();
  }, [profileId]);

  function formatTimeAgo(timestamp) {
    const parsedDate = parseISO(timestamp);
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  }

  function follow() {
    followProfile(sessionStorage.getItem("id"), profileId)
      .then(response => console.log(response))
      .catch(error => console.log(error));
  }

  function handleEditClick() {
    setIsEditing(true);
  }

  function handleSaveClick() {
    //const updatedInfo = { username, bio };
    // updateProfile(sessionStorage.getItem("id"), updatedInfo) 
    //   .then(response => {
    //     setInfo(response.data);
    //     setIsEditing(false);
    //   })
    //   .catch(error => console.log(error));
  }

  function handleCancelClick() {
    setUsername(info.username);
    setBio(info.bio);
    setIsEditing(false);
  }

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
          {isEditing ? (
            <>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="profile-input"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="profile-textarea"
              />
              <button className="save-button" onClick={handleSaveClick}>Save</button>
              <button className="cancel-button" onClick={handleCancelClick}>Cancel</button>
            </>
          ) : (
            <>
              <h2>{username}</h2>
              <p className="profile-bio">{bio}</p>
              {(profileId === undefined || profileId === sessionStorage.getItem("id")) && 
                <button className="edit-profile-button" onClick={handleEditClick}>Edit Profile</button>}
              {profileId !== undefined && profileId !== sessionStorage.getItem("id") && 
                <button className='follow' onClick={follow}>Follow</button>}
            </>
          )}
        </div>
      </header>
      <section className="profile-stats">
        <div className="stats-item">
          <p className="stats-count">{info.following_count}</p>
          <p className="stats-label">Following</p>
        </div>
        <div className="stats-item">
          <p className="stats-count">{info.follower_count}</p>
          <p className="stats-label">Followers</p>
        </div>
      </section>
      <section className="profile-tweets">
        <h2 className="tweets-title">Tweets</h2>
        <div className="tweet-list">
          {info.tweetsList ? (
            info.tweetsList.map((tweet, index) => (
              <div key={index} className="tweet-card">
                <p className="tweet-content">{tweet.tweetDesc}</p> 
                <p className="tweet-date">{formatTimeAgo(tweet.tweetDate)}</p>
              </div>
            ))
          ) : (
            <p>No tweets available.</p> 
          )}
        </div>
      </section>
    </div>
  );
}

export default ProfileComponent;
