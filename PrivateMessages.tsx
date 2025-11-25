import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Send,
  Phone,
  Video,
  Info,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

interface PrivateMessage {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachment?: string;
}

interface Conversation {
  userId: number;
  userName: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

export default function PrivateMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      userId: 1,
      userName: "أحمد محمد",
      avatar: "A",
      lastMessage: "مرحبا! كيف حالك؟",
      timestamp: "منذ 5 دقائق",
      unread: 2,
      online: true,
    },
    {
      userId: 2,
      userName: "فاطمة علي",
      avatar: "F",
      lastMessage: "شكراً على الرسالة",
      timestamp: "منذ ساعة",
      unread: 0,
      online: true,
    },
    {
      userId: 3,
      userName: "محمد سالم",
      avatar: "M",
      lastMessage: "هل تريد الانضمام للعبة؟",
      timestamp: "منذ 3 ساعات",
      unread: 1,
      online: false,
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<number>(1);
  const [messages, setMessages] = useState<PrivateMessage[]>([
    {
      id: 1,
      senderId: 1,
      senderName: "أحمد محمد",
      content: "مرحبا! كيف حالك؟",
      timestamp: "10:30 AM",
      read: true,
    },
    {
      id: 2,
      senderId: user?.id || 0,
      senderName: user?.name || "أنت",
      content: "بخير شكراً! وأنت؟",
      timestamp: "10:32 AM",
      read: true,
    },
    {
      id: 3,
      senderId: 1,
      senderName: "أحمد محمد",
      content: "تمام! هل تريد نلعب لعبة؟",
      timestamp: "10:35 AM",
      read: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: PrivateMessage = {
        id: messages.length + 1,
        senderId: user?.id || 0,
        senderName: user?.name || "أنت",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        read: true,
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const selectedChat = conversations.find((c) => c.userId === selectedConversation);
  const filteredConversations = conversations.filter((c) =>
    c.userName.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">الرسائل</h1>
          <div className="relative">
            <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن محادثة..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.userId}
              onClick={() => setSelectedConversation(conversation.userId)}
              className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-right ${
                selectedConversation === conversation.userId
                  ? "bg-blue-50 border-l-4 border-blue-600"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {conversation.avatar}
                  </div>
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {conversation.userName}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {conversation.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedChat.avatar}
                  </div>
                  {selectedChat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedChat.userName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedChat.online ? "متصل الآن" : "غير متصل"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-5 h-5 text-blue-600" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-5 h-5 text-blue-600" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Info className="w-5 h-5 text-blue-600" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === user?.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.senderId === user?.id
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-300 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === user?.id
                          ? "text-blue-100"
                          : "text-gray-600"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </Button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button variant="ghost" size="sm">
                  <Smile className="w-5 h-5 text-gray-600" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                لا توجد محادثات
              </h2>
              <p className="text-gray-600">اختر محادثة لبدء الرسائل</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

import { MessageCircle } from "lucide-react";
