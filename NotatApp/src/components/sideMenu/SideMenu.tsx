import "./sideMenu.css";
import Logo from "../../assets/logo.svg";
import Logbooks from "../../assets/logbooks.svg";
import Checklists from "../../assets/checklists.svg";
import Lecture from "../../assets/presentation.svg";

const SideMenu: React.FC = () => {

    return(
        <div className="side-menu-container">
            <div className="side-menu-logo">
                <img src={Logo} />
                <p>Notater</p>
            </div>
            <div className="side-menu-entries">
                <div className="side-menu-entry">
                    <img src={Lecture} />
                    <p>Forelesninger</p>
                </div>
                <div className="side-menu-entry">
                    <img src={Logbooks} />
                    <p>Loggføringer</p>
                </div>
                <div className="side-menu-entry">
                    <img src={Checklists} />
                    <p>Huskelister</p>
                </div>
            </div>
        </div>
    )
};

export default SideMenu;