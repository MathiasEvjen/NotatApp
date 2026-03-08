import './App.css'
import "./styles/colors.css";
import "./styles/buttons.css";
import LecturePage from './pages/lecturePage/LecturePage';
import type { Sheet, SheetType } from './types/sheet';
import DocumentContainer from './components/thumbnailContainer/ThumbnailContainer';
import FrontPage from './pages/frontPage/FrontPage';


function App() {

  const sheets: Sheet[] = [
    {sheetId: 1, title: "Tittel 1", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
    {sheetId: 2, title: "Tittel 2", content: "Et eller annet", noteType: "Log", createdAt: new Date(), editedAt: new Date()},
    {sheetId: 3, title: "Tittel 3", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
    {sheetId: 4, title: "Tittel 4", content: "Et eller annet", noteType: "List", createdAt: new Date(), editedAt: new Date()},
    {sheetId: 5, title: "Tittel 5", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
    {sheetId: 6, title: "Tittel 6", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
    {sheetId: 7, title: "Tittel 7", content: "Et eller annet", noteType: "Lecture", createdAt: new Date(), editedAt: new Date()},
  ]

  return (
    <>
      {/* <LecturePage /> */}
      <FrontPage />
    </>
  )
}

export default App
