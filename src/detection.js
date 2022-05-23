import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import "./App.css";

export default function detectSignLanguage(webcamRef) {
    const runCoco = async () => {
        // console.log("Coco is running")
        // const net = await tf.loadGraphModel('https://lobe01.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json')
        // Python trained Youtube model
        const net = await tf.loadGraphModel('https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json')

        setInterval(() => {
            // console.log("Calling Detect")
            detect(net);
        }, 500);

        const detect = async (net) => {
            // console.log(webcamRef.current)
            // console.log(typeof webcamRef)
            // console.log(webcamRef.current.readyState)
            if (
                typeof webcamRef !== "undefined" &&
                webcamRef !== null &&
                webcamRef.current.readyState === 4
            ) {
                const video = webcamRef.current;

                const img = tf.browser.fromPixels(video)
                // const resized = tf.image.resizeBilinear(img, [224, 224])
                const resized = tf.image.resizeBilinear(img, [640, 480])
                // const casted = resized.cast('float32')
                const casted = resized.cast('int32')
                const expanded = casted.expandDims(0)

                // const obj = await net.execute(expanded)
                const obj = await net.executeAsync(expanded)
                const labelMap = {
                    1:{name:'Hello', color:'red'},
                    2:{name:'Thank You', color:'yellow'},
                    3:{name:'I Love You', color:'lime'},
                    4:{name:'Yes', color:'blue'},
                    5:{name:'No', color:'purple'},
                }
                // const out = await obj.array()
                const classes = await obj[2].array()
                const scores = await obj[4].array()
                // console.log(classes)
                console.log(scores[0])
                const labels=classes[0]
                const prob=scores[0]
                for(let i=0; i<=prob.length; i++){
                    if(prob[i]>0.4){
                        console.log(i)
                        const text = labels[i]    
                        console.log(labelMap[text]['name'] + ' - ' + Math.round(prob[i]*100)/100)
                    }
                }

                // if (out) {
                //     let maxi = out[0][0]
                //     let ind = 0;

                //     for (let i = 0; i < 4; i++) {
                //         if (out[0][i] > maxi) {
                //             maxi = out[0][i]
                //             ind = i
                //         }
                //     }
                //     console.log(maxi)
                //     console.log(`index`, ind)
                // }


                tf.dispose(img)
                tf.dispose(resized)
                tf.dispose(casted)
                tf.dispose(expanded)
                tf.dispose(obj)

            }
        };
    };

    runCoco();
}