import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { io } from "socket.io-client";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Navbar from "../../components/navbar/navbar.jsx";
import { Send, User as UserIcon } from "lucide-react";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const token = Cookies.get("token");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetch(`${apiUrl}conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setConversations(data.data);
        }
      })
      .catch(console.error);

    const socketUrl = apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
    const socket = io(socketUrl, {
      auth: { token }
    });
    
    socketRef.current = socket;

    socket.on("new_message", (msg) => {
      setMessages(prev => {
        if (selectedConv && msg.conversationId === selectedConv._id) {
          return [...prev, msg];
        }
        return prev;
      });
      
      setConversations(prev => prev.map(c => 
        c._id === msg.conversationId 
          ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt } 
          : c
      ));
    });

    return () => {
      socket.disconnect();
    };
  }, [apiUrl, token, selectedConv]);

  useEffect(() => {
    if (selectedConv) {
      socketRef.current?.emit("join_chat", selectedConv._id);

      fetch(`${apiUrl}conversations/${selectedConv._id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMessages(data.data.reverse());
            scrollToBottom();
          }
        })
        .catch(console.error);
    }
  }, [selectedConv, apiUrl, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !selectedConv) return;

    try {
      const res = await fetch(`${apiUrl}conversations/${selectedConv._id}/messages`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ content: inputMsg })
      });
      const data = await res.json();
      if (data.success) {
        setInputMsg("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const parseJwt = (t) => {
    try { return JSON.parse(atob(t.split('.')[1])); } catch (e) { return null; }
  };
  const myId = parseJwt(token)?.sub;

  const getOtherParticipant = (conv) => {
    return conv.participants.find(p => p._id !== myId) || conv.participants[0];
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />

      <main className="flex-1 p-4 lg:p-6 mt-16 lg:mt-0 max-h-screen overflow-hidden flex flex-col">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex overflow-hidden">
          
          <div className="w-1/3 border-r border-gray-100 flex flex-col bg-white">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">
                  No active conversations. Accept a match to start chatting!
                </div>
              ) : (
                conversations.map(conv => {
                  const otherUser = getOtherParticipant(conv);
                  return (
                    <div 
                      key={conv._id}
                      onClick={() => setSelectedConv(conv)}
                      className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition ${selectedConv?._id === conv._id ? 'bg-indigo-50/50' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                          {otherUser?.firstname?.[0]?.toUpperCase() || <UserIcon size={20} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {otherUser?.firstname} {otherUser?.lastname}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {conv.lastMessage || "No messages yet"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-gray-50/30">
            {selectedConv ? (
              <>
                <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-3 shadow-sm z-10">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    {getOtherParticipant(selectedConv)?.firstname?.[0]?.toUpperCase() || <UserIcon size={20} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {getOtherParticipant(selectedConv)?.firstname} {getOtherParticipant(selectedConv)?.lastname}
                    </h3>
                    <p className="text-xs text-indigo-500 font-medium bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      Match Score: {selectedConv.matchId?.matchScore ?? 'N/A'}%
                    </p>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {messages.map((msg, i) => {
                    const isMe = msg.senderId?._id === myId || msg.senderId === myId;
                    return (
                      <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          isMe 
                            ? 'bg-indigo-600 text-white rounded-tr-sm' 
                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-gray-100">
                  <form onSubmit={sendMessage} className="flex gap-2">
                    <input 
                      type="text" 
                      value={inputMsg}
                      onChange={(e) => setInputMsg(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    <button 
                      type="submit"
                      disabled={!inputMsg.trim()}
                      className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
                    >
                      <Send size={18} className="ml-[-2px]" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                  <UserIcon size={32} className="text-indigo-200" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Your Messages</h3>
                <p className="max-w-xs">Select a conversation from the list to start chatting and coordinate item recovery.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
