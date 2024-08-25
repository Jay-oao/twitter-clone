/*eslint-disable*/
import React, { useEffect, useState , useMemo} from 'react';
import '../css/profile.css'; 
import { getProfileDetails } from '../api/ProfileApiService';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useParams } from 'react-router-dom';

function ProfileComponent() {
  const [info,setInfo] = useState({});
  const { profileId } = useParams();
  useMemo(()=>{
    console.log(profileId)
  },[]) 

  useEffect(()=>{
    const getProfileInfo = async () =>{
      try{
        const response = await getProfileDetails(sessionStorage.getItem("id"));
        setInfo(response.data);
      } catch (err) {
        console.log(err)
      }
      
    }
    getProfileInfo();
  },[])



  const username = sessionStorage.getItem("username");

  function formatTimeAgo(timestamp) {
    const parsedDate = parseISO(timestamp);
    return formatDistanceToNow(parsedDate, { addSuffix: true });
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
          <h2>{username}</h2>
          <p className="profile-bio">{info.bio}</p>
          <button className="edit-profile-button">Edit Profile</button>
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
          {info.tweetsList  ? (
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
