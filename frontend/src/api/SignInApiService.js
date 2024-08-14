import { apiClient } from "./clientApi"

export const signin = (loginRequest) => apiClient.post('/login',loginRequest) 
