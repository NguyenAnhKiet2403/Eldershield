import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, AlertTriangle, X } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner@2.0.3";

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isSpam: boolean;
  isRead: boolean;
}

interface ChatMessage {
  id: string;
  content: string;
  time: string;
  isFromUser: boolean;
  isSpam: boolean;
}

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "Mẹ",
    content: "Con đang ở đâu vậy?",
    time: "10:30",
    isSpam: false,
    isRead: true
  },
  {
    id: "2",
    sender: "0987654321",
    content: "Chúc mừng! Bạn đã trúng giải 500 triệu. Nhấn link để nhận: bit.ly/fake-link",
    time: "09:15",
    isSpam: true,
    isRead: false
  },
  {
    id: "3",
    sender: "Ngân hàng ABC",
    content: "Tài khoản của bạn bị khóa. Vui lòng cung cấp mã PIN để mở khóa",
    time: "08:45",
    isSpam: true,
    isRead: false
  },
  {
    id: "4",
    sender: "Bác sĩ Hùng",
    content: "Lịch khám vào thứ 2 tuần sau lúc 9h",
    time: "Hôm qua",
    isSpam: false,
    isRead: true
  }
];

const mockChatMessages: { [key: string]: ChatMessage[] } = {
  "1": [
    { id: "1", content: "Con đang ở đâu vậy?", time: "10:30", isFromUser: false, isSpam: false },
    { id: "2", content: "Con đang ở nhà bạn ạ", time: "10:32", isFromUser: true, isSpam: false }
  ],
  "2": [
    { id: "1", content: "Chúc mừng! Bạn đã trúng giải 500 triệu. Nhấn link để nhận: bit.ly/fake-link", time: "09:15", isFromUser: false, isSpam: true }
  ]
};

export function MessagesTab() {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set());

  const handleMessageClick = (messageId: string) => {
    setSelectedMessage(messageId);
  };

  const handleBack = () => {
    setSelectedMessage(null);
  };

  const dismissWarning = (messageId: string) => {
    setDismissedWarnings(prev => new Set([...prev, messageId]));
    toast.info("Đã ẩn cảnh báo", { duration: 2000 });
  };

  if (selectedMessage) {
    const message = mockMessages.find(m => m.id === selectedMessage);
    const chatMessages = mockChatMessages[selectedMessage] || [];
    
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b-2 border-gray-200 p-4 flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="min-h-[56px] min-w-[56px] p-0"
          >
            <ArrowLeft className="w-7 h-7" />
          </Button>
          <div>
            <h3>{message?.sender}</h3>
          </div>
        </div>

        {/* Warning for spam messages */}
        {message?.isSpam && !dismissedWarnings.has(selectedMessage) && (
          <Alert className="m-4 border-2 border-orange-300 bg-orange-50">
            <AlertTriangle className="h-7 w-7 text-orange-700" />
            <AlertDescription className="text-orange-800 pr-10">
              ⚠️ Cảnh báo: Tin nhắn này có thể là lừa đảo!
            </AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 min-h-[44px] min-w-[44px] p-0"
              onClick={() => dismissWarning(selectedMessage)}
            >
              <X className="w-6 h-6" />
            </Button>
          </Alert>
        )}

        {/* Chat messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isFromUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-2xl ${
                  msg.isFromUser
                    ? 'bg-blue-500 text-white'
                    : msg.isSpam
                    ? 'bg-orange-50 border-2 border-orange-300'
                    : 'bg-gray-100'
                }`}
              >
                <p>{msg.content}</p>
                <p className={`text-[16px] mt-2 ${msg.isFromUser ? 'text-blue-100' : 'text-[#4a4a4a]'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="p-4">
        <h2 className="mb-6">Tin nhắn</h2>
        <div className="space-y-3">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 border-2 rounded-2xl cursor-pointer hover:bg-gray-50 ${
                message.isSpam ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
              } ${!message.isRead ? 'bg-blue-50 border-blue-300' : ''}`}
              onClick={() => handleMessageClick(message.id)}
            >
              <div className="flex items-start gap-3">
                {message.isSpam && (
                  <AlertTriangle className="w-7 h-7 text-orange-700 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`${!message.isRead ? 'font-bold' : ''}`}>
                      {message.sender}
                    </h3>
                    <span className="text-[#4a4a4a] flex-shrink-0">
                      {message.time}
                    </span>
                  </div>
                  <p className={`text-[#1a1a1a] line-clamp-2 ${!message.isRead ? 'font-medium' : ''}`}>
                    {message.content}
                  </p>
                  {message.isSpam && (
                    <p className="text-orange-800 mt-2">
                      ⚠️ Nghi ngờ lừa đảo
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}