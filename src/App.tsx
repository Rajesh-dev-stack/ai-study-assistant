
import { useState } from 'react';
import { UploadArea } from './components/upload-area';
import { SummaryDisplay } from './components/summary-display';
import { QuestionChat } from './components/question-chat';
import { ThemeToggle } from './components/theme-toggle';
import { askAI } from "./services/ai";
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function App() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    setMessages([]);

    try {
      const text = await file.text();
      const prompt = `This is a study document named ${file.name}. Generate a clear academic summary with key concepts and important points.\n\nDocument content:\n${text}`;

      const result = await askAI(
        "Summarize this document in simple bullet points:\n" + prompt
      );

      setSummary(result);
    } catch (error) {
      console.error('Error processing file:', error);
      setSummary('Error: Failed to process the file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };





  const handleSendQuestion = (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
  const responses = [
  "Great question. Based on the uploaded document, this concept focuses on the core principles and their practical applications.",

  "According to the notes, this topic explains the theory along with real-world examples to make understanding easier.",

  "This is highlighted as an important exam topic. The document discusses definitions, features, and advantages clearly.",

  "The material breaks this down step-by-step and provides simple explanations for better clarity.",

  "In simple terms, it describes how the system works internally and why it is useful in practical scenarios.",

  "The document emphasizes this as a key takeaway and suggests revising it carefully for exams."
];


      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)] + " " + question.toLowerCase().replace('?', '') + ". Would you like me to elaborate on any specific aspect?",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setSummary('');
    setMessages([]);
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Theme Toggle Button */}
      <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>PDF Study Assistant</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Upload your study materials and get instant summaries and answers to your questions</p>
        </div>

        {!uploadedFile ? (
          <div className="max-w-2xl mx-auto">
            <UploadArea onFileUpload={handleFileUpload} isDarkMode={isDarkMode} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* File Info Bar */}
            <div className={`rounded-lg shadow-sm p-4 flex items-center justify-between ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded flex items-center justify-center ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                  <svg className={`w-6 h-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{uploadedFile.name}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Upload New File
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Summary Section */}
              <SummaryDisplay 
                summary={summary} 
                isProcessing={isProcessing} 
                isDarkMode={isDarkMode}
                fileName={uploadedFile.name}
              />

              {/* Question Chat Section */}
              <QuestionChat 
                messages={messages} 
                onSendQuestion={handleSendQuestion}
                disabled={isProcessing}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}