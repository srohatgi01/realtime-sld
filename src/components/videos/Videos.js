import { useRef, useState } from "react";
import { ReactComponent as HangupIcon } from "../../icons/hangup.svg";
import { ReactComponent as MoreIcon } from "../../icons/more-vertical.svg";
import { ReactComponent as CopyIcon } from "../../icons/copy.svg";
import { ReactComponent as InfoIcon } from "../../icons/info.svg";
import { initFirestore } from "../../firebase/firebase"
import { useSignDetect } from "../../providers/signDetectProvider";
import { servers as stunDetails } from "../../constants/maps";
import { labelMap } from "../../constants/maps";
import "./styles.css"


//Initialize Firestore
const firestore = initFirestore()

// New RTCPeerConnection with stun server deatails as parameters
const pc = new RTCPeerConnection(stunDetails);

function Videos({ mode, callId, setPage }) {
    const [webcamActive, setWebcamActive] = useState(false);
    const [infoActive, setInfoActive] = useState(false);
    const [roomId, setRoomId] = useState(callId);
    const runDetectionModel = useSignDetect()

    const localRef = useRef();
    const remoteRef = useRef();

    const setupSources = async () => {
        // getting video and audio stream from local client
        const localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        // initalizing remote stream with mediastream for future use
        const remoteStream = new MediaStream();

        // adding local stream to RTC track
        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });

        // adding remote stream to RTC track
        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });
        };

        // setting both references to live stream in order to be referrenced later
        localRef.current.srcObject = localStream;
        remoteRef.current.srcObject = remoteStream;

        //making detections on the remote stream
        runDetectionModel(remoteRef)


        setWebcamActive(true);

        // creating new call
        if (mode === "create") {
            const callDoc = firestore.collection("calls").doc();
            const offerCandidates = callDoc.collection("offerCandidates");
            const answerCandidates = callDoc.collection("answerCandidates");

            setRoomId(callDoc.id);

            pc.onicecandidate = (event) => {
                event.candidate &&
                    offerCandidates.add(event.candidate.toJSON());
            };

            const offerDescription = await pc.createOffer();
            await pc.setLocalDescription(offerDescription);

            const offer = {
                sdp: offerDescription.sdp,
                type: offerDescription.type,
            };

            await callDoc.set({ offer });

            callDoc.onSnapshot((snapshot) => {
                const data = snapshot.data();
                if (!pc.currentRemoteDescription && data?.answer) {
                    const answerDescription = new RTCSessionDescription(
                        data.answer
                    );
                    pc.setRemoteDescription(answerDescription);
                }
            });

            answerCandidates.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const candidate = new RTCIceCandidate(
                            change.doc.data()
                        );
                        pc.addIceCandidate(candidate);
                    }
                });
            });

            // joining a call
        } else if (mode === "join") {
            const callDoc = firestore.collection("calls").doc(callId);
            const answerCandidates = callDoc.collection("answerCandidates");
            const offerCandidates = callDoc.collection("offerCandidates");

            pc.onicecandidate = (event) => {
                event.candidate &&
                    answerCandidates.add(event.candidate.toJSON());
            };

            const callData = (await callDoc.get()).data();

            const offerDescription = callData.offer;
            await pc.setRemoteDescription(
                new RTCSessionDescription(offerDescription)
            );

            const answerDescription = await pc.createAnswer();
            await pc.setLocalDescription(answerDescription);

            const answer = {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
            };

            await callDoc.update({ answer });

            offerCandidates.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        let data = change.doc.data();
                        pc.addIceCandidate(new RTCIceCandidate(data));
                    }
                });
            });
        }

        // on connection issues, disconnect (call hangup)
        pc.onconnectionstatechange = (event) => {
            if (pc.connectionState === "disconnected") {
                hangUp();
            }
        };
    };


    /**
     * Close the RTCPeerConnection, and delete open connection details
     * deallocate the rosources, reload the page. 
     */
    const hangUp = async () => {
        pc.close();

        if (roomId) {
            let roomRef = firestore.collection("calls").doc(roomId);
            await roomRef
                .collection("answerCandidates")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        doc.ref.delete();
                    });
                });
            await roomRef
                .collection("offerCandidates")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        doc.ref.delete();
                    });
                });

            await roomRef.delete();
        }

        window.location.reload();
    };

    const infoMap = []
    if(labelMap){
        for (var i = 1; i < 6; i++) {
            infoMap.push(
            <div className='infoCard' key={i}>
                <img src={labelMap[i]["img"]} alt={labelMap[i]["name"]} />
                <h3>{labelMap[i]["name"]}</h3>
            </div>
            );
          }
    }
    

    return (
        // local video stream on the right bottom
        <div className="videos">
            <video
                ref={localRef}
                autoPlay
                playsInline
                className="local"
                muted
            />

            {/* remote incoming video on the entire screen */}
            <video ref={remoteRef} autoPlay playsInline className="remote" />

            {/* Utility functions */}
            <div className="buttonsContainer">
                <button className="info button" onClick={() => {
                    setInfoActive(!infoActive)
                }}>
                    <InfoIcon />
                </button >
                <button
                    onClick={hangUp}
                    disabled={!webcamActive}
                    className="hangup button"
                >
                    <HangupIcon />
                </button>
                <div tabIndex={0} role="button" className="more button">
                    <MoreIcon />
                    <div className="popover">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(roomId);
                            }}
                        >
                            <CopyIcon /> Copy joining code
                        </button>
                    </div>
                </div>
            </div>

            {/* if webcam is not active displaying model and enabling webcam & audio */}
            {!webcamActive && (
                <div className="modalContainer">
                    <div className="modal">
                        <h3>
                            Turn on your camera and microphone and start the
                            call
                        </h3>
                        <div className="container">
                            <button
                                onClick={() => setPage("home")}
                                className="secondary"
                            >
                                Cancel
                            </button>
                            <button onClick={setupSources}>Start</button>
                        </div>
                    </div>
                </div>
            )}
            {infoActive && (
                <div className="modalContainer">
                    <div className="infomodal">
                        <span
                            onClick={() => { setInfoActive(false) }}
                            className="close">&times;</span>
                            <h1>Available Signs</h1>
                            {infoMap}
                        
                    </div>
                </div>
            )}
        </div>
    );
}

export default Videos