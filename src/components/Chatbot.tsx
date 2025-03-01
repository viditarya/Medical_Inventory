import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import axios from 'axios';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your medical inventory assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Toggle chatbot open/closed
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // Handle sending a message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // const response = await axios.post('http://localhost:5000/chatbot_query', {
      //   query: inputValue,
      // });
      
      // Simulate API response with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let botResponse = '';
      
      // Simple keyword-based responses for demo
      const query = inputValue.toLowerCase();
      
      if (query.includes('aspirin') && query.includes('stock')) {
        botResponse = "We currently have 200 units of Aspirin in stock, which is above the threshold of 150 units.";
      } else if (query.includes('paracetamol') && query.includes('demand')) {
        botResponse = "The predicted demand for Paracetamol next month is 300 units, which is higher than our current stock of 250 units. I recommend ordering at least 50 more units.";
      } else if (query.includes('low') && query.includes('stock')) {
        botResponse = "We have 2 medicines with critically low stock: Loratadine (45 units) and Cetirizine (30 units). Both are antihistamines and should be restocked soon.";
      } else if (query.includes('weather') && query.includes('impact')) {
        botResponse = "Based on weather forecasts, we expect a 20% increase in demand for antihistamines due to the upcoming pollen season. The high humidity and temperature will likely trigger allergies.";
      } else if (query.includes('order') || query.includes('restock')) {
        botResponse = "I recommend restocking Cetirizine (30 units) and Loratadine (45 units) as they are below threshold levels. Would you like me to prepare an order request?";
      } else {
        botResponse = "I'm not sure I understand your query. You can ask me about current stock levels, predicted demand, or recommendations for restocking.";
      }
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chatbot toggle button */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 z-50"
        aria-label="Open chatbot"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
      
      {/* Chatbot dialog */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-50 flex flex-col overflow-hidden transition-all duration-300 max-h-[70vh]">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-medium">Medical Inventory Assistant</h3>
            <button onClick={toggleChatbot} className="text-white hover:text-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-[50vh]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
                <div
                  className={`text-xs mt-1 text-gray-500 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-left mb-3">
                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none inline-block">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3">
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about inventory..."
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
                disabled={isLoading || !inputValue.trim()}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;