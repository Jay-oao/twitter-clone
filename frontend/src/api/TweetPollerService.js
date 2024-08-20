import apiClient from "./clientApi";

export const tweetPoller = ()=>apiClient.get('/latest');