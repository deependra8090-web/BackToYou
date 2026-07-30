import React, { useState, useEffect } from 'react';
import { useItems } from '../context/ItemContext';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { MessageSquare, Send, X, ShieldCheck, CheckCheck } from 'lucide-react';

export const ChatDrawer = () => {
  const { selectedItem, setActiveModal } = useItems();
  const { user } = useAuth();
  const { socket } = useSocket();

  const [messages, setMessages] = useState([
    {
      _id: "m1",
      senderId: "u_user2",
      senderName: "David Miller",
      message: `Hi ${user?.name || 'there'}! I am writing regarding your reported item: ${selectedItem?.title}.`,
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      _id: "m2",
      senderId: user?._id || "u_user1",
      senderName: user?.name || "Sarah Chen",
      message: "Hello David! Yes, I submitted proof of ownership details for verification.",
      timestamp: new Date(Date.now() - 1800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatId = `item_${selectedItem?._id || 'demo'}_${user?._id || 'user'}`;

  useEffect(() => {
    if (socket && chatId) {
      socket.emit('join_room', chatId);

      socket.on('receive_message', (newMsg) => {
        setMessages(prev => [...prev, newMsg]);
      });

      socket.on('user_typing', ({ isTyping: typingStatus }) => {
        setIsTyping(typingStatus);
      });
    }

    return () => {
      if (socket) {
        socket.off('receive_message');
        socket.off('user_typing');
      }
    };
  }, [socket, chatId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      _id: "msg_" + Date.now(),
      chatId,
      senderId: user?._id || "u_user1",
      senderName: user?.name || "Sarah Chen",
      receiverId: selectedItem?.reporter._id || "u_user2",
      message: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);

    if (socket) {
      socket.emit('send_message', newMsg);
    }

    setInputText('');

    // Simulate auto response from finder/owner for interactive testing
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          _id: "auto_" + Date.now(),
          senderId: selectedItem?.reporter._id || "u_user2",
          senderName: selectedItem?.reporter.name || "David Miller",
          message: "Got it! Thanks for the message. I will check with security staff right away.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  if (!selectedItem) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px', padding: '0', borderRadius: '24px', overflow: 'hidden', height: '600px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ padding: '16px 20px', background: '#1e293b', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <img src={selectedItem.reporter.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"} alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', border: '2px solid #1e293b' }}></span>
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                Chat with {selectedItem.reporter.name}
              </h4>
              <p style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 500 }}>
                Regarding: {selectedItem.title.substring(0, 24)}...
              </p>
            </div>
          </div>
          <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Message History Window */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(15, 23, 42, 0.6)' }}>
          {messages.map((m) => {
            const isMe = m.senderId === (user?._id || "u_user1");
            return (
              <div key={m._id} style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  background: isMe ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#1e293b',
                  color: '#fff',
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  <p>{m.message}</p>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', display: 'block', textAlign: isMe ? 'right' : 'left' }}>
                  {m.timestamp}
                </span>
              </div>
            );
          })}

          {isTyping && (
            <p style={{ fontSize: '0.75rem', color: '#38bdf8', fontStyle: 'italic' }}>
              {selectedItem.reporter.name} is typing...
            </p>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} style={{ padding: '16px', background: '#1e293b', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ borderRadius: '20px', paddingLeft: '18px' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '10px 16px', borderRadius: '20px' }}>
            <Send size={16} />
          </button>
        </form>

      </div>
    </div>
  );
};
