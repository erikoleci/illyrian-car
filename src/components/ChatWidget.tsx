import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Përshëndetje! 👋 Jam asistenti i Illyrian Rental Car. Çfarë makine dëshiron të marrësh me qera?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: trimmed }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: newMessages.slice(0, -1),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: 'Pati një problem teknik. Provo sërish ose na shkruaj në WhatsApp.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button (bottom-left, so it doesn't collide with WhatsApp button on bottom-right) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-black shadow-2xl shadow-amber-950/50 flex items-center justify-center transition-transform hover:scale-105"
        aria-label="Hap chat-in me asistentin"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-40 w-[92vw] max-w-sm h-[65vh] max-h-[520px] bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-neutral-900 border-b border-neutral-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-bold text-white">Asistenti Illyrian</span>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-amber-500 text-black rounded-br-sm'
                      : 'bg-neutral-800 text-neutral-100 rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-800 text-neutral-400 px-3 py-2 rounded-xl rounded-bl-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-2.5 border-t border-neutral-800 flex items-center gap-2 bg-neutral-900">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Shkruaj mesazhin tënd..."
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="w-9 h-9 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
