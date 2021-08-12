import { createContext, useContext, useState } from "react";

const authContext = createContext();

const useProvideAuth = () => {
    const [user, setUser] = useState('');

    function putUser(newUser) {
        setUser(newUser);
    }

    return {
        user, putUser
    }
}

export const ProvideAuth = ({children, ...props}) => {
    const auth = useProvideAuth();

    return( <authContext.Provider value = {auth} {...props}> {children} </authContext.Provider> )
}

export const useAuth = () => useContext(authContext);