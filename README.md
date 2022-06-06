# Realtime Sign Langugage Detection (SLD)

*Create conversations in sign langugage using machine learning!!!*

Realtime SLD is a 1-to-1 video calling web application which detects sign language and displays them in realtime on the caller's screen.

## Tech Stack
<div align="left">

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)&ensp;
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)&ensp;
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)&ensp;
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)&ensp;
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)&ensp;
![TensorFlow](https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white)&ensp;

</div>

## Live Demo 

The project is live at the link - [`https://realtime-sld.vercel.app`](https://realtime-sld.vercel.app)

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

*Note :* This repository includes *.env.development* file with all the back-end credentials. This is not a good practice to include environment variables into Github Repository but for the sake of simplicity of running this project locally, the environment file is included with all the necessary credentials. Feel free to change the credentials if needed.

### Environment Variables

Here are all the environment variables needed and their details -
-   *Firebase configurations.* Any firebase account can be used a signaling server, just create a web app and extract these configurations from project settings.

       
        # Firebase Configuration
        REACT_APP_FIREBASE_API_KEY = ""
        REACT_APP_FIREBASE_AUTH_DOMAIN = ""
        REACT_APP_FIREBASE_PROJECT_ID = ""
        REACT_APP_FIREBASE_STORAGE_BUCKET = ""
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID = ""
        REACT_APP_FIREBASE_APP_ID = ""
       
-  *Tensorflow GraphModel URL.* In order to not make changes to the app everytime model gets updated, it is extracted through a simple bucket on the cloud. Right now the model of this app is hosted on the IBM Bucket and it's public url is passed as an environment variable.
       

         REACT_APP_MODEL_URL = "https://friends-dataset.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json"

-   **Accuracy Threshold.** Currently if the model is more than 90% sure then only will it displays the detected word on screen. It might be strict and we might see less detections with these values. The strictness can be varied from the range of 0 to 1 (0 being the not strict at all, 1 being only with 100% accuracy will be displayed). Ideal value range from 0.7 to 0.9 which can be changed by changing the environment variable value.
       
         REACT_APP_THRESHOLD = 0.9
## Usage
- Once You open the Web App:
    - If you are the Host, you will be able to create video call by clicking “Create Call”
    - If you are the remote caller, you will be able to join the call by pasting the joining code on the text field and then clicking on "Answer"
-	Once you create/join the call app will ask the permission for camera and microphone. Click on start to give the permission
-	Now you will be able to see your own video on left bottom
-	You can copy the joining code by first clicking on 3 dot icon and the clicking on “Copy joining code” and then share it to the remote user
-	Once the remote user joins the meet his/her video will be visible on the screen
-	You can refer the available signs that can be detected by app by clicking on info icon (i)
-	Now when the remote user uses the hand signs, app will detect and show it in text in realtime
-	At last one can end the meet by clicking on red button


# About the Project
I opted for the first challenge i.e. Face Recognition track and developed a video calling app which can detect and display sign language into English words in Realtime.

This project uses Tensorflow to make detections and WebRTC to make videocalls. For the front-end, React library is used and for the detections, Tensorflow.js library is used to load the model and make predictions on the remote video stream receving from the caller through WebRTC.

## Terms explained
- *Tensorflow :* TensorFlow is an end-to-end open source platform for machine learning. It has a comprehensive, flexible ecosystem of tools, libraries and community resources that lets researchers push the state-of-the-art in ML and developers easily build and deploy ML powered applications.
- *WebRTC :* Web RealTime communication. With WebRTC, you can add real-time communication capabilities to your application that works on top of an open standard. It supports video, voice, and generic data to be sent between peers, allowing developers to build powerful voice- and video-communication solutions.
- *React :* React is a free and open-source front-end JavaScript library for building user interfaces based on UI components.

## Working

Let's see how the app is working behind the scenes -

![Project Architecture](https://user-images.githubusercontent.com/24872423/171057640-4867f621-d53e-487d-842b-ced483a21988.jpg)

Using WebRTC a 1-to-1, peer-to-peer, video communication is established.
When user clicks on "Create a New Call", an offer is generated inside the Firebase Firestore Cloud Database and a unique code is returned to the user 1 who can now share this unique code with anyone in the world and the user 2 can input the joining code and click on "Answer" to join the call.

Every user, i.e, User 1 and User 2, both have two components,
-   A video stream which webcam is capturing
-   A remote stream receiving from the opposite user in order to display on screen

As soon as the remote stream starts, before displaying it to the screen, a reference of the remote stream is passed to the Tensorflow Graph Model where it analyses and run detection on the remote stream reference every 500 miliseconds and as soon as it detects any sign over the mentioned threshold, it finds that word in the map provided and shows the word on screen.

On every 5000 miliseconds of any word appearing, the word which came first is deleted forming a Queue.

# Limitations

Due to lack of time and resources available, the model performance is subpar. 
Performance can be improved by adding more data samples and by using a more sophisticated model with a higher number of parameters. We also aim to add more sign language vocabulary in the future.