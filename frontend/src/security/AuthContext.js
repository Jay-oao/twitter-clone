import { useContext, createContext, useState } from "react";

export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({children}){


    const[username,setUsername] = useState('')

    const [Authenticated , setAuthenticated] = useState(false)

    return(
        <AuthContext.Provider value={ {Authenticated,setAuthenticated,username,setUsername} }>
            {children}
        </AuthContext.Provider>
    )
}