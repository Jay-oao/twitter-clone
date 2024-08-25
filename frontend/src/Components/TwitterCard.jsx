/*eslint-disable*/
import React, { useEffect, useState, useCallback } from 'react';
import '../css/card.css'; 
import { fetchTweets, newTweet } from '../api/TweetApiService';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { tweetPoller } from '../api/TweetPollerService';
import HeaderComponent from './HeaderComponent';
import { setSession } from '../api/SignInApiService';
import Cookies from 'js-cookie';

const PAGE_SIZE = 7;

function TwitterCard() {
  const [loading, setLoading] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(0);
  const [callApi, setCallApi] = useState(true);
  const [newTweetAvailable, setNewTweetAvailable] = useState(false);
  const [latestTweets, setLatestTweets] = useState([]);


  useEffect(() => {
    if(sessionStorage.getItem("email")==null){
      const token = Cookies.get('access_token')
      async function sessionStorageSet (token){
        try{
          let response = await setSession(token);
          sessionStorage.setItem("email",response.data.email)
          sessionStorage.setItem("id",response.data.id)
          sessionStorage.setItem("username",response.data.username)
          loadTweets();
          window.addEventListener("scroll", handleScroll);
        } catch(error){
          console.log(error);
        }
      }
      sessionStorageSet(token);
    } else {
      loadTweets();
      window.addEventListener("scroll", handleScroll);
    }

    

    const tweetPoll = setInterval(() => {
      tweetPoller()
        .then((response) => {
          if (response.data && response.data.length > 0) {
            const latestFetchedTweets = response.data.map((tweet) => ({
              username: tweet.details.username,
              tweetDate: tweet.tweetDate,
              tweetDesc: tweet.tweetDesc,
              tweetId: tweet.tweetId
            }));

            latestFetchedTweets.sort((a, b) => new Date(b.tweetDate) - new Date(a.tweetDate));
            setNewTweetAvailable(true);
            setLatestTweets(latestFetchedTweets);
          } 
        })
        .catch(err => console.log(err));
    }, 15000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(tweetPoll);
    };
  }, []);

  const updateTweets = useCallback((latestTweets) => {
    setTweets((prevTweets) => [...latestTweets, ...prevTweets]);
  }, []);

  useEffect(() => {
    if (page > 1 && callApi) {
      loadTweets();
    }
  }, [page]);

  

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  function formatTimeAgo(timestamp) {
    const parsedDate = parseISO(timestamp);
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  }

  function loadTweets() {
    if (loading) return;

    setLoading(true);

    fetchTweets(page, PAGE_SIZE, sessionStorage.getItem("username"))
      .then(response => {
        const transformedTweets = response.data.map((tweet) => ({
          username: tweet.details.username,
          tweetDesc: tweet.tweetDesc,
          tweetDate: tweet.tweetDate,
          tweetId: tweet.tweetId
        }));
        transformedTweets.sort((a, b) => new Date(b.tweetDate) - new Date(a.tweetDate));
        setTweets((prevTweets) => [...prevTweets, ...transformedTweets]);
      })
      .catch(error => {
        if (error) {
          setCallApi(false);
          console.log(error.response);
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const cards = document.querySelectorAll('.container-card');
    cards.forEach(card => card.classList.add('visible'));
  }, [tweets]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tweetInput, setTweetInput] = useState('');

  const handleTweetChange = (e) => setTweetInput(e.target.value);

  const handleTweetSubmit = (e) => {
    e.preventDefault();
    const new_tweet ={
      tweetDesc : tweetInput,
      details :{
        id:sessionStorage.getItem("id")
      }
    }
    newTweet(new_tweet)
      .then(response=>console.log(response))
      .catch(error=>console.log(error))

    setTweetInput('');
    setIsModalOpen(false);
  };

  const handleNewTweetsClick = () => {
    updateTweets(latestTweets);
    setNewTweetAvailable(false);
    setLatestTweets([])
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

const routeToProfile = ()=>{
  
}

  return (
    <>
    <HeaderComponent />
    <div className="entire-container">
      {loading && <p className="loading">Loading...</p>}
      {tweets.map((tweet) => (
        <div key={tweet.tweetId} className='container-card'>
          <div className="tweet">
            <div className="top">
              <img src={`https://via.placeholder.com/50x50?text=${tweet.username}`} alt="Profile Pic" />
              <div className="author" onClick={routeToProfile}>{tweet.username}</div>
              <div className="date">{formatTimeAgo(tweet.tweetDate)}</div>
            </div>
            <div className="content">{tweet.tweetDesc}</div>
          </div>
        </div>
      ))}
      {!callApi && <p className="center">End of mocked Tweets</p>}
    </div>

    <button
      className="fixed-button"
      onClick={() => setIsModalOpen(true)}
    >
      +
    </button>

    {isModalOpen && (
      <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Compose Tweet</h2>
          <form onSubmit={handleTweetSubmit}>
            <textarea
              value={tweetInput}
              onChange={handleTweetChange}
              placeholder="What's happening?"
              rows="4"
              required
            />
            <button type="submit">Tweet</button>
          </form>
          <button className="close-modal" onClick={() => setIsModalOpen(false)}>Close</button>
        </div>
      </div>
    )}
    
    {newTweetAvailable && (
     <div className={`notification-bar ${newTweetAvailable ? 'show' : ''}`}>
      <p>New tweets available!</p>
      <button onClick={handleNewTweetsClick}>View New Tweets</button>
    </div>
    )}

  </>
);
}

export default TwitterCard;
