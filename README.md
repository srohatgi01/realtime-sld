# Realtime SLD

**Create conversations in Realtime using Sign Langugage!!!**

Realtime SLD is a 1-to-1 video calling web application which detects sign language and displays them in realtime on the caller's screen.

## Live Project

The project is live at the link - https://realtime-sld.vercel.app

## Prerequisites

The prerequisites required for this project to run locally are - 
- NodeJS (Node v16.14.2 Preferred)
- Git

## Installation

Running this project locally is as easy as running few commands given below -
```
git clone https://github.com/srohatgi01/realtime-sld
cd ./realtime-sld/

npm install

npm start
```

**Note :** This repository includes **.env.development** file with all the back-end credentials. This is not a good practice to include enviroment variables into Github Repository but for the sake of simplicity of running this project locally, the enviroment file is included with all the necessary credentials. Feel free to change the credentials if needed.  

## Usage
- Once You open the Web App:
    - If you are the Host, you will be able to create video call by clicking “Create Call”
    - If you are the remote caller, you will be able to join the call by pasting the joining code on the text field and then clicking on "Answer"
-	Once you create/join the call app will ask the permission for camera and microphone. Click on start to give the permission
-	Now you will be able to see your own video on left bottom
-	You can copy the joining code by first clicking on 3 dot icon and the clicking on “Copy joining code” and then share it to the remote user
-	Once the remote user joins the meet his/her video will be visible on the screen
-	You can refer the available signs that can be detected by app by clicking on info icon (i)
-	Now when the remote uses those hand signs the app will detect and show it in text in realtime
-	At last one can end the meet by clicking on red button to end the meet


# About the Project
I opted for the first challenge i.e. Face Recognition track and developed a video calling app which can detect and display sign language into English words in Realtime.

This project uses Tensorflow to make detections and WebRTC to make videocalls. For the front-end, React library is used and for the detections, Tensorflow.js library is used to load the model and make predictions on the remote video stream receving from the caller through WebRTC.

## Terms explained
- **Tensorflow :** TensorFlow is an end-to-end open source platform for machine learning. It has a comprehensive, flexible ecosystem of tools, libraries and community resources that lets researchers push the state-of-the-art in ML and developers easily build and deploy ML powered applications.
- **WebRTC :** Web RealTime communication. With WebRTC, you can add real-time communication capabilities to your application that works on top of an open standard. It supports video, voice, and generic data to be sent between peers, allowing developers to build powerful voice- and video-communication solutions.
- **React :** React is a free and open-source front-end JavaScript library for building user interfaces based on UI components.
