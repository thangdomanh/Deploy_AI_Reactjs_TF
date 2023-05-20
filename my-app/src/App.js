// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";
import { nextFrame } from "@tensorflow/tfjs";
// Import vẽ module draw utility
// import { drawRect } from "./utilities";
import { drawRect } from "./utilities";

function App() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    // Main function
    const runCoco = async() => {
        // Load mạng
        // const net = await cocossd.load();
        // https://raw.githubusercontent.com/thangdomanh/Model_TFJS_LanguageDetection/main/converted/model.json
        const net = await tf.loadGraphModel('https://raw.githubusercontent.com/thangdomanh/Model_TFJS_LanguageDetection/main/converted/model.json')

        //  Quá trình lặp và detect:
        setInterval(() => {
            detect(net);
        }, 16.7);
    };

    const detect = async(net) => {
        // Kiểm tra data đã có chưa
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // Các thông số của video
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Đặt kích thước cho video
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Đặtkích thước canvas
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // Thực hiện việc phát hiện 
            const img = tf.browser.fromPixels(video)
            const resized = tf.image.resizeBilinear(img, [640, 480])
            const casted = resized.cast('int32')
            const expanded = casted.expandDims(0)
            const obj = await net.executeAsync(expanded)
            console.log(obj)

            const boxes = await obj[1].array()
            const classes = await obj[2].array()
            const scores = await obj[4].array()

            // Vẽ mesh
            const ctx = canvasRef.current.getContext("2d");

            // cập nhập utility
            // drawSomething(obj, ctx)  
            requestAnimationFrame(() => { drawRect(boxes[0], classes[0], scores[0], 0.8, videoWidth, videoHeight, ctx) });

            tf.dispose(img)
            tf.dispose(resized)
            tf.dispose(casted)
            tf.dispose(expanded)
            tf.dispose(obj)

        }
    };

    useEffect(() => { runCoco() }, []);

    return ( <
        div className = "App" >
        <
        header className = "App-header" >
        <
        Webcam ref = { webcamRef }
        muted = { true }
        style = {
            {
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 9,
                width: 640,
                height: 480,
            }
        }
        />

        <
        canvas ref = { canvasRef }
        style = {
            {
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 8,
                width: 640,
                height: 480,
            }
        }
        /> < /
        header > <
        /div>
    );
}

export default App;