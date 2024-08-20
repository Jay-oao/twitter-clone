import apiClient from "./clientApi";

export const fetchTweets =  (page,size,username)=> apiClient.get('/', {
    params: {
      page: page,
      size: size,
      username: username
    }
  });

  export const newTweet = (tweet)=>apiClient.post('/newTweet',tweet)