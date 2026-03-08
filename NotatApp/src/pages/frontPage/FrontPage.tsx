import LastEditedContainer from "../../components/lastEditedContainer/LastEditedContainer";
import type { Sheet } from "../../types/sheet";
import "./frontPage.css";

const FrontPage: React.FC = () => {

    const sheets: Sheet[] = [
        {sheetId: 1, title: "Tittel 1", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
        {sheetId: 2, title: "Tittel 2", content: "Et eller annet", noteType: "Log", createdAt: new Date(), editedAt: new Date()},
        {sheetId: 3, title: "Tittel 3", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
        {sheetId: 4, title: "Tittel 4", content: "Et eller annet", noteType: "List", createdAt: new Date(), editedAt: new Date()},
        {sheetId: 5, title: "Tittel 5", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
        {sheetId: 6, title: "Tittel 6", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
        {sheetId: 7, title: "Tittel 7", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
    ];

    const heading: string = "Nylig brukt";

    return(
        <div>
            <LastEditedContainer sheets={sheets} heading={heading} />
            <LastEditedContainer sheets={sheets} heading={heading} />
        </div>
    )
}

export default FrontPage;