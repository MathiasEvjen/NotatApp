import { useEffect, useState } from "react";
import LastEditedContainer from "../../components/lastEditedContainer/LastEditedContainer";
import SearchBar from "../../components/searchBar/SearchBar";
import Todos from "../../components/todos/Todos";
import type { Sheet } from "../../types/sheet";
import "./frontPage.css";
import { fetchLastEdited } from "../../api";

interface FrontPageProps {
    smallMenu: boolean;
    handleSetSmallMenu: () => void; 
}

const FrontPage: React.FC<FrontPageProps> = ({ smallMenu, handleSetSmallMenu }) => {

    const [recentSheets, setRecentSheets] = useState<Sheet[]>([]);

    const getRecentSheets = async () => {
        const fetchedRecentSheets: Sheet[] = await fetchLastEdited();

        setRecentSheets(fetchedRecentSheets);
    };

    useEffect(() => {
        getRecentSheets();
    }, []);

    return(
        <div className="front-page-content-container">
            <LastEditedContainer sheets={recentSheets} smallMenu={smallMenu} handleSetSmallMenu={handleSetSmallMenu} />
            <SearchBar />
            <div className="front-page-content">
                <div className="front-page-surface-row">
                    <div className="front-page-surface">
                        <p>Forelesninger</p>
                    </div>
                </div>
                <div className="front-page-surface-row">
                    <div className="front-page-surface">
                        <p>Loggføringer</p>
                    </div>
                    <div className="front-page-surface">
                        <p>Huskelister</p>
                    </div>
                </div>
                <div className="front-page-todos-container">
                    <Todos />
                </div>
            </div>
        </div>
    )
}

export default FrontPage;