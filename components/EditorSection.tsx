
import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateSectionContent } from '../services/geminiService';

interface EditorSectionProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  context: string;
  placeholder?: string;
  rows?: number;
}

const EditorSection: React.FC<EditorSectionProps> = ({ 
  label, 
  value, 
  onChange, 
  context, 
  placeholder, 
  rows = 4 
}) => {
  const [loading, setLoading] = useState(false);

  const handleAI = async () => {
    if (!context) {
      alert("Vui lòng nhập tên sáng kiến trước để AI có ngữ cảnh hỗ trợ.");
      return;
    }
    setLoading(true);
    try {
      const result = await generateSectionContent(label, context, value);
      onChange(result);
    } catch (error) {
      alert("Có lỗi xảy ra khi gọi AI. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
          {label}
        </label>
        <button
          onClick={handleAI}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium hover:bg-indigo-100 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          Gợi ý bằng AI
        </button>
      </div>
      <textarea
        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-700 leading-relaxed"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default EditorSection;
