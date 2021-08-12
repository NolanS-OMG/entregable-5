import { createContext, useContext, useState } from "react";

const authContext = createContext();

const useProvideAuth = () => {
    const [user, setUser] = useState('');

    const putUser = (newUser) => {
        setUser(newUser);
    }

    return {
        user, putUser
    }
}

export const ProvideAuth = ({children}) => {
    const auth = useProvideAuth();

    return( <authContext.Provider value = {auth}> {children} </authContext.Provider> )
}

export const useAuth = () => useContext(authContext);