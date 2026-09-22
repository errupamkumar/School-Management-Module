'use client';

import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  Sparkles,
  Plus,
  Send,
  Mic,
  MicOff,
  PieChart,
  MessageSquare,
  Wallet,
  ArrowRight,
  User,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import toast from 'react-hot-toast';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

interface RecentChat {
  id: string;
  title: string;
  date: string;
  preview: string;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [voiceWake, setVoiceWake] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string>('new');

  // Daily token tracking: 1,000 tokens per day limit
  const [tokensRemaining, setTokensRemaining] = useState<number>(1000);
  const [tokensUsedToday, setTokensUsedToday] = useState<number>(0);
  const [dailyLimit, setDailyLimit] = useState<number>(1000);

  const [recentChats, setRecentChats] = useState<RecentChat[]>([
    {
      id: 'chat-1',
      title: 'Fee Collection Summary',
      date: 'Today',
      preview: 'Analyzed Class 10th pending dues & revenue...',
    },
    {
      id: 'chat-2',
      title: 'Pending Fee Reminder in Chat Form',
      date: 'Today',
      preview: 'Generated WhatsApp chat message draft...',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial token quota on load
  useEffect(() => {
    fetch('/api/ai-assistant')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTokensRemaining(data.remainingToday);
          setTokensUsedToday(data.usedToday);
          if (data.dailyLimit) setDailyLimit(data.dailyLimit);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Speech Recognition support
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        toast('Listening... Speak now', { icon: '🎙️' });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition error. Please try typing.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      toast.error('Voice recognition unavailable');
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
    setActiveChatId(`chat-${Date.now()}`);
    toast.success('Started a fresh conversation with Adam');
  };

  const sendMessage = async (promptText?: string) => {
    const query = (promptText || inputValue).trim();
    if (!query) return;

    if (tokensRemaining <= 0) {
      toast.error('Daily limit of 1,000 tokens reached for today. Resets at midnight.');
      return;
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-4).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (typeof data.tokensRemaining === 'number') {
          setTokensRemaining(data.tokensRemaining);
        }
        if (typeof data.totalTokensToday === 'number') {
          setTokensUsedToday(data.totalTokensToday);
        }

        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Save to recent chat history
        setRecentChats((prev) => [
          {
            id: `chat-${Date.now()}`,
            title: query.length > 28 ? query.slice(0, 28) + '...' : query,
            date: 'Just now',
            preview: data.answer.slice(0, 50).replace(/[#*`]/g, '') + '...',
          },
          ...prev.slice(0, 4),
        ]);
      } else {
        if (data.error === 'DAILY_LIMIT_EXCEEDED') {
          setTokensRemaining(0);
          toast.error('Daily limit of 1,000 tokens reached. Resets at midnight.');
        } else {
          toast.error(data.message || 'Unable to connect to Adam.');
        }

        const errMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.message || 'Unable to process your query. Please try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errMsg]);
      }
    } catch (e) {
      toast.error('Network error communicating with AI Assistant.');
    } finally {
      setIsThinking(false);
    }
  };

  // Helper to format assistant markdown text cleanly
  const renderFormattedText = (rawText: string) => {
    // Split into paragraphs / lines
    const lines = rawText.split('\n');

    return (
      <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          // Headers
          if (trimmed.startsWith('### ')) {
            return (
              <h5 key={idx} className="font-bold text-sm sm:text-base text-purple-700 dark:text-purple-300 pt-1">
                {trimmed.replace('### ', '')}
              </h5>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h4 key={idx} className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-gray-100 pt-1">
                {trimmed.replace('## ', '')}
              </h4>
            );
          }

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-purple-500 font-bold mt-1 text-xs">•</span>
                <span className="flex-1">{formatInlineStyles(content)}</span>
              </div>
            );
          }

          // Horizontal rule
          if (trimmed === '***' || trimmed === '---') {
            return <hr key={idx} className="my-2 border-gray-200 dark:border-slate-700" />;
          }

          // Default paragraph
          return (
            <p key={idx} className="text-gray-800 dark:text-gray-200">
              {formatInlineStyles(line)}
            </p>
          );
        })}
      </div>
    );
  };

  // Inline formatting for **bold** and *italic*
  const formatInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-gray-700 dark:text-gray-300">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-7xl mx-auto pb-8">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
            <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
              <Sparkles size={16} />
              <span>AI Assistant</span>
            </span>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-500 dark:text-gray-400 font-normal">Chat</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online</span>
            </span>

            <button
              type="button"
              onClick={handleNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus size={14} />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Main AI Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
          {/* Left: Recent Chats (Hidden on mobile, drawer view) */}
          <div className="hidden lg:block lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-4 shadow-sm min-h-[520px]">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Recent Chats</h3>
            {recentChats.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">No conversations yet.</p>
            ) : (
              <div className="space-y-2">
                {recentChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id);
                      toast(`Opened conversation: ${chat.title}`);
                    }}
                    className={cn(
                      'w-full text-left p-3 rounded-2xl border transition-all text-xs',
                      activeChatId === chat.id
                        ? 'border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30'
                        : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-800/60'
                    )}
                  >
                    <div className="flex items-center justify-between text-gray-700 dark:text-gray-300 font-semibold mb-1">
                      <span className="truncate">{chat.title}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{chat.date}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 line-clamp-1">{chat.preview}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center/Right: AI Chat Arena */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col h-[650px] sm:h-[700px] overflow-hidden">
            {/* Top Persona Bar */}
            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20 flex-shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                    <span>Adam</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 font-semibold">
                      SRM ECO TECH
                    </span>
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Your AI school assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
                {/* Daily Token Badge (1,000 token limit requirement) */}
                <span
                  title={`Daily limit: ${dailyLimit.toLocaleString()} tokens/day. Resets daily.`}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors flex items-center gap-1 shadow-sm',
                    tokensRemaining > 200
                      ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  )}
                >
                  <span>⚡ Daily Plan •</span>
                  <span className="font-bold">{tokensRemaining.toLocaleString()}</span>
                  <span className="text-gray-400">/ {dailyLimit.toLocaleString()} tokens left</span>
                </span>

                {/* Voice Wake Switch */}
                <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <span>Voice Wake</span>
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceWake(!voiceWake);
                      toast(voiceWake ? 'Voice Wake disabled' : 'Voice Wake enabled: say "Adam"');
                    }}
                    className={cn(
                      'w-10 h-5 rounded-full transition-colors relative focus:outline-none',
                      voiceWake ? 'bg-purple-600' : 'bg-gray-300 dark:bg-slate-700'
                    )}
                  >
                    <span
                      className={cn(
                        'w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm',
                        voiceWake ? 'left-5' : 'left-0.5'
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Conversation Timeline */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 touch-scroll">
              {messages.length === 0 ? (
                /* Initial Prompt Suggestions View (Matches Reference Screenshot) */
                <div className="max-w-2xl mx-auto py-4 sm:py-6 space-y-5">
                  <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Your school&apos;s AI assistant — ask anything, or try one of these:
                  </p>

                  <div className="space-y-3">
                    {/* Prompt 1 */}
                    <button
                      type="button"
                      onClick={() => sendMessage('Give school report with charts for students, attendance and fee overview')}
                      className="w-full text-left p-4 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-all flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center flex-shrink-0">
                          <PieChart size={20} />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 transition-colors">
                            School report with charts
                          </h4>
                          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                            Students, fees, attendance &amp; more — beautifully visualized
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </button>

                    {/* Prompt 2 */}
                    <button
                      type="button"
                      onClick={() => sendMessage('Draft an announcement message for all students about upcoming exams in chat form')}
                      className="w-full text-left p-4 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                          <MessageSquare size={20} />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 transition-colors">
                            Message all students (in chat form)
                          </h4>
                          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                            Announcements, reminders &amp; alerts — sent in seconds
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </button>

                    {/* Prompt 3 */}
                    <button
                      type="button"
                      onClick={() => sendMessage('Give pending fees summary and reminder message in chat form')}
                      className="w-full text-left p-4 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-all flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 flex items-center justify-center flex-shrink-0">
                          <Wallet size={20} />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-amber-600 transition-colors">
                            Pending fees (in chat form)
                          </h4>
                          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                            See who hasn&apos;t paid — and send them a reminder
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </button>
                  </div>

                  {/* Operational Scope Notice */}
                  <div className="pt-2 text-center space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-100 dark:border-purple-900">
                      <Mic size={13} />
                      <span>Tip: enable Voice Wake above and just say &quot;Adam&quot;</span>
                    </span>
                    <p className="text-[11px] text-gray-400">
                      🔒 Strictly bounded to Vidyalaya school data &amp; greetings • 1,000 tokens/day quota
                    </p>
                  </div>
                </div>
              ) : (
                /* Chat Messages History */
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex gap-3 max-w-2xl',
                      msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm',
                        msg.sender === 'user'
                          ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
                          : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                      )}
                    >
                      {msg.sender === 'user' ? <User size={15} /> : <Sparkles size={15} />}
                    </div>

                    <div
                      className={cn(
                        'rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm relative group',
                        msg.sender === 'user'
                          ? 'bg-purple-600 text-white rounded-tr-none'
                          : 'bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-slate-700 rounded-tl-none space-y-2.5'
                      )}
                    >
                      {/* Assistant Top bar with copy action */}
                      {msg.sender === 'assistant' && (
                        <div className="flex items-center justify-between pb-1 border-b border-gray-200/60 dark:border-slate-700/60 text-[11px] text-gray-400">
                          <span className="font-semibold text-purple-600 dark:text-purple-400">Adam (Vidyalaya AI)</span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      )}

                      {/* Message Content */}
                      {msg.sender === 'user' ? (
                        <p className="whitespace-pre-line">{msg.text}</p>
                      ) : (
                        renderFormattedText(msg.text)
                      )}

                      <span className={cn('text-[9px] block text-right mt-1', msg.sender === 'user' ? 'text-purple-200' : 'text-gray-400')}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))
              )}

              {/* Thinking Indicator */}
              {isThinking && (
                <div className="flex gap-3 max-w-sm mr-auto">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center flex-shrink-0 text-xs font-bold animate-pulse">
                    <Sparkles size={15} />
                  </div>
                  <div className="rounded-2xl p-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-tl-none flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span>Adam is consulting school records...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar at Bottom */}
            <div className="p-3 sm:p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
              {/* Daily Limit Warning Banner */}
              {tokensRemaining <= 0 && (
                <div className="mb-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
                  <span>
                    You have reached your 1,000 tokens daily allowance. The quota resets tomorrow at midnight.
                  </span>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputValue}
                    disabled={tokensRemaining <= 0}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      tokensRemaining <= 0
                        ? 'Daily quota exhausted (1,000 tokens/day)'
                        : 'Ask Adam anything about school operations, fees, attendance...'
                    }
                    className="w-full pl-4 pr-10 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all placeholder:text-gray-400 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={toggleListening}
                    disabled={tokensRemaining <= 0}
                    aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                    className={cn(
                      'absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors disabled:opacity-30',
                      isListening
                        ? 'text-rose-600 bg-rose-50 dark:bg-rose-950 animate-pulse'
                        : 'text-gray-400 hover:text-purple-600'
                    )}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isThinking || tokensRemaining <= 0}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md shadow-purple-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 transform active:scale-95"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
