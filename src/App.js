import { useState } from "react";
// Providers Imports
import { SignDetectProvider } from "./providers/signDetectProvider";
// Components Imports
import DetectedText from "./components/detected_text/DetectedText";
import Menu from "./components/menu/Menu"
import Videos from "./components/videos/Videos"
// CSS Imports
import "./App.css";

/**
 * 
 * Entry point of the application. Depending on the state of currentPage 
 * (default = home) either the Menu Page is rendered where a new meet can
 * be created/existing one can be joined or the Videos component is rendered
 * for detection.
 * 
 * **/

function App() {
    const [currentPage, setCurrentPage] = useState("home");
    const [joinCode, setJoinCode] = useState("");

    return (
        <div className="app">
            {currentPage === "home" ? (
                <Menu
                    joinCode={joinCode}
                    setJoinCode={setJoinCode}
                    setPage={setCurrentPage} />
            ) : (
                /** 
                 * The provider helps in passing custom hook enclosing function 
                 * and state variables without manually passing props to every 
                 * component in the component heirarchy
                **/
                <SignDetectProvider>
                    <Videos
                        mode={currentPage}
                        callId={joinCode}
                        setPage={setCurrentPage} />
                    {/* Displaying detected text on screen */}
                    <DetectedText />
                </SignDetectProvider>
            )}
        </div>
    );
}

export default App;
