import React from 'react';
import Header from "./Home/Header";
import About from './Home/About';
import Tools from "./Home/Tools";
import Contact from "./Home/Contact";
import Footer from "./Footer";


const Home: React.FC = () => {
    return (
        <>
            <Header/>
            <About/>
            <Tools/>
            <Contact/>
            <Footer/>
        </>
    )
}

export default Home;
