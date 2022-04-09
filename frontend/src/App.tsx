import React, {useEffect} from 'react';
import UserInfoInterface from "./interfaces/UserInfo";
import {StockBaseApi} from "./services/StockBaseApi";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Navbar from "./componenets/Navbar";
import Home from "./componenets/Home";
import LoginForm from "./componenets/Login";

function App() {

    const [userInfo, setUserInfo] = React.useState<UserInfoInterface>({
        loggedIn: false,
    });

    useEffect(() => {
        StockBaseApi.getInstance().getUserInfo().then(userInfoRes => {
            if (userInfoRes.success) {
                    setUserInfo({
                    loggedIn: true,
                    isAdmin: userInfoRes.data?.isAdmin,
                    email: userInfoRes.data?.email,
                    username: userInfoRes.data?.username,
                });
            }
        })
    }, []);

    return (
        <Router>
            <Navbar {...userInfo}/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/dashboard' element={<div>Dashboard</div>}/>
                <Route path='/login' element={<LoginForm />}/>
                <Route path='/register' element={<div>Register</div>}/>
                <Route path='/screener' element={<div>Screener</div>}/>
                <Route path='/watchlist' element={<div>Watchlist</div>}/>
                <Route path='*' element={<div>404</div>}/>
            </Routes>
        </Router>
    );
}

export default App;
