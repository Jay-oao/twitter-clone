import { apiClient } from "./clientApi";

export const getChatAccounts = (sender)=>apiClient.get('/receiver',{
  params:{
    senderId : sender
  }
});

export const renderChats = (senderId,receiverId) => apiClient.get('/renderMessage',{
  params:{
    sender: senderId,
    receiver:receiverId
  }
})