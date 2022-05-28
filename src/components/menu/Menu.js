import Header from "../header/header"
import "./style.css"
import MacbookImg from "../../images/landing-img.png"
import Doodles from "../../images/doodles.jpg"
/**
 * Landing Page Component 
 * Gives you the option to create a new Call or Join existing one.
 */
function Menu({ joinCode, setJoinCode, setPage }) {
    return (
        <>
            <div className="bg"></div>
            <Header />
            <div className="tagline-wrapper">
                <h1 className="tagline">Create conversations in Realtime using Sign Langugage!!!</h1>
            </div>
            <img className="landing-img" src={MacbookImg} />
            <div className="call">
                <button onClick={() => setPage("create")}>Create New Call</button>
                <div>
                    <input
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="Join with Code"

                    />
                    {joinCode != "" ? <button onClick={() => setPage("join")}>Answer</button> : ""}
                </div>
            </div>
        </>
    );
}

export default Menu