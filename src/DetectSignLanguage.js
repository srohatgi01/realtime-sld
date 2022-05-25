import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { useArray } from "./signDetectProvider";
import "./styles.css"
import "./App.css";

function DetectSignLanguage() {
  // const [arr,setArr] = useState([])
  const { textArray } = useArray([]);

  // runCoco();
  // return {textArray,runCoco}
  // useEffect(() => {
  //     console.log("hi")
  //     console.log(textArray)
  // }, [textArray]);
  // setInterval(() => {
  //     // console.log("Calling Detect")

  //     setArr(textArray);
  // }, 500);
  // useEffect(() => {
  //     console.log(arr)
  // }, [arr]);

  return (
    <>
      {console.log(textArray)}
      {/* <h1 style={{position:"absolute",zIndex:"100",top:"20"}}>Array</h1> */}
      <div className="wrapper">

      {textArray && textArray !== []
        ? textArray.map((txt) => {
          return (
            <div className="detectedTextBox">
              <h1 className="detectedText">{txt}</h1>
            </div>
          );
        })
        : ""}
      </div>
      {/* <h1 style={{position:"absolute",zIndex:"100",top:"0"}}>{textArray}</h1>         */}
    </>
  );
}
export default DetectSignLanguage;
