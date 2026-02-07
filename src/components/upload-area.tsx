import { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface UploadAreaProps {
  onFileUpload: (file: File) => void;
  isDarkMode: boolean;
}

export function UploadArea({ onFileUpload, isDarkMode }: UploadAreaProps) {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
    } else {
      alert('Please upload a PDF file');
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
        isDarkMode
          ? 'border-gray-700 bg-gray-800 hover:border-indigo-500 hover:bg-gray-700/50'
          : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/50'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'
        }`}>
          <Upload className={`w-8 h-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
        </div>
        <div>
          <p className={`text-lg font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Drop your PDF here or click to browse
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Upload your study material to get started
          </p>
        </div>
        <label className={`px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
          isDarkMode 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}>
          Choose File
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Supports PDF files up to 10MB</p>
      </div>
    </div>
  );
}