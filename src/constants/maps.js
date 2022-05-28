import Hello from "../images/hello.PNG"
import Ily from "../images/ily.PNG"
import No from "../images/no.PNG"
import Ty from "../images/ty.PNG"
import Yes from "../images/yes.PNG"
// Labels for detected texts
export const labelMap = {
    1: { name: 'Hello', img: Hello },
    2: { name: 'Thank You', img: Ty },
    3: { name: 'I Love You', img: Ily },
    4: { name: 'Yes', img: Yes },
    5: { name: 'No', img: No },
}

// Initialize WebRTC
export const servers = {
    iceServers: [
        {
            urls: [
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
            ],
        },
    ],
    iceCandidatePoolSize: 10,
};

//Model URL
export const modelurl = "https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json"