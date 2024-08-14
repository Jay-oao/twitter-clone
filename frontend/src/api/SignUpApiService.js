import { apiClient } from "./clientApi"

export const signup = (details)=>apiClient.post('/register',details)