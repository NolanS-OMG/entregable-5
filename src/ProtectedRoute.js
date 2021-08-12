import { Redirect, Route } from "react-router-dom";
import { useAuth } from "./AuthProvider"

const ProtectedRoute = ({children, ...props}) => {
    const {user} = useAuth();

    if (user.length > 0) {
        return <Route {...props}>{children}</Route>
    }

    return <Redirect to='/login'/>
}

export default ProtectedRoute;