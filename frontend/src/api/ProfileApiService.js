import apiClient from "./clientApi";

export const getProfileDetails = (senderId) => apiClient.get('/profileDetails',{
    params:{
        source : senderId
    }
  })

  export const followProfile = (src , destination) => apiClient.post('/follow',
  {
    src : src,
    destination : destination
  }
)