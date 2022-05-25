import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
// import ReactCSSTransitionGroup from 'react-transition-group';
import { useArray } from "./signDetectProvider";
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
      {textArray && textArray !== []
        ? textArray.map((txt) => {
            return (
              <h1
                style={{
                  backgroundColor: "white",
                  padding: "10px",
                  position: "relative",
                  zIndex: "100",
                  top: "0",
                  display: "block",
                  OTransition: "opacity 2s ease-in-out",
                }}
              >
                {txt}
              </h1>
            );
          })
        : ""}
      {/* <h1 style={{position:"absolute",zIndex:"100",top:"0"}}>{textArray}</h1>         */}
    </>
  );
}
export default DetectSignLanguage;
