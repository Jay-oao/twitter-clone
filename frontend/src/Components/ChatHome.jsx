import React, { useEffect, useState , } from 'react';
import { getChatAccounts, startChat } from '../api/ChatAccountApi';
import '../css/chathome.css';
import { useNavigate } from 'react-router-dom';

function ChatHome() {
  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSearch , setNewSearch] = useState('');
  const [chatAcc, setChatAcc] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getChatAccounts(sessionStorage.getItem("id"))
      .then(response => {
        const acc = response.data.map((acc) => ({
          id: acc.id,
          username: acc.username,
          dp: acc.displayPicture
        }));
        setAccounts(acc);
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    const initiateChat = async () => {
      try {
        const response = await startChat(sessionStorage.getItem("id"), newSearch);
        setChatAcc(response.data);
        console.log(response);
        
      } catch (error) {
        console.error('Error starting chat:', error);
      }
    };
  
    initiateChat(); 
  
  }, [newSearch]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleChatChange = (event) =>{
    setNewSearch(event.target.value);
  }

  const filteredAccounts = accounts.filter(account =>
    account.username.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (
    <div className="chat-home">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Direct Messages"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="chat-list">
        {filteredAccounts.map(account => (
          <div key={account.id} className="chat-card" onClick={()=>{
              navigate('/chat/dm')
              sessionStorage.setItem("to",account.id)
              console.log(sessionStorage.getItem("to"))
            }}>
            <img src={`https://via.placeholder.com/50x50?text=${account.username}`} alt="Profile Pic"/>
            <div className="details">
              <div className="username">{account.username}</div>
            </div>
          </div>
        ))}
      </div>
      
      <button
      className="fixed-button"
      onClick={() => setIsModalOpen(true)}
    >
      +
    </button>

      {isModalOpen && (
      <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          placeholder="Start new Chat"
          value={newSearch}
          onChange={(handleChatChange)}
        />

        <div className="chat-list">
        {chatAcc.map(account => (
          <div key={account.id} className="chat-card" onClick={()=>{
              navigate('/chat/dm')
              sessionStorage.setItem("to",account.id)
              console.log(sessionStorage.getItem("to"))
            }}>
            <img src={`https://via.placeholder.com/50x50?text=${account.username}`} alt="Profile Pic"/>
            <div className="details">
              <div className="username">{account.username}</div>
            </div>
          </div>
        ))}
        </div>

        <button className="close-modal" onClick={() => setIsModalOpen(false)}>Close</button>
        </div>
      </div>
    )}


    </div>
  );
}

export default ChatHome;
