import React, { useState, useContext } from 'react'
import * as tf from "@tensorflow/tfjs";

const ArrayContext = React.createContext();

export function useArray() {
    return useContext(ArrayContext)
}
const SignDetectContext = React.createContext();

export function useSignDetect() {
    return useContext(SignDetectContext)
}

export function SignDetectProvider({ children }) {
    const [textArray, setTextArray] = useState([])

    const runDetectionModel = async (webcamRef) => {



        let arr = []

        setInterval(() => {

            if (arr.length !== 0) {
                arr.shift()
                setTextArray(arr);
            }


        }, 5000);
        const net = await tf.loadGraphModel('https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json')

        setInterval(() => {


            detect(net);

        }, 500);

        const detect = async (net) => {



            if (
                webcamRef !== "undefined" &&
                webcamRef !== null &&
                webcamRef.current !== undefined &&
                webcamRef.current !== null &&
                webcamRef.current.readyState === 4
            ) {
                const video = webcamRef.current;

                const img = tf.browser.fromPixels(video)

                const resized = tf.image.resizeBilinear(img, [640, 480])

                const casted = resized.cast('int32')
                const expanded = casted.expandDims(0)


                const obj = await net.executeAsync(expanded)
                const labelMap = {
                    1: { name: 'Hello', color: 'red' },
                    2: { name: 'Thank You', color: 'yellow' },
                    3: { name: 'I Love You', color: 'lime' },
                    4: { name: 'Yes', color: 'blue' },
                    5: { name: 'No', color: 'purple' },
                }
                const classes = await obj[2].array()
                const scores = await obj[4].array()
                const labels = classes[0]
                const prob = scores[0]

                for (let i = 0; i <= prob.length; i++) {
                    if (prob[i] > 0.9) {

                        const text = labels[i]


                        let str = labelMap[text]['name']

                        if (arr.length === 0 || arr[arr.length - 1] !== str) {
                            setTextArray(textArray => [...textArray, str])
                            arr.push(str)
                            console.log(arr)
                        }

                    }
                }
                tf.dispose(img)
                tf.dispose(resized)
                tf.dispose(casted)
                tf.dispose(expanded)
                tf.dispose(obj)

            }
        };
    };
    return (
        <ArrayContext.Provider value={{ textArray, setTextArray }}>
            <SignDetectContext.Provider value={runDetectionModel}>
                {children}
            </SignDetectContext.Provider>
        </ArrayContext.Provider>
    )
}
