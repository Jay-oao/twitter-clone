/* eslint-disable */

import React, { useState, useEffect , useRef} from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { renderChats } from '../api/ChatAccountApi';
import { formatDistanceToNow, parseISO , format} from 'date-fns';
import '../css/messagecard.css' 

function ChatCard() {
    const [client, setClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/message'),
            onConnect: () => {
                console.log('Connected to WebSocket');

                stompClient.subscribe('/topic/'+sessionStorage.getItem("id"), (message) => {
                    if (message.body) {
                        const local_messages = [{
                            msg:message.body,
                            time: new Date().toISOString(),
                            sender: sessionStorage.getItem("to")
                        }]
                        setMessages(prevMsg => [...prevMsg,...local_messages])

                    }
                });

                setClient(stompClient);
            },
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, []);

    const sendMessage = () => {
        if (client && client.connected) {
            client.publish({
                destination: `/app/sendMessage/${sessionStorage.getItem("to")}`,
                body:JSON.stringify(
                    {
                        "msg": newMessage,
                        "sender": {
                            "id": sessionStorage.getItem("id")
                        },
                        "receiver": {
                            "id": sessionStorage.getItem("to")
                        }
                    }
                )
            })
            const local_messages = [{
                msg:newMessage,
                time: new Date().toISOString(),
                sender: sessionStorage.getItem("id")
            }]
            setMessages(prevMsg => [...prevMsg,...local_messages])
            setNewMessage('')
      
        }
    };

    useEffect(()=>{
        renderChats(sessionStorage.getItem("id"),sessionStorage.getItem("to"))
            .then(response=>{
                const local_messages = response.data.map((message)=>({
                    msg : message[0],
                    time : message[1],
                    sender : message[2]
                }))
                setMessages(prevMsg => [...prevMsg,...local_messages]
                .sort((a, b) => new Date(a.time) - new Date(b.time)))
            })
            .catch(error=>console.log(error))
    },[])


    function formatTimeAgo(timestamp) {
        const parsedDate = parseISO(timestamp);
        const now = new Date();
        const diffInHours = (now - parsedDate) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            return format(parsedDate, 'hh:mm a'); 
        } else {
            return formatDistanceToNow(parsedDate, { addSuffix: true }); 
        }
    }

  return (
    <div className="chat-container">
     

      <div className="message-list">
        {messages.map((message, index) => (
          <div key={index} className="msg-card-div">
            {message.sender == sessionStorage.getItem('id') ? (
              <div className='message-card-sender'>
                <div className='message-msg-sender'>{message.msg}</div>
                <div className='message-time'>{formatTimeAgo(message.time)}</div>
                <br/><br/><br/>
              </div>
            ) : (
              <div className='message-card-receiver'>
                <div className='message-msg-receiver'>{message.msg}</div>
                <div className='message-time'>{formatTimeAgo(message.time)}</div>
                <br/><br/><br/>
              </div>
            )}
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>


      <div className="input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>


    </div>
  );
  
}

export default ChatCard