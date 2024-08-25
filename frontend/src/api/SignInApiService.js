import apiClient from "./clientApi";

export const signin = (loginRequest) => apiClient.post('/login',loginRequest) 

export const setSession =  (token) => apiClient.get('/session/set',{
    params:{
        token:token
    }
})