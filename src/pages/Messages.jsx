import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Send, ShoppingBag, X, MessageCircle } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

export function Messages() {
  const { user }        = useAuth();
  const [searchParams]  = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [messages,      setMessages]      = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [text,          setText]          = useState('');
  const [loading,       setLoading]       = useState(true);
  const [sending,       setSending]       = useState(false);
  const [showPreorder,  setShowPreorder]  = useState(false);
  const [preItem,       setPreItem]       = useState('');
  const [preTime,       setPreTime]       = useState('');
  const [preLoc,        setPreLoc]        = useState('');
  const [preShopId,     setPreShopId]     = useState(searchParams.get('shopId') || '');
  const bottomRef       = useRef(null);
  const pollRef         = useRef(null);
  const socketRef       = useRef(null);
  const trackedRef      = useRef(new Set());
  const activePartnerRef = useRef(null);

  useEffect(() => {
    activePartnerRef.current = activePartner;
  }, [activePartner]);

  useEffect(() => {
    if (!user) return;
    loadConversations();
    const toId   = searchParams.get('to');
    const shopId = searchParams.get('shopId');
    if (toId) openConversation({ id: toId, fullName: 'Seller' }, shopId || '');

    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'], reconnection: true });
    socketRef.current = socket;
    socket.emit('join', user.id);
    socket.on('receive_message', (data) => {
      const partner = activePartnerRef.current;
      if (partner && data.senderId === partner.id) {
        setMessages((m) => [...m, data]);
      }
      loadConversations();
    });
    return () => { socket.disconnect(); socketRef.current = null; };
  }, [user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (activePartner) {
      clearInterval(pollRef.current);
      pollRef.current = setInterval(() => loadMessages(activePartner.id), 8000);
    }
    return () => clearInterval(pollRef.current);
  }, [activePartner]);

  const loadConversations = async () => {
    try {
      const { data } = await api.get('/messages/conversations');
      setConversations(data);
    } finally { setLoading(false); }
  };

  const openConversation = async (partner, shopId = '') => {
    setActivePartner(partner);
    setPreShopId(shopId);
    await loadMessages(partner.id);
  };

  const loadMessages = async (partnerId) => {
    try {
      const { data } = await api.get(`/messages/${partnerId}`);
      setMessages(data);
    } catch {}
  };

  const trackMessage = (shopId) => {
    if (!shopId || trackedRef.current.has(shopId)) return;
    trackedRef.current.add(shopId);
    api.post('/analytics/track', { shopId, type: 'message' }).catch(() => {});
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activePartner || sending) return;
    setSending(true);
    try {
      const { data } = await api.post('/messages', {
        receiverId: activePartner.id, text: text.trim(), shopId: preShopId || null,
      });
      if (preShopId) trackMessage(preShopId);
      socketRef.current?.emit('send_message', {
        ...data,
        receiverId: activePartner.id,
      });
      setMessages(m => [...m, data]);
      setText('');
      loadConversations();
    } finally { setSending(false); }
  };

  const sendPreorder = async () => {
    if (!preItem.trim()) return;
    const msg = `📋 PRE-ORDER REQUEST\nItems: ${preItem}\nPickup: ${preTime || 'TBD'}\nLocation: ${preLoc || 'TBD'}`;
    try {
      if (preShopId) await api.post('/preorders', { shopId: preShopId, items: [{name: preItem, qty: 1}], pickupTime: preTime, locationNote: preLoc });
      const { data } = await api.post('/messages', { receiverId: activePartner.id, text: msg, shopId: preShopId || null });
      setMessages(m => [...m, data]);
      setShowPreorder(false);
      setPreItem(''); setPreTime(''); setPreLoc('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  if (!user) return (
    <div className="page-container text-center py-20">
      <div className="text-5xl mb-4">💬</div>
      <h2 className="font-bold text-xl [color:var(--text)] mb-2">Login to view messages</h2>
      <Link to="/login" className="btn-primary mt-4">Login</Link>
    </div>
  );

  return (
    <div className="page-container !py-0 !px-0 max-w-none">
      <div className="flex h-[calc(100vh-128px)] overflow-hidden">

        {/* Sidebar */}
        <div className={`${activePartner ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-72 border-r border-white/10 bg-white/5`}>
          <div className="p-4 border-b border-white/10">
            <h2 className="font-bold text-lg [color:var(--text)]">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse"/>)}</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-cav-text-muted">
                <MessageCircle size={32} className="mx-auto mb-2 opacity-30"/>
                <div className="text-sm">No messages yet</div>
                <div className="text-xs mt-1">Visit a shop and tap Message Seller</div>
              </div>
            ) : conversations.map((c, i) => (
              <button key={i} onClick={() => openConversation(c.partner, c.shopId || '')}
                className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50
                  ${activePartner?.id === c.partner?.id ? 'bg-cav-green-accent/10 border-l-2 border-l-cav-green' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-cav-green flex items-center justify-center [color:var(--text)] font-bold flex-shrink-0">
                  {c.partner?.fullName?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-cav-green-dark truncate">{c.partner?.fullName}</div>
                  <div className="text-xs text-cav-text-muted truncate mt-0.5">{c.lastMessage}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        <div className={`${activePartner ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
          {!activePartner ? (
            <div className="flex-1 flex flex-col items-center justify-center text-cav-text-muted">
              <MessageCircle size={48} className="mb-4 opacity-20"/>
              <div className="font-semibold">Select a conversation</div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="glass border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActivePartner(null)} className="md:hidden btn-ghost p-1">←</button>
                  <div className="w-8 h-8 rounded-full bg-cav-green flex items-center justify-center [color:var(--text)] text-sm font-bold">
                    {activePartner.fullName?.[0] || '?'}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{activePartner.fullName}</div>
                    {activePartner.department && <div className="text-xs text-cav-text-muted">{activePartner.department}</div>}
                  </div>
                </div>
                <button onClick={() => setShowPreorder(true)} className="btn-ghost text-xs py-1.5">
                  <ShoppingBag size={13}/>Pre-Order
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, i) => {
                  const isMe = m.senderId === user.id;
                  return (
                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                        ${isMe ? 'bg-cav-primary [color:var(--text)] rounded-br-sm' : 'bg-white/10 [color:var(--text)] rounded-bl-sm border border-white/15'}`}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef}/>
              </div>

              {/* Pre-order modal */}
              {showPreorder && (
                <div className="bg-white border-t border-cav-green-accent/30 p-4 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-display font-bold text-sm text-cav-green-dark">📋 Pre-Order Request</div>
                    <button onClick={() => setShowPreorder(false)}><X size={16} className="text-gray-400"/></button>
                  </div>
                  <input value={preItem} onChange={e => setPreItem(e.target.value)}
                    placeholder="Items (e.g. Milk Tea x2, Taro x1)" className="input text-sm"/>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="datetime-local" value={preTime} onChange={e => setPreTime(e.target.value)} className="input text-sm"/>
                    <input value={preLoc} onChange={e => setPreLoc(e.target.value)} placeholder="Pickup location" className="input text-sm"/>
                  </div>
                  <button onClick={sendPreorder} className="btn-primary w-full justify-center text-sm">Send Pre-Order</button>
                </div>
              )}

              {/* Input */}
              <form onSubmit={sendMessage} className="bg-white border-t border-gray-100 p-3 flex gap-2">
                <input value={text} onChange={e => setText(e.target.value)}
                  placeholder="Type a message..." className="input flex-1"/>
                <button type="submit" disabled={sending || !text.trim()} className="btn-primary px-4 disabled:opacity-50">
                  <Send size={16}/>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
