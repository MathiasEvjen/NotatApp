import "./sideMenu.css";
import Logo from "../../assets/logo.svg";
import Logbooks from "../../assets/logbooks.svg";
import Checklists from "../../assets/checklists.svg";
import Lecture from "../../assets/presentation.svg";
import { NavLink, useLocation } from "react-router-dom";

const SideMenu: React.FC = () => {

    const { pathname } = useLocation();

    const isLecturePath = pathname.startsWith('/lecture');
    const isLogPath = pathname.startsWith('/log');
    const isChecklistPath = pathname.startsWith('/checklist');

    return(
        <div className="side-menu-container">
            <NavLink 
                to="/home" 
            >
                <div className="side-menu-logo">
                    <img src={Logo} />
                    <p>Notater</p>
                </div>
            </NavLink>

            <div className="side-menu-entries">

                <NavLink to="/lecture">
                    <div className={`side-menu-entry ${isLecturePath ? "active" : ""}`}>
                        <img src={Lecture} />
                        <p>Forelesninger</p>
                    </div>
                </NavLink>

                <NavLink to="/logs">
                    <div className={`side-menu-entry ${isLogPath ? "active" : ""}`}>
                        <img src={Logbooks} />
                        <p>Loggføringer</p>
                    </div>
                </NavLink>

                <NavLink to="/checklist">
                    <div className={`side-menu-entry ${isChecklistPath ? "active" : ""}`}>
                        <img src={Checklists} />
                        <p>Huskelister</p>
                    </div>
                </NavLink>
            </div>
        </div>
    )
};

export default SideMenu;