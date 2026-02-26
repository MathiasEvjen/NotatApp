import { useEffect, useRef, useState } from "react";
import "./sheetTest.css";
import type { Sheet } from "../types/sheet";
import Editor from "react-simple-code-editor";
import TextEditor from "../editor/TextEditor";

const SheetTest: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [sheet, setSheet] = useState<Sheet>({ title: '', content: '' });

    const [text, setText] = useState<string>("");

    const handleUpdateTitle = (newTitle: string) => {
        setSheet(prev => ({
            ...prev, title: newTitle
        }));
    };

    const handleUpdatecontent = (htmlText: string, plainText: string) => {
        setSheet(prev => ({
            ...prev, content: htmlText
        }));
        setText(plainText);
    };
    
    const handleResponse = async (response: Response) => {
        if (response.ok) {  // HTTP status code success 200-299
            if (response.status === 204) { // Detele returns 204 No content
                return null;
            }
            return await response.json(); // other returns response body as JSON
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Network response was not ok');
        }
    };

    const fetchData = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5106/api/sheet/getById/${id}`);
            const data = await handleResponse(response);
            console.log(data);
            setSheet(data);


        } catch {

        }
    };

    const handlePointsOfInterest = () => {
        let count = 1;

        const lines = text.split("\n");
        lines.forEach(line => {
            if (line[0] === "#") {
                console.log(`POI ${count}: ${line}`);
                count ++;
            }
        });
    };

    useEffect(() => {
        handlePointsOfInterest();
    }, [text]);

    useEffect(() => {
        fetchData(2);
    }, [])

    return(
        <div className="sheet-wrapper">
            <div ref={containerRef} className="sheet-content">
                <input 
                    value={sheet?.title}
                    onChange={(e) => handleUpdateTitle(e.target.value)}
                    placeholder="Title..." />

                {/* <SheetContent content={content} onChange={setContent} handleTextAreaScroll={handleTextAreaScroll} /> */}
                <TextEditor content={sheet.content} handleUpdatecontent={handleUpdatecontent} />
            </div>

            <div className="sheet-sidebar">
                <button onClick={handlePointsOfInterest}>test</button>
            </div>
        </div>
        
    )
}

export default SheetTest;