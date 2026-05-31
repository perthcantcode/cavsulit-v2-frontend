import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Send, ShoppingBag, X, MessageCircle, ArrowLeft, ClipboardList } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { EmptyStateIcon } from '../components/EmptyStateIcon';
import { Avatar } from '../components/Avatar';
import {
  formatPickupDateTime,
  formatPreorderPreview,
  parsePreorderMessage,
} from '../utils/helpers';

const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function isPreorderMessage(text) {
  return typeof text === 'string' && text.startsWith('📋 PRE-ORDER REQUEST');
}

function PreorderBubble({ text, isMe }) {
  const data = parsePreorderMessage(text);
  if (!data) return null;

  return (
    <div className={`msg-bubble msg-bubble--preorder${isMe ? ' msg-bubble--preorder-mine' : ''}`}>
      <p className="msg-preorder-tag">
        <ClipboardList size={14} strokeWidth={2.5} aria-hidden />
        Pre-order
      </p>
      <p className="msg-preorder-line">
        <strong>Items:</strong> {data.items || '—'}
      </p>
      <p className="msg-preorder-line">
        <strong>Pickup:</strong> {data.pickup}
      </p>
      <p className="msg-preorder-line">
        <strong>Location:</strong> {data.location}
      </p>
    </div>
  );
}

function MessageBubble({ message, isMe }) {
  if (isPreorderMessage(message.text)) {
    return (
      <div className={`msg-row${isMe ? ' msg-row--mine' : ' msg-row--theirs'}`}>
        <PreorderBubble text={message.text} isMe={isMe} />
        <time className="msg-time">{formatTime(message.createdAt)}</time>
      </div>
    );
  }

  return (
    <div className={`msg-row${isMe ? ' msg-row--mine' : ' msg-row--theirs'}`}>
      <div className={`msg-bubble${isMe ? ' msg-bubble--mine' : ' msg-bubble--theirs'}`}>
        {message.text}
      </div>
      <time className="msg-time">{formatTime(message.createdAt)}</time>
    </div>
  );
}

export function Messages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showPreorder, setShowPreorder] = useState(false);
  const [preItem, setPreItem] = useState('');
  const [preTime, setPreTime] = useState('');
  const [preLoc, setPreLoc] = useState('');
  const [preShopId, setPreShopId] = useState(searchParams.get('shopId') || '');
  const bottomRef = useRef(null);
  const socketRef = useRef(null);
  const activePartnerRef = useRef(null);
  const userIdRef = useRef(null);

  useEffect(() => {
    activePartnerRef.current = activePartner;
  }, [activePartner]);

  useEffect(() => {
    userIdRef.current = user?.id;
  }, [user?.id]);

  const appendMessage = useCallback((msg) => {
    if (!msg?.id) return;
    setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      const { data } = await api.get('/messages/conversations');
      setConversations(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (partnerId) => {
    try {
      const { data } = await api.get(`/messages/${partnerId}`);
      setMessages(data);
    } catch {
      /* ignore */
    }
  }, []);

  const openConversation = useCallback(
    async (partner, shopId = '') => {
      setActivePartner(partner);
      setPreShopId(shopId);
      await loadMessages(partner.id);
    },
    [loadMessages],
  );

  useEffect(() => {
    if (!user) return;

    loadConversations();

    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'], reconnection: true });
    socketRef.current = socket;
    socket.emit('join', user.id);

    const onReceive = (data) => {
      if (!data?.id || data.senderId === userIdRef.current) return;
      const partner = activePartnerRef.current;
      if (partner && data.senderId === partner.id) {
        appendMessage(data);
      }
      loadConversations();
    };

    socket.on('receive_message', onReceive);

    return () => {
      socket.off('receive_message', onReceive);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.id, loadConversations, appendMessage]);

  useEffect(() => {
    if (!user) return;
    const toId = searchParams.get('to');
    const shopId = searchParams.get('shopId') || '';
    if (!toId) return;

    const openFromParams = async () => {
      const list = await loadConversations();
      const existing = list?.find((c) => String(c.partner?.id) === String(toId));
      if (existing) {
        await openConversation(existing.partner, existing.shopId || shopId);
      } else {
        await openConversation({ id: toId, fullName: 'Seller' }, shopId);
      }
    };

    openFromParams();
  }, [user?.id, searchParams, loadConversations, openConversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activePartner || sending) return;
    setSending(true);
    const body = text.trim();
    setText('');
    try {
      const { data } = await api.post('/messages', {
        receiverId: activePartner.id,
        text: body,
        shopId: preShopId || null,
      });
      appendMessage(data);
      if (data.receiverId !== user.id) {
        socketRef.current?.emit('send_message', data);
      }
      loadConversations();
    } finally {
      setSending(false);
    }
  };

  const sendPreorder = async () => {
    if (!preItem.trim() || !activePartner || sending) return;
    setSending(true);
    try {
      if (preShopId) {
        const { data } = await api.post('/preorders', {
          shopId: preShopId,
          items: [{ name: preItem.trim(), qty: 1 }],
          pickupTime: preTime,
          locationNote: preLoc,
        });
        if (data.message) appendMessage(data.message);
      } else {
        const msg = `📋 PRE-ORDER REQUEST\nItems: ${preItem.trim()}\nPickup: ${formatPickupDateTime(preTime)}\nLocation: ${preLoc?.trim() || 'TBD'}`;
        const { data } = await api.post('/messages', {
          receiverId: activePartner.id,
          text: msg,
          shopId: null,
        });
        appendMessage(data);
        if (data.receiverId !== user.id) {
          socketRef.current?.emit('send_message', data);
        }
      }
      setShowPreorder(false);
      setPreItem('');
      setPreTime('');
      setPreLoc('');
      loadConversations();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not send pre-order');
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className="page-container text-center py-20">
        <EmptyStateIcon icon={MessageCircle} />
        <h2 className="font-bold text-xl [color:var(--text)] mb-2">Login to view messages</h2>
        <Link to="/login" className="btn-primary mt-4">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <aside className={`messages-sidebar${activePartner ? ' messages-sidebar--hidden-mobile' : ''}`}>
        <div className="messages-sidebar-head">
          <h2>Messages</h2>
        </div>
        <div className="messages-sidebar-list">
          {loading ? (
            <div className="messages-sidebar-loading">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="messages-skeleton" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="messages-sidebar-empty">
              <MessageCircle size={32} strokeWidth={2} />
              <p>No messages yet</p>
              <span>Visit a shop and tap Message Seller</span>
            </div>
          ) : (
            conversations.map((c) => {
              const active = activePartner?.id === c.partner?.id;
              return (
                <button
                  key={c.partner?.id}
                  type="button"
                  onClick={() => openConversation(c.partner, c.shopId || '')}
                  className={`messages-convo${active ? ' is-active' : ''}`}
                >
                  <Avatar user={c.partner} size={40} className="messages-convo-avatar" />
                  <div className="messages-convo-body">
                    <div className="messages-convo-top">
                      <span className="messages-convo-name">{c.partner?.fullName}</span>
                      <time>{formatTime(c.lastAt)}</time>
                    </div>
                    <p className="messages-convo-preview">
                      {isPreorderMessage(c.lastMessage)
                        ? formatPreorderPreview(c.lastMessage)
                        : c.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      <section className={`messages-main${activePartner ? ' messages-main--active' : ''}`}>
        {!activePartner ? (
          <div className="messages-empty-main">
            <MessageCircle size={48} strokeWidth={2} />
            <p>Select a conversation</p>
          </div>
        ) : (
          <>
            <header className="messages-chat-head">
              <button
                type="button"
                className="messages-back md:hidden"
                onClick={() => setActivePartner(null)}
                aria-label="Back"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="messages-chat-head-user">
                <Avatar user={activePartner} size={40} className="messages-convo-avatar" />
                <div>
                  <strong>{activePartner.fullName}</strong>
                  {activePartner.department && (
                    <span>{activePartner.department}</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="btn-secondary messages-preorder-btn"
                onClick={() => setShowPreorder(true)}
              >
                <ShoppingBag size={16} strokeWidth={2.25} />
                Pre-Order
              </button>
            </header>

            <div className="messages-chat-area">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} isMe={m.senderId === user.id} />
              ))}
              <div ref={bottomRef} />
            </div>

            {showPreorder && (
              <div className="messages-preorder-panel">
                <div className="messages-preorder-panel-head">
                  <strong>
                    <ClipboardList size={16} />
                    Pre-Order Request
                  </strong>
                  <button type="button" onClick={() => setShowPreorder(false)} aria-label="Close">
                    <X size={16} />
                  </button>
                </div>
                <input
                  value={preItem}
                  onChange={(e) => setPreItem(e.target.value)}
                  placeholder="Items (e.g. Milk Tea x2)"
                  className="input"
                />
                <div className="messages-preorder-grid">
                  <div className="form-field m-0">
                    <label className="form-label text-xs">Pickup date &amp; time</label>
                    <input
                      type="datetime-local"
                      value={preTime}
                      onChange={(e) => setPreTime(e.target.value)}
                      className="input"
                    />
                  </div>
                  <input
                    value={preLoc}
                    onChange={(e) => setPreLoc(e.target.value)}
                    placeholder="Pickup location"
                    className="input"
                  />
                </div>
                <button
                  type="button"
                  disabled={sending || !preItem.trim()}
                  onClick={sendPreorder}
                  className="btn-primary w-full justify-center"
                >
                  Send Pre-Order
                </button>
              </div>
            )}

            <form onSubmit={sendMessage} className="messages-input-bar">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="input messages-input"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !text.trim()}
                className="messages-send-btn"
                aria-label="Send"
              >
                <Send size={18} strokeWidth={2.25} />
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
