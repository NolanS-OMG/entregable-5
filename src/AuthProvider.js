import { createContext, useContext, useState } from "react";

const authContext = createContext();

const fakeAuthBackEnd = {
    user: '',
    changeUser: (callback) => {
        setTimeout(callback, 100);
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

export const ProvideAuth = ({children}) => {
    const auth = useProvideAuth();

    return( <authContext.Provider value = {auth}> {children} </authContext.Provider> )
}

export const useAuth = () => useContext(authContext);