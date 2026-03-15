import './App.css'
import "./styles/colors.css";
import "./styles/buttons.css";
import LectureEditor from './pages/lecturePage/LectureEditor';
import FrontPage from './pages/frontPage/FrontPage';
import SideMenu from './components/sideMenu/SideMenu';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LecturePage from './pages/lecturePage/LecturePage';



function App() {

    return (
        <Router>
            <div className="app-wrapper">
                <div className="app-side-menu">
                    <SideMenu />
                </div>
                <Routes>
                    <Route path='/' element={<FrontPage />} />
                    <Route path='/home' element={<FrontPage />} />
                    <Route path='/lecture' element={<LecturePage />} />
                    <Route path='/lecture/document' element={<LectureEditor />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
