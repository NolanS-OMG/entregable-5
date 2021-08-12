import { createContext, useContext, useState } from "react";

const authContext = createContext();

const fakeAuthBackEnd = {
    user: '',
    changeUser: (callback) => {
        setTimeout(callback, 10);
    }
}

const useProvideAuth = () => {
    const [user, setUser] = useState('');

    const putUser = (newUser) => {
        fakeAuthBackEnd.changeUser( () => {
            setUser(newUser);
        } )
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