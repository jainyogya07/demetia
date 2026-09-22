import { useState } from 'react';
import { Send, Globe } from 'lucide-react';

function ChatAssistant() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am Saheli. How can I help you today?',
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { sender: 'user', text: message }]);
    setMessage('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-assistant-page">
      <div className="chat-assistant-header">
        <div>
          <h2>Chat with Saheli</h2>
          <p>Ask for help in your preferred language.</p>
        </div>

        <button type="button" className="chat-language-button">
          <Globe size={18} />
          Hindi / English
        </button>
      </div>

      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((item, index) => (
            <div key={index} className={`chat-message ${item.sender}`}>
              {item.text}
            </div>
          ))}
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            value={message}
            placeholder="Type your message here..."
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="button" onClick={sendMessage}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatAssistant;
