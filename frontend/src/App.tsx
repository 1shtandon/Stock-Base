import React, {useEffect} from 'react';
import UserInfoInterface from "./interfaces/UserInfo";
import {StockBaseApi} from "./services/StockBaseApi";
import {Route, BrowserRouter as Router, Routes, useNavigate, useParams} from "react-router-dom";
import Navbar from "./componenets/Navbar";
import Home from "./componenets/Home";
import Login from "./componenets/Login";
import {logout} from "./util";
import Register from "./componenets/Register";
import ScreenerSearch from "./componenets/ScreenerSearch";
import ScreenerStock from "./componenets/ScreenerStock";
import Portfolio from "./componenets/Portfolio";


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
            <Navbar {...userInfo} logout={() => {
                logout();
                setUserInfo({
                    loggedIn: false,
                });
            }}/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/dashboard' element={<div>Dashboard</div>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<Register/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/screener' element={<ScreenerSearch/>}/>
                <Route path='/screener/:stockId' element={<ScreenerStock/>}/>
                <Route path='/portfolio' element={<Portfolio/>}/>
                <Route path='/watchlist' element={<div>Watchlist</div>}/>
                <Route path='*' element={<div>404</div>}/>
            </Routes>
        </Router>
    );
}

export default App;
