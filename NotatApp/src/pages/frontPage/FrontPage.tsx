import LastEditedContainer from "../../components/lastEditedContainer/LastEditedContainer";
import SearchBar from "../../components/searchBar/SearchBar";
import Todos from "../../components/todos/Todos";
import type { Sheet } from "../../types/sheet";
import "./frontPage.css";

const FrontPage: React.FC = () => {

    const sheets: Sheet[] = [
        {sheetId: 1, title: "Dett er en litt lenger tittel", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
        {sheetId: 2, title: "Tittel 2", content: "Et eller annet", noteType: "Log", createdAt: new Date(), editedAt: new Date()},
        {sheetId: 3, title: "Tittel 3", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
        {sheetId: 4, title: "Tittel 4", content: "Et eller annet", noteType: "List", createdAt: new Date(), editedAt: new Date()},
        {sheetId: 5, title: "Tittel 5", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
        {sheetId: 6, title: "Tittel 6", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
        {sheetId: 7, title: "Tittel 7", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
        {sheetId: 8, title: "Tittel 8", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
        {sheetId: 9, title: "Tittel 9", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
        {sheetId: 10, title: "Tittel 10", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
    ];

    return(
        <div className="front-page-content-container">
            <LastEditedContainer sheets={sheets}/>
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