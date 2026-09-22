'use client';

import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import { useSession } from 'next-auth/react';
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
  BookOpen,
  CalendarCheck,
  FileQuestion,
  Receipt,
  Bus,
  Clock,
  GraduationCap,
  ShieldCheck,
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
  const { data: session } = useSession();
  const sessionUser = session?.user as any;
  const initialRole: string = (sessionUser?.role || 'SUPER_ADMIN').toUpperCase();

  // Active Role Scope: synced with logged in user or interactive test tabs
  const [activeRole, setActiveRole] = useState<string>(initialRole);
  const [activeUserName, setActiveUserName] = useState<string>(sessionUser?.name || 'Administrator');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [voiceWake, setVoiceWake] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string>('new');

  // Daily token tracking: 1,000,000 tokens per day limit
  const [tokensRemaining, setTokensRemaining] = useState<number>(1000000);
  const [tokensUsedToday, setTokensUsedToday] = useState<number>(0);
  const [dailyLimit, setDailyLimit] = useState<number>(1000000);

  // Sync role when session is loaded
  useEffect(() => {
    if (session?.user) {
      const u = session.user as any;
      const detectedRole = (u.role || 'SUPER_ADMIN').toUpperCase();
      setActiveRole(detectedRole);
      setActiveUserName(u.name || (detectedRole === 'SUPER_ADMIN' ? 'Dr. Anand Swaroop Pathak' : detectedRole));
    }
  }, [session]);

  // Dynamic Recent Chats based on activeRole
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);

  useEffect(() => {
    if (activeRole === 'TEACHER') {
      setRecentChats([
        {
          id: 'chat-t1',
          title: 'Class 10 Math Revision Plan',
          date: 'Today',
          preview: 'Drafted homework and study checklist...',
        },
        {
          id: 'chat-t2',
          title: 'Science Lab Rubric',
          date: 'Yesterday',
          preview: 'Created practical examination rubric...',
        },
      ]);
    } else if (activeRole === 'PARENT') {
      setRecentChats([
        {
          id: 'chat-p1',
          title: 'Term 2 Fee Schedule',
          date: 'Today',
          preview: 'Checked payment due date & receipt...',
        },
        {
          id: 'chat-p2',
          title: 'Bus Route 4 Timing',
          date: 'Yesterday',
          preview: 'Verified morning pickup & drop schedule...',
        },
      ]);
    } else if (activeRole === 'STUDENT') {
      setRecentChats([
        {
          id: 'chat-s1',
          title: 'Today’s Class Timetable',
          date: 'Today',
          preview: 'Checked period timings and subjects...',
        },
        {
          id: 'chat-s2',
          title: 'Exam Datesheet Overview',
          date: 'Yesterday',
          preview: 'Reviewed Half-Yearly test schedule...',
        },
      ]);
    } else {
      setRecentChats([
        {
          id: 'chat-a1',
          title: 'Fee Collection Summary',
          date: 'Today',
          preview: 'Analyzed Class 10th pending dues & revenue...',
        },
        {
          id: 'chat-a2',
          title: 'Pending Fee Reminder in Chat Form',
          date: 'Today',
          preview: 'Generated WhatsApp chat message draft...',
        },
      ]);
    }
  }, [activeRole]);

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

  const handleRoleChange = (newRole: string) => {
    setActiveRole(newRole);
    setMessages([]);
    const defaultName =
      newRole === 'SUPER_ADMIN'
        ? 'Dr. Anand Swaroop Pathak'
        : newRole === 'TEACHER'
        ? 'Rajesh Khanna'
        : newRole === 'PARENT'
        ? 'Rajesh Mishra'
        : 'Aarav Sharma';
    setActiveUserName(defaultName);
    toast.success(`Active scope: ${newRole}`);
  };

  const sendMessage = async (promptText?: string) => {
    const query = (promptText || inputValue).trim();
    if (!query) return;

    if (tokensRemaining <= 0) {
      toast.error('Daily limit of 1,000,000 tokens reached for today. Resets at midnight.');
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
          role: activeRole,
          userName: activeUserName,
          userEmail: sessionUser?.email,
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
          toast.error('Daily limit reached. Resets at midnight.');
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

  // Role-Based Starter Prompt Cards
  const getStarterPrompts = () => {
    if (activeRole === 'TEACHER') {
      return [
        {
          id: 't1',
          icon: <BookOpen size={20} />,
          title: 'Class homework & lesson plan',
          desc: 'Draft structured homework assignments & revision schedule for my class',
          accent: 'purple',
          prompt: 'Draft a homework assignment and revision plan for Class 10 Mathematics in chat form',
        },
        {
          id: 't2',
          icon: <CalendarCheck size={20} />,
          title: 'Class attendance & absent follow-up',
          desc: "Review today's student attendance roster and absent follow-up notes",
          accent: 'emerald',
          prompt: "What is today's attendance summary for my class and draft a follow up message for absent students?",
        },
        {
          id: 't3',
          icon: <FileQuestion size={20} />,
          title: 'Exam blueprint & question rubric',
          desc: 'Generate half-yearly test questions blueprint & grading criteria',
          accent: 'amber',
          prompt: 'Generate an examination question paper blueprint and grading rubric for Class 10 Science',
        },
      ];
    }

    if (activeRole === 'PARENT') {
      return [
        {
          id: 'p1',
          icon: <Receipt size={20} />,
          title: "My child's fee status & dues",
          desc: 'Check pending term fees, payment receipts & upcoming due dates',
          accent: 'purple',
          prompt: "What is my child's current fee status, upcoming due date, and payment instructions?",
        },
        {
          id: 'p2',
          icon: <CalendarCheck size={20} />,
          title: "Child's attendance & leave application",
          desc: 'Check monthly attendance percentage and draft a student leave letter',
          accent: 'emerald',
          prompt: "Show my child's attendance record and help me draft a leave application for 2 days",
        },
        {
          id: 'p3',
          icon: <Bus size={20} />,
          title: 'School bus & exam timetable',
          desc: 'Check transport route timings, school holidays & examination datesheet',
          accent: 'amber',
          prompt: 'What are the school bus timings for Route 4 and when do the half-yearly exams start?',
        },
      ];
    }

    if (activeRole === 'STUDENT') {
      return [
        {
          id: 's1',
          icon: <Clock size={20} />,
          title: 'My daily timetable & exams',
          desc: 'Check today’s class periods, subject timings & upcoming tests',
          accent: 'purple',
          prompt: 'What is my timetable for today and upcoming exam datesheet?',
        },
        {
          id: 's2',
          icon: <GraduationCap size={20} />,
          title: 'Pending homework assignments',
          desc: 'Review homework tasks and revision resources for my class',
          accent: 'emerald',
          prompt: 'What are my pending homework assignments for this week?',
        },
        {
          id: 's3',
          icon: <CalendarCheck size={20} />,
          title: 'My attendance & holiday calendar',
          desc: 'Check your personal attendance percentage and upcoming holidays',
          accent: 'amber',
          prompt: 'Show my attendance percentage and upcoming school holidays',
        },
      ];
    }

    // Default for SUPER_ADMIN / ADMIN / ACCOUNTANT
    return [
      {
        id: 'a1',
        icon: <PieChart size={20} />,
        title: 'School report with charts',
        desc: 'Students, fees, attendance & financial metrics visualized',
        accent: 'purple',
        prompt: 'Give school report with charts for students, attendance and fee overview',
      },
      {
        id: 'a2',
        icon: <MessageSquare size={20} />,
        title: 'Message all students & staff',
        desc: 'Campus announcements, reminders & alerts — sent in seconds',
        accent: 'emerald',
        prompt: 'Draft an announcement message for all students about upcoming exams in chat form',
      },
      {
        id: 'a3',
        icon: <Wallet size={20} />,
        title: 'Pending fees & defaulters overview',
        desc: 'See who hasn’t paid (₹4.85L dues) — and draft collection reminders',
        accent: 'amber',
        prompt: 'Give pending fees summary and reminder message in chat form',
      },
    ];
  };

  const starterPrompts = getStarterPrompts();

  // Role Scope Display Name
  const getRoleScopeLabel = () => {
    switch (activeRole) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return 'Super Admin Scope • Full Institutional & Financial Access';
      case 'ACCOUNTANT':
        return 'Accountant Scope • Finance, Fees & Payroll';
      case 'TEACHER':
        return 'Teacher Scope • Academic, Homework & Attendance';
      case 'PARENT':
        return 'Parent Portal • Ward Records & Fees';
      case 'STUDENT':
        return 'Student Portal • Timetable & Study Schedule';
      default:
        return 'General User Scope';
    }
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

          {/* Interactive Role Switcher Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => handleRoleChange('SUPER_ADMIN')}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                  activeRole === 'SUPER_ADMIN' || activeRole === 'ADMIN'
                    ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                )}
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('TEACHER')}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                  activeRole === 'TEACHER'
                    ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                )}
              >
                👨‍🏫 Teacher
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('PARENT')}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                  activeRole === 'PARENT'
                    ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                )}
              >
                👨‍👩‍👦 Parent
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('STUDENT')}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                  activeRole === 'STUDENT'
                    ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                )}
              >
                🎓 Student
              </button>
            </div>

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
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Chats</h3>
              <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">{activeRole}</span>
            </div>

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
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col h-[650px] sm:h-[720px] overflow-hidden">
            {/* Top Persona Bar */}
            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20 flex-shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5 flex-wrap">
                    <span>Adam</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 font-semibold">
                      SRM ECO TECH
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-medium">
                      {activeUserName} ({activeRole})
                    </span>
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{getRoleScopeLabel()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
                {/* Daily Token Badge (1,000,000 token limit requirement) */}
                <span
                  title={`Daily limit: ${dailyLimit.toLocaleString()} tokens/day. Resets daily.`}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors flex items-center gap-1 shadow-sm',
                    tokensRemaining > 200000
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
                /* Role-Based Starter Prompt Suggestions View */
                <div className="max-w-2xl mx-auto py-4 sm:py-6 space-y-5">
                  <div className="text-center space-y-1">
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Welcome, {activeUserName}! ({activeRole})
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Your school AI assistant is ready for your role. Ask anything or pick a sample question below:
                    </p>
                  </div>

                  <div className="space-y-3">
                    {starterPrompts.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => sendMessage(item.prompt)}
                        className="w-full text-left p-4 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-all flex items-center justify-between group shadow-sm"
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={cn(
                              'w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0',
                              item.accent === 'emerald'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300'
                                : item.accent === 'amber'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300'
                                : 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300'
                            )}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                          </div>
                        </div>
                        <ArrowRight
                          size={16}
                          className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all flex-shrink-0"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Operational Scope Notice */}
                  <div className="pt-2 text-center space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-100 dark:border-purple-900">
                      <Mic size={13} />
                      <span>Tip: enable Voice Wake above and just say &quot;Adam&quot;</span>
                    </span>
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                      <ShieldCheck size={13} className="text-emerald-500" />
                      <span>Role-Based Access Control Active: {getRoleScopeLabel()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Chat Messages History with Robust MarkdownRenderer */
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
                        <div className="flex items-center justify-between pb-1.5 border-b border-gray-200/60 dark:border-slate-700/60 text-[11px] text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                              Adam (Vidyalaya AI)
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-medium">
                              {activeRole}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check size={12} className="text-emerald-500" />
                            ) : (
                              <Copy size={12} />
                            )}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      )}

                      {/* Message Content rendered via industrial MarkdownRenderer */}
                      {msg.sender === 'user' ? (
                        <p className="whitespace-pre-line">{msg.text}</p>
                      ) : (
                        <MarkdownRenderer content={msg.text} />
                      )}

                      <span
                        className={cn(
                          'text-[9px] block text-right mt-1',
                          msg.sender === 'user' ? 'text-purple-200' : 'text-gray-400'
                        )}
                      >
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
                    <span>Adam is consulting authorized records for {activeRole}...</span>
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
                    You have reached your 1,000,000 tokens daily allowance. The quota resets tomorrow at midnight.
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
                        ? 'Daily quota exhausted (1,000,000 tokens/day)'
                        : `Ask Adam (${activeRole} scope: ${
                            activeRole === 'PARENT'
                              ? "child's fees, attendance, bus..."
                              : activeRole === 'TEACHER'
                              ? 'class attendance, homework, exams...'
                              : activeRole === 'STUDENT'
                              ? 'timetable, homework, holidays...'
                              : 'school overview, fees, announcements...'
                          })`
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
