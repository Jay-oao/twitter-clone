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

export const startChat = (senderId,part) => apiClient.get('/newChatSearch',{
  params:{
    sender : senderId,
    userPart : part
  }
})