import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { io } from "socket.io-client";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Navbar from "../../components/navbar/navbar.jsx";
import { Send, User as UserIcon, MessageSquare, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const [isLoadingConvs, setIsLoadingConvs] = useState(true);
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const token = Cookies.get("token");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/";

  const parseJwt = (t) => {
    try {
      return JSON.parse(atob(t.split(".")[1]));
    } catch (_) {
      return null;
    }
  };
  const myId = parseJwt(token)?.sub;

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Fetch conversations list
  useEffect(() => {
    if (!token) return;

    setIsLoadingConvs(true);
    fetch(`${apiUrl}conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const convList = data?.data?.data || data?.data || data || [];
        if (Array.isArray(convList)) {
          setConversations(convList);
          if (convList.length > 0 && !selectedConv && window.innerWidth >= 768) {
            setSelectedConv(convList[0]);
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingConvs(false));

    const socketUrl = apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
    const socket = io(socketUrl, {
      auth: { token },
    });
    socketRef.current = socket;

    socket.on("new_message", (msg) => {
      setMessages((prev) => {
        if (selectedConv && msg.conversationId === selectedConv._id) {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        }
        return prev;
      });

      setConversations((prev) =>
        prev.map((c) =>
          c._id === msg.conversationId
            ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt }
            : c
        )
      );
    });

    socket.on("user_typing", ({ userId, isTyping: typingStatus }) => {
      if (userId !== myId) {
        setIsTyping(typingStatus);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [apiUrl, token]);

  // Handle selected conversation change & join socket room
  useEffect(() => {
    if (!selectedConv || !token) return;

    // Correct socket event name matching backend index.js
    socketRef.current?.emit("join_conversation", selectedConv._id);

    setIsLoadingMsgs(true);
    fetch(`${apiUrl}conversations/${selectedConv._id}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const msgList = data?.data?.data || data?.data || data || [];
        if (Array.isArray(msgList)) {
          setMessages(msgList);
          setTimeout(() => scrollToBottom("auto"), 50);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingMsgs(false));

    return () => {
      socketRef.current?.emit("leave_conversation", selectedConv._id);
    };
  }, [selectedConv, apiUrl, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim() || !selectedConv) return;

    const messageText = inputMsg.trim();
    setInputMsg("");

    try {
      const res = await fetch(`${apiUrl}conversations/${selectedConv._id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: messageText }),
      });
      const data = await res.json();
      const savedMsg = data?.data?.data || data?.data || data;

      if (savedMsg && savedMsg._id) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === savedMsg._id)) return prev;
          return [...prev, savedMsg];
        });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const getOtherParticipant = (conv) => {
    if (!conv?.participants || !Array.isArray(conv.participants)) return null;
    return conv.participants.find((p) => p._id !== myId) || conv.participants[0];
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Navbar />
      <Sidebar />

      <main className="flex-1 flex flex-col p-3 md:p-6 mt-14 md:mt-0 max-h-screen overflow-hidden">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 flex-1 flex overflow-hidden">
          {/* ── Left: Conversations List ── */}
          <div
            className={`w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col bg-white shrink-0 ${
              selectedConv ? "hidden md:flex" : "flex"
            }`}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="text-indigo-600" size={22} /> Messages
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Direct chat for verified matches</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {isLoadingConvs ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex gap-3 items-center animate-pulse">
                      <div className="w-12 h-12 rounded-2xl bg-gray-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-indigo-400">
                    <MessageSquare size={28} />
                  </div>
                  <h4 className="font-semibold text-gray-700 text-sm">No Conversations Yet</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">
                    Accept a potential match to start chatting with the item finder or owner.
                  </p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const otherUser = getOtherParticipant(conv);
                  const isSelected = selectedConv?._id === conv._id;
                  const matchScore = conv.matchId?.matchScore;

                  return (
                    <div
                      key={conv._id}
                      onClick={() => setSelectedConv(conv)}
                      className={`p-4 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-indigo-50/80 border-l-4 border-indigo-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {otherUser?.profileImage ? (
                          <img
                            src={otherUser.profileImage}
                            alt={otherUser.firstname}
                            className="w-12 h-12 rounded-2xl object-cover shadow-sm shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                            {otherUser?.firstname?.[0]?.toUpperCase() || <UserIcon size={20} />}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold text-gray-800 text-sm truncate">
                              {otherUser?.firstname} {otherUser?.lastname}
                            </h3>
                            {matchScore !== undefined && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 shrink-0">
                                {matchScore}% Match
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {conv.lastMessage || "Conversation started"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Right: Active Chat Area ── */}
          <div
            className={`flex-1 flex flex-col bg-slate-50/50 ${
              !selectedConv ? "hidden md:flex" : "flex"
            }`}
          >
            {selectedConv ? (
              <>
                {/* Chat Top Header */}
                <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-xs z-10">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConv(null)}
                      className="md:hidden p-1.5 rounded-xl hover:bg-gray-100 text-gray-600 transition"
                      aria-label="Back to conversations"
                    >
                      <ArrowLeft size={20} />
                    </button>

                    {getOtherParticipant(selectedConv)?.profileImage ? (
                      <img
                        src={getOtherParticipant(selectedConv).profileImage}
                        alt="Participant"
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shrink-0">
                        {getOtherParticipant(selectedConv)?.firstname?.[0]?.toUpperCase() || <UserIcon size={18} />}
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-gray-800 text-sm leading-snug">
                        {getOtherParticipant(selectedConv)?.firstname} {getOtherParticipant(selectedConv)?.lastname}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-green-600 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Verified Match
                        </span>
                        {selectedConv.matchId?.matchScore && (
                          <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.2 rounded-md font-semibold">
                            {selectedConv.matchId.matchScore}% Match Score
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <ShieldCheck size={14} className="text-indigo-500" />
                    <span>Secure End-to-End Coordination</span>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-3">
                  {isLoadingMsgs ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-2" />
                      Loading chat messages…
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-6">
                      <Sparkles size={32} className="text-indigo-300 mb-2" />
                      <p className="font-medium text-gray-600 text-sm">Say Hello!</p>
                      <p className="text-xs text-gray-400 mt-1 max-w-xs">
                        Coordinate a safe meeting location on campus (e.g. Student Union, Library Desk) to retrieve your item.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const sender = msg.senderId?._id || msg.senderId;
                      const isMe = sender === myId;
                      const senderName = msg.senderId?.firstname || (isMe ? "You" : "Other");

                      return (
                        <div
                          key={msg._id || i}
                          className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                        >
                          {!isMe && (
                            <span className="text-[11px] font-medium text-gray-400 mb-1 ml-1">
                              {senderName}
                            </span>
                          )}
                          <div
                            className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-xs text-sm ${
                              isMe
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-xs"
                                : "bg-white border border-gray-200 text-gray-800 rounded-bl-xs"
                            }`}
                          >
                            <p className="leading-relaxed whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                            <p
                              className={`text-[10px] mt-1 text-right ${
                                isMe ? "text-indigo-200" : "text-gray-400"
                              }`}
                            >
                              {msg.createdAt
                                ? new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Just now"}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {isTyping && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white px-3 py-1.5 rounded-full shadow-xs w-fit border border-gray-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                      <span className="ml-1">typing…</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input form */}
                <div className="p-3 md:p-4 bg-white border-t border-gray-100">
                  <form onSubmit={sendMessage} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inputMsg}
                      onChange={(e) => setInputMsg(e.target.value)}
                      placeholder="Type your message to coordinate item return..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                    />
                    <button
                      type="submit"
                      disabled={!inputMsg.trim()}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-2xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md shadow-indigo-200 shrink-0"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-4 text-indigo-400 shadow-inner">
                  <MessageSquare size={36} />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-1">Your Messages</h3>
                <p className="max-w-sm text-sm text-gray-400">
                  Select a conversation on the left to coordinate recovery, discuss item details, or ask questions safely.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
