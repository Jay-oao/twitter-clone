import { apiClient } from "./clientApi";

export const getProfileDetails = (senderId) => apiClient.get('/profileDetails',{
    params:{
        source : senderId
    }
  })