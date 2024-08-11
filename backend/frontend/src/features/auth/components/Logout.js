import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectLoggedInUser, signOutAsync } from "../authSlice";
import { useEffect } from "react";
import { clearLoggedInUserAsync } from "../../user/userSlice";

export default function Logout(){
    const user = useSelector(selectLoggedInUser);
    const dispatch = useDispatch();
    useEffect(()=>{
        if(user){
            // TODO: we'll need to reset frontend cart on logout
            dispatch(signOutAsync());
            // reset loggedin user details
            dispatch(clearLoggedInUserAsync());
        }
    },[])
    // useEffect runs after render, so we have to delay navigation
    return (
        <>
        {!user && <Navigate to="/" replace={true}></Navigate>}
        </>
    );
}