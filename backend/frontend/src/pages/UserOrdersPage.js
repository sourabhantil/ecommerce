import { useSelector } from "react-redux";
import Navbar from "../features/navbar/Navbar";
import UserOrders from "../features/user/components/UserOrders";
import { selectUserInfo } from "../features/user/userSlice";

export default function UserOrdersPage(){
    const userInfo = useSelector(selectUserInfo);
    return (<div>
        <Navbar>
            <h1 className="mx-auto text-2xl">My Orders</h1>
            {userInfo && <UserOrders/>}
        </Navbar>
    </div>)
}