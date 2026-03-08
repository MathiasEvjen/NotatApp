import './App.css'
import "./styles/colors.css";
import "./styles/buttons.css";
import LecturePage from './pages/lecturePage/LecturePage';
import Thumbnail from './components/thumbnail/Thumbnail';
import type { SheetType } from './types/sheet';


function App() {

  const content: string = "Testing av programvare";
  const date: Date = new Date();
  const type: SheetType = "Log"

  return (
    <>
      {/* <LecturePage /> */}
      
      <Thumbnail title={content} date={date} type={type} />
    </>
  )
}

export default App
