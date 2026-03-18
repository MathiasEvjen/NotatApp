import "./sideMenu.css";
import Logo from "../../assets/logo.svg";
import Logbooks from "../../assets/logbooks.svg";
import Checklists from "../../assets/checklists.svg";
import Lecture from "../../assets/presentation.svg";
import { NavLink, useLocation } from "react-router-dom";

interface SideMenuProps {
    smallMenu: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ smallMenu }) => {

    const { pathname } = useLocation();

    const isLecturePath = pathname.startsWith('/lecture');
    const isLogPath = pathname.startsWith('/log');
    const isChecklistPath = pathname.startsWith('/checklist');

    const paddingLeftEntries: string = smallMenu ? "1rem" : "2rem";
    const paddingLeftLogo: string = smallMenu ? "0.3rem" : "1.5rem";

    return(
        <div className="side-menu-container">
            <NavLink 
                to="/home" 
            >
                <div 
                    className="side-menu-logo"
                    style={{
                        paddingLeft: paddingLeftLogo
                    }}
                >
                    <img src={Logo} />
                    {smallMenu ? "" : (<p>Notater</p>)}
                </div>
            </NavLink>

            <div className="side-menu-entries">

                <NavLink to="/lecture">
                    <div 
                        className={`side-menu-entry ${isLecturePath ? "active" : ""}`}
                        style={{
                            paddingLeft: paddingLeftEntries
                        }}
                    >
                        <img src={Lecture} />
                        {smallMenu ? "" : (<p>Forelesninger</p>)}
                    </div>
                </NavLink>

                <NavLink to="/logs">
                    <div 
                        className={`side-menu-entry ${isLogPath ? "active" : ""}`}
                        style={{
                            paddingLeft: paddingLeftEntries
                        }}
                    >
                        <img src={Logbooks} />
                        {smallMenu ? "" : (<p>Loggføringer</p>)}
                    </div>
                </NavLink>

                <NavLink to="/checklist">
                    <div 
                        className={`side-menu-entry ${isChecklistPath ? "active" : ""}`}
                        style={{
                            paddingLeft: paddingLeftEntries
                        }}
                    >
                        <img src={Checklists} />
                        {smallMenu ? "" : (<p>Huskelister</p>)}
                    </div>
                </NavLink>
            </div>
        </div>
    )
};

export default SideMenu;