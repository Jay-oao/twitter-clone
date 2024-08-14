import React, { useEffect, useState , } from 'react';
import { getChatAccounts } from '../api/ChatAccountApi';
import '../css/chathome.css';
import { useNavigate } from 'react-router-dom';



function ChatHome() {
  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

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
    </div>
  );
}

export default ChatHome;
