import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Menu, Loader2, Sparkles, Github, Twitter, Linkedin } from 'lucide-react';
import { Message, Difficulty, Role, TOPICS } from './types';
import { sendMessageToBackend } from './services/api';
import { ChatBubble } from './components/ChatBubble';
import { TopicSelector } from './components/TopicSelector';
import { DifficultyFilter } from './components/DifficultyFilter';
import { Button } from './components/ui/Button';

// Extend Window interface for Web Speech API support
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: 'স্বাগতম! আমি আপনার বাংলা এআই অ্যাসিস্ট্যান্ট। শিক্ষার বিষয়, স্বাস্থ্য, ভ্রমণ বা অন্য যেকোনো বিষয়ে আমাকে প্রশ্ন করতে পারেন।',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('সাধারণ');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Send Message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');
    
    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Call Backend API
      const response = await sendMessageToBackend({
        query: userText,
        topic: selectedTopic,
        difficulty: difficulty
      });

      // Add AI Response
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: response.answer || "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: "দুঃখিত, একটি ত্রুটি হয়েছে।",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Speech to Text (STT)
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('আপনার ব্রাউজারে স্পিচ রিকগনিশন সমর্থিত নয়। দয়া করে Chrome ব্যবহার করুন।');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'bn-BD';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => prev + ' ' + transcript);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // Text to Speech (TTS)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Attempt to find a Bengali voice, fallback to default
    const voices = window.speechSynthesis.getVoices();
    const bnVoice = voices.find(v => v.lang.includes('bn'));
    if (bnVoice) utterance.voice = bnVoice;
    
    utterance.lang = 'bn-BD';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Topic Selection */}
      <TopicSelector 
        selectedTopic={selectedTopic}
        onSelectTopic={setSelectedTopic}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Pigeonic" className="w-8 h-8" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent hidden sm:block">
                বাংলা চ্যাটবট
              </h1>
            </div>
          </div>
          
          <DifficultyFilter 
            selectedDifficulty={difficulty}
            onSelectDifficulty={setDifficulty}
          />
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth" id="chat-container">
          <div className="max-w-3xl mx-auto flex flex-col min-h-full justify-end">
            <div className="space-y-4 pb-4">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} onSpeak={msg.role === 'ai' ? speakText : undefined} />
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start animate-in fade-in duration-300">
                  <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-slate-500 text-sm">
                    <Loader2 size={16} className="animate-spin text-teal-500" />
                    <span>উত্তর তৈরি হচ্ছে...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </main>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="max-w-3xl mx-auto flex gap-2">
            <button
              onClick={toggleListening}
              className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-red-100 text-red-600 animate-pulse ring-2 ring-red-400' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
              title="Speak"
            >
              <Mic size={20} />
            </button>
            
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`${TOPICS.find(t => t.label === selectedTopic)?.label} সম্পর্কে জিজ্ঞাসা করুন...`}
                className="w-full h-12 pl-4 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                disabled={isLoading}
              />
            </div>

            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="h-12 w-12 rounded-xl !px-0 flex items-center justify-center bg-gradient-to-r from-teal-600 to-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all"
            >
              <Send size={20} className="ml-1" />
            </Button>
          </div>
          
          <div className="max-w-3xl mx-auto mt-2 flex justify-between items-center px-1">
             <p className="text-[10px] text-slate-400">
               AI ভুল তথ্য দিতে পারে। গুরুত্বপূর্ণ তথ্যের জন্য যাচাই করুন।
             </p>
             <div className="flex gap-2 opacity-50">
               <a href="https://github.com/ToukirAhamedPigeon" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-teal-600">
                 <Github size={12} className="cursor-pointer hover:text-teal-600"/>
               </a>
               <a href="https://www.linkedin.com/in/toukir-ahamed-09477b28a/" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-teal-600">
                 <Linkedin size={12} className="cursor-pointer hover:text-teal-600"/>
               </a>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
