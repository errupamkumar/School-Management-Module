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
  Bot,
  User,
  CheckCircle2,
  TrendingUp,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { cn, formatCurrency } from '@/utils/helpers';
import toast from 'react-hot-toast';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  richContent?: {
    type: 'report' | 'message_broadcast' | 'fee_dues' | 'general';
    data?: any;
  };
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
  const [recentChats, setRecentChats] = useState<RecentChat[]>([
    {
      id: 'chat-1',
      title: 'Fee Collection Summary',
      date: 'Today',
      preview: 'Analyzed Class 10th pending dues & revenue...',
    },
    {
      id: 'chat-2',
      title: 'Half-Yearly Exam Datesheet',
      date: 'Yesterday',
      preview: 'Generated schedule for Classes 6-10...',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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

  const sendMessage = (promptText?: string) => {
    const query = (promptText || inputValue).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    // AI Response generation logic
    setTimeout(() => {
      let assistantMsg: ChatMessage;
      const lower = query.toLowerCase();

      if (lower.includes('report') || lower.includes('chart') || lower.includes('statistic')) {
        assistantMsg = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: 'Here is the executive school summary report with key institutional metrics:',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          richContent: {
            type: 'report',
            data: {
              totalStudents: 1100,
              boys: 620,
              girls: 480,
              totalStaff: 68,
              attendanceRate: 93.1,
              monthlyIncome: 325000,
              pendingDues: 485000,
              feeRate: 82,
            },
          },
        };
      } else if (lower.includes('message') || lower.includes('sms') || lower.includes('announce') || lower.includes('broadcast')) {
        assistantMsg = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: 'I have drafted an announcement notice ready to broadcast to all students and parents:',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          richContent: {
            type: 'message_broadcast',
            data: {
              subject: 'Upcoming Half-Yearly Examinations 2026',
              body: 'Dear Students and Parents, this is to notify you that the Half-Yearly examinations commence from October 15, 2026. Detailed datesheets and admit cards have been published on the student portal. Please ensure all outstanding term dues are cleared before examination commencement. Best wishes from Vidyalaya Management.',
            },
          },
        };
      } else if (lower.includes('fee') || lower.includes('dues') || lower.includes('pending') || lower.includes('paid')) {
        assistantMsg = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: 'Here is the real-time fee defaulters summary for current academic term:',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          richContent: {
            type: 'fee_dues',
            data: {
              totalDefaulters: 14,
              totalDues: 485000,
              classes: [
                { name: 'Class 10-A', count: 6, amount: 148000 },
                { name: 'Class 9-B', count: 5, amount: 125000 },
                { name: 'Class 8-A', count: 3, amount: 62000 },
              ],
            },
          },
        };
      } else {
        assistantMsg = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `I've processed your query: "${query}".\n\nAs your school management AI, I can help you query student admission rosters, track pending fee dues, generate attendance reports, draft WhatsApp/SMS alerts for parents, and plan examination timetables. Feel free to click any suggestion or ask a specific question.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          richContent: {
            type: 'general',
          },
        };
      }

      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);

      // Save to recent chat history
      setRecentChats((prev) => [
        {
          id: `chat-${Date.now()}`,
          title: query.length > 25 ? query.slice(0, 25) + '...' : query,
          date: 'Just now',
          preview: assistantMsg.text.slice(0, 45) + '...',
        },
        ...prev.slice(0, 4),
      ]);
    }, 900);
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
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online</span>
            </div>

            <button
              onClick={handleNewChat}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all transform active:scale-95"
            >
              <Plus size={14} />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Left Recent Chats + Right Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Recent Chats */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-4 flex flex-col h-[75vh] min-h-[480px]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 px-1">
              Recent Chats
            </h3>

            <div className="flex-1 overflow-y-auto space-y-2 touch-scroll pr-1">
              {recentChats.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">No conversations yet.</p>
              ) : (
                recentChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id);
                      toast(`Loaded: ${chat.title}`);
                    }}
                    className={cn(
                      'w-full text-left p-2.5 rounded-xl border text-xs transition-all',
                      activeChatId === chat.id
                        ? 'border-purple-300 dark:border-purple-700 bg-purple-50/60 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200'
                        : 'border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'
                    )}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold truncate">{chat.title}</span>
                      <span className="text-[10px] text-gray-400">{chat.date}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{chat.preview}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Assistant Window */}
          <div className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col h-[75vh] min-h-[480px] overflow-hidden">
            {/* Assistant Header Card */}
            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-gray-50/40 dark:bg-slate-900/40 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/20">
                  <Sparkles size={22} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">Adam</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Your AI school assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  ⚡ Free plan &bull; 100k tokens left
                </span>

                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
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
                      onClick={() => sendMessage('School report with charts')}
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
                      onClick={() => sendMessage('Message all students')}
                      className="w-full text-left p-4 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                          <MessageSquare size={20} />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 transition-colors">
                            Message all students
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
                      onClick={() => sendMessage('Pending fees summary and reminders')}
                      className="w-full text-left p-4 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-all flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 flex items-center justify-center flex-shrink-0">
                          <Wallet size={20} />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-amber-600 transition-colors">
                            Pending fees
                          </h4>
                          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                            See who hasn&apos;t paid — and send them a reminder
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </button>
                  </div>

                  {/* Tip */}
                  <div className="pt-2 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-100 dark:border-purple-900">
                      <Mic size={13} />
                      <span>Tip: enable Voice Wake above and just say &quot;Adam&quot;</span>
                    </span>
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
                        'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold',
                        msg.sender === 'user'
                          ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
                          : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                      )}
                    >
                      {msg.sender === 'user' ? <User size={15} /> : <Sparkles size={15} />}
                    </div>

                    <div
                      className={cn(
                        'rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm',
                        msg.sender === 'user'
                          ? 'bg-purple-600 text-white rounded-tr-none'
                          : 'bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-slate-700 rounded-tl-none space-y-3'
                      )}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* Rich Content: School Report Card */}
                      {msg.richContent?.type === 'report' && msg.richContent.data && (
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-purple-100 dark:border-slate-700 space-y-3 mt-2">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200">
                              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">Students</p>
                              <p className="text-base font-extrabold">{msg.richContent.data.totalStudents}</p>
                              <p className="text-[10px] text-gray-500">{msg.richContent.data.boys}B / {msg.richContent.data.girls}G</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200">
                              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Attendance</p>
                              <p className="text-base font-extrabold">{msg.richContent.data.attendanceRate}%</p>
                              <p className="text-[10px] text-emerald-600">Optimal rate</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200">
                              <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">Income</p>
                              <p className="text-base font-extrabold">{formatCurrency(msg.richContent.data.monthlyIncome)}</p>
                              <p className="text-[10px] text-purple-600">82% target</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200">
                              <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase">Pending</p>
                              <p className="text-base font-extrabold">{formatCurrency(msg.richContent.data.pendingDues)}</p>
                              <p className="text-[10px] text-rose-600">Action needed</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Rich Content: Broadcast Message Preview */}
                      {msg.richContent?.type === 'message_broadcast' && msg.richContent.data && (
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-emerald-100 dark:border-slate-700 space-y-2 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                              Broadcast Notice Draft
                            </span>
                            <button
                              onClick={() => handleCopyText(msg.id, msg.richContent?.data?.body)}
                              className="text-[11px] text-purple-600 font-semibold flex items-center gap-1 hover:underline"
                            >
                              {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                              <span>{copiedId === msg.id ? 'Copied' : 'Copy Text'}</span>
                            </button>
                          </div>
                          <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-slate-800 text-xs italic text-gray-700 dark:text-gray-300">
                            &quot;{msg.richContent.data.body}&quot;
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => toast.success('SMS broadcast sent to 1,100 parent contacts!')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                            >
                              ✓ Send to All Parents via SMS
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Rich Content: Fee Dues Breakdown */}
                      {msg.richContent?.type === 'fee_dues' && msg.richContent.data && (
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-amber-100 dark:border-slate-700 space-y-2 mt-2">
                          <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                            High Priority Fee Dues ({msg.richContent.data.totalDefaulters} defaulters):
                          </p>
                          <div className="space-y-1.5 text-xs">
                            {msg.richContent.data.classes.map((c: any) => (
                              <div key={c.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-slate-800">
                                <span className="font-semibold">{c.name}</span>
                                <span className="text-gray-500">{c.count} students</span>
                                <span className="font-bold text-rose-600">{formatCurrency(c.amount)}</span>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => toast.success('Fee reminder notifications dispatched to 14 guardians!')}
                            className="w-full mt-2 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition-colors"
                          >
                            Dispatch WhatsApp Fee Reminders
                          </button>
                        </div>
                      )}

                      <span className="text-[9px] opacity-60 block text-right mt-1">{msg.time}</span>
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
                  <div className="rounded-2xl p-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-tl-none flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span>Adam is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar at Bottom */}
            <div className="p-3 sm:p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
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
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask Adam anything..."
                    className="w-full pl-4 pr-10 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={toggleListening}
                    aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                    className={cn(
                      'absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors',
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
                  disabled={!inputValue.trim()}
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
