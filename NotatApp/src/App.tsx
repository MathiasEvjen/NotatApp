import './App.css'
import "./styles/colors.css";
import "./styles/buttons.css";
import FrontPage from './pages/frontPages/FrontPage';
import SideMenu from './components/sideMenu/SideMenu';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LecturePage from './pages/frontPages/LecturePage';
import { useState } from 'react';
import MainLecture from './pages/lecture/MainLecture';



function App() {

    const [smallMenu, setSmallMenu] = useState<boolean>(true);

    return (
        <Router>
            <div className="app-wrapper">
                <div className={`app-side-menu ${smallMenu ? "small" : ""}`}>
                    <SideMenu smallMenu={smallMenu} />
                </div>
                <Routes>
                    <Route path='/' element={<FrontPage />} />
                    <Route path='/home' element={<FrontPage />} />
                    <Route path='/lecture' element={<LecturePage />} />
                    <Route path='/lecture/document' element={<MainLecture />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
