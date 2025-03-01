import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatbotPlaceholder: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-6">
      <div className="flex items-center justify-center h-24 bg-gray-50 rounded-md">
        <MessageSquare className="h-6 w-6 text-gray-400 mr-2" />
        <p className="text-gray-500">Chatbot Coming Soon</p>
      </div>
    </div>
  );
};

export default ChatbotPlaceholder;