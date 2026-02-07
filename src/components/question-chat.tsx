import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Mic, MicOff } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuestionChatProps {
  messages: Message[];
  onSendQuestion: (question: string) => void;
  disabled?: boolean;
  isDarkMode: boolean;
}

export function QuestionChat({ messages, onSendQuestion, disabled, isDarkMode }: QuestionChatProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Speech recognition error:', error);
        alert('Unable to start voice input. Please check microphone permissions.');
        setIsListening(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendQuestion(input.trim());
      setInput('');
    }
  };

  return (
    <div className={`rounded-xl shadow-sm p-6 h-[600px] flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`flex items-center gap-2 mb-4 pb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <MessageCircle className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
        <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Ask Questions</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'
            }`}>
              <MessageCircle className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
            <div>
              <p className={`font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ask anything about your document</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get instant answers to clarify your doubts</p>
            </div>
            <div className="mt-2 space-y-2">
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Try asking:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => !disabled && onSendQuestion("What are the main topics covered?")}
                  disabled={disabled}
                  className={`px-3 py-1 text-xs rounded-full transition-colors disabled:opacity-50 ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  What are the main topics?
                </button>
                <button
                  onClick={() => !disabled && onSendQuestion("Explain the key concepts")}
                  disabled={disabled}
                  className={`px-3 py-1 text-xs rounded-full transition-colors disabled:opacity-50 ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Explain key concepts
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' 
                      ? 'text-indigo-200' 
                      : isDarkMode 
                      ? 'text-gray-400' 
                      : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={disabled ? "Processing document..." : isListening ? "Listening..." : "Type your question..."}
          disabled={disabled}
          className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          } ${isListening ? 'ring-2 ring-red-500' : ''}`}
        />
        <button
          type="button"
          onClick={toggleVoiceInput}
          disabled={disabled}
          className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
            isListening
              ? 'bg-red-600 text-white hover:bg-red-700'
              : isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </form>
    </div>
  );
}