import './App.css'
import "./styles/colors.css";
import "./styles/buttons.css";
import LecturePage from './pages/lecturePage/LecturePage';
import Thumbnail from './components/thumbnail/Thumbnail';


function App() {

  const content: string = "Testing av programvare";
  const date: Date = new Date();

  return (
    <>
      {/* <LecturePage /> */}
      
      <Thumbnail title={content} date={date} />
    </>
  )
}

export default App
