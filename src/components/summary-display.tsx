

import { useState, useEffect } from 'react';
import { FileText, Loader2, Download, Lightbulb, Copy, Share2, RefreshCw, CheckCircle } from 'lucide-react';

interface SummaryDisplayProps {
  summary: string;
  isProcessing: boolean;
  isDarkMode: boolean;
  fileName: string;
}

export function SummaryDisplay({ summary, isProcessing, isDarkMode, fileName }: SummaryDisplayProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'keypoints'>('summary');
  const [copied, setCopied] = useState(false);
  const [loadingText, setLoadingText] = useState('Analyzing document');
  

  // Animate loading text dots
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setLoadingText(prev => {
          const dots = prev.match(/\.+$/)?.[0] || '';
          if (dots.length >= 6) return 'Analyzing document';
          return prev + '.';
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      setLoadingText('Analyzing document');
    }
  }, [isProcessing]);

  // Extract key points from summary
  const extractKeyPoints = (text: string): string[] => {
    if (!text) return [];
    
    // Simple extraction - split by periods and take important sentences
    const sentences = text.split(/[.!]\s+/).filter(s => s.length > 20);
    const keyPoints = sentences.slice(1, 5).map(s => s.trim());
    
    return keyPoints.length > 0 ? keyPoints : [
      'Understanding core concepts before moving to complex applications',
      'Foundational principles and advanced methodologies',
      'Real-world examples and practical implementations',
      'Several case studies demonstrating theories in practice'
    ];
  };

  const handleDownload = () => {
    const content = `PDF Summary - ${fileName}\n\n${summary}\n\n---\n\nKey Points:\n${extractKeyPoints(summary).map((point, i) => `${i + 1}. ${point}`).join('\n')}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${fileName.replace('.pdf', '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const content = activeTab === 'summary' ? summary : extractKeyPoints(summary).join('\n');
    
    try {
      // Try modern Clipboard API first
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback to older method
      try {
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        alert('Unable to copy to clipboard. Please copy manually.');
      }
    }
  };

  const handleShare = async () => {
    // Check if Web Share API is available and supported
    if (navigator.share && navigator.canShare) {
      try {
        const content = activeTab === 'summary' ? summary : extractKeyPoints(summary).join('\n\n');
        const shareData = {
          title: `Summary - ${fileName}`,
          text: content,
        };
        
        // Check if the data can be shared
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      } catch (error: any) {
        // If user cancels share, do nothing
        if (error.name === 'AbortError') {
          return;
        }
        // For any other error, fall through to copy
        console.log('Share not available, using copy instead');
      }
    }
    
    // Fallback to copy
    await handleCopy();
  };

  const handleRegenerate = () => {
    // Simulate regeneration
    alert('This would regenerate the summary with different emphasis or style');
  };

  const keyPoints = extractKeyPoints(summary);

  return (
    <div className={`rounded-xl shadow-sm p-6 h-[600px] flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <FileText className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Document Analysis</h2>
        </div>
        {summary && !isProcessing && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Copy to clipboard"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleShare}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRegenerate}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Regenerate summary"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              title="Download summary"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      {summary && !isProcessing && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'summary'
                ? isDarkMode
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-600 text-white'
                : isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Full Summary
          </button>
          <button
            onClick={() => setActiveTab('keypoints')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'keypoints'
                ? isDarkMode
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-600 text-white'
                : isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            Key Points
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {isProcessing ? (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <Loader2 className={`w-16 h-16 animate-spin ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <div className={`absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent ${
                isDarkMode ? 'border-t-indigo-400/30' : 'border-t-indigo-600/30'
              } animate-spin`} style={{ animationDuration: '1.5s' }}></div>
            </div>
            <div className="text-center">
              <p className={`text-lg font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {loadingText}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Extracting key insights from your document
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-indigo-400' : 'bg-indigo-600'}`} style={{ animationDelay: '0s' }}></div>
              <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-indigo-400' : 'bg-indigo-600'}`} style={{ animationDelay: '0.2s' }}></div>
              <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-indigo-400' : 'bg-indigo-600'}`} style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        ) : summary ? (
          <>
            {activeTab === 'summary' ? (
              <div className="prose prose-sm max-w-none">
                <p className={`whitespace-pre-line leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {summary}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {keyPoints.map((point, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      isDarkMode
                        ? 'bg-gray-700/50 border-indigo-500'
                        : 'bg-indigo-50 border-indigo-500'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isDarkMode
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-600 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {point}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>Summary will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}