import { useArray } from "../../providers/signDetectProvider";
import "./styles.css"

/**
 * Component used to display array elements on the user's screen
 */
function DetectedText() {
  const { textArray } = useArray();
  let i=0;

  return (
    <>
      <div className="wrapper">
        {textArray && textArray !== []
          ? textArray.map((txt) => {
            return (
              <div key={i++} className="detectedTextBox">
                <h1 className="detectedText">{txt}</h1>
              </div>
            );
          })
          : ""}
      </div>
    </>
  );
}
export default DetectedText;
