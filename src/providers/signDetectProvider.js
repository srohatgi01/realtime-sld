import React, { useState, useContext } from 'react'
import * as tf from "@tensorflow/tfjs";
import { labelMap } from '../constants/maps';

/**
 * Creating Array context using createContext hook api
**/
const ArrayContext = React.createContext();
export function useArray() {
    return useContext(ArrayContext)
}

/**
 * Creating Sign Detect context using createContext hook api
**/
const SignDetectContext = React.createContext();
export function useSignDetect() {
    return useContext(SignDetectContext)
}

/**
 * **Core Component** 
 * Responsible for loading custom ML Graph Model, detecting in every
 * 500 miliseconds i.e. 0.5 seconds, adding detected words in an array,
 * clearing the first element from the list every 5000 miliseconds i.e
 * 5 seconds, deallocaing memory and returning the values in Context Provider
 * enclosing the children props 
 **/
export function SignDetectProvider({ children }) {
    const [textArray, setTextArray] = useState([])

    const runDetectionModel = async (webcamRef) => {
        let arr = []
        // deleting first element of array every 5000 miliseconds
        setInterval(() => {
            if (arr.length !== 0) {
                arr.shift()
                setTextArray(arr);
            }
        }, 5000);

        // loading graph model from remote url
        console.log(process.env.REACT_APP_MODEL_URL)
        const modelUrl = process.env.REACT_APP_MODEL_URL
        const model = await tf.loadGraphModel(modelUrl)

        // making detections every 500 miliseconds
        setInterval(() => {
            detect(model);
        }, 500);

        // Responsible for making detections
        const detect = async (model) => {
            // checking if webcam is ready or not
            if (
                webcamRef !== "undefined" &&
                webcamRef !== null &&
                webcamRef.current !== undefined &&
                webcamRef.current !== null &&
                webcamRef.current.readyState === 4
            ) {
                /**
                 * taking video from webcam, extracting image to build
                 * tensor object, resizing the image according to model's
                 * configuration, casting dimensions into 'int32' values,
                 * not expanding any dimensions, making detections and 
                 * storing in obj variable.
                 * **/
                const video = webcamRef.current;
                const img = tf.browser.fromPixels(video)
                const resized = tf.image.resizeBilinear(img, [640, 480])
                const casted = resized.cast('int32')
                const expanded = casted.expandDims(0)
                const obj = await model.executeAsync(expanded)

                console.log(obj)


                /**
                 * obj above is a Tensor object, it contains all the detected 
                 * information. Extracting classes and scores from it.
                 * Through classes relevant label is extracted and it's 
                 * confidence score.
                 * **/
                const classes = await obj[4].array()
                const scores = await obj[1].array()
                const labels = classes[0]
                const prob = scores[0]
               

                /**
                 * checking the confidence score is greater than threshold
                 * if yes, extracting it's label name, pushing it at the end 
                 * of array if the last element of the array is not already 
                 * the same
                 * **/
                for (let i = 0; i <= prob.length; i++) {
                    if (prob[i] > process.env.REACT_APP_THRESHOLD) {
                        const text = labels[i]
                        // console.log(labelMap)
                        let str = labelMap[text]['name']
                        if (arr.length === 0 || arr[arr.length - 1] !== str) {
                            setTextArray(textArray => [...textArray, str])
                            arr.push(str)
                            console.log(arr)
                        }
                    }
                }

                // Deallocating resources for reuse
                tf.dispose(img)
                tf.dispose(resized)
                tf.dispose(casted)
                tf.dispose(expanded)
                tf.dispose(obj)
            }
        };
    };
    return (
        // Passing text array to provider
        <ArrayContext.Provider value={{ textArray, setTextArray }}>
            {/* passing function to chilredn through provider */}
            <SignDetectContext.Provider value={runDetectionModel}>
                {children}
            </SignDetectContext.Provider>
        </ArrayContext.Provider>
    )
}
