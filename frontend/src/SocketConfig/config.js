import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


const TweetComponent = () => {
    const [client, setClient] = useState(null);
    const [message, setMessage] = useState('');


    useEffect(() => {
        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/tweets'),
            onConnect: () => {
                console.log('Connected to WebSocket');

                stompClient.subscribe('/topic/'+sessionStorage.getItem("id"), (message) => {
                    if (message.body) {
                        console.log('Received message:', message.body); 
                    }
                });

                setClient(stompClient);
            },
            // debug: (str) => {
            //     console.log(str);
            // }
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, []);

    const sendMessage = () => {
        if (client && client.connected) {
            client.publish({
                destination: '/app/sendMessage/1',
                body:JSON.stringify(
                    {
                        "msg": "This is a tweet message",
                        "sender": {
                            "id": 1,
                        },
                        "receiver": {
                            "id": 69,
                        }
                    }
                ) 
            })
            setMessage(''); 
        }
    };

    return (
        <div>
            <h2>WebSocket Test</h2>
            <p>Open the console to see messages received from the server.</p>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default TweetComponent;
