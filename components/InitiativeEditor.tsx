
import React, { useState } from 'react';
import { InitiativeSection, SectionType } from '../types';
import { generateSectionContent, refineContent } from '../services/geminiService';
import { Sparkles, Save, Wand2, Loader2, CheckCircle } from 'lucide-react';

interface InitiativeEditorProps {
  initiative: {
    title: string;
    subject: string;
    grade: string;
  };
  section: InitiativeSection;
  onUpdate: (id: SectionType, content: string) => void;
}

const InitiativeEditor: React.FC<InitiativeEditorProps> = ({ initiative, section, onUpdate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleGenerate = async () => {
    if (!initiative.title) {
      alert("Vui lòng nhập tên đề tài trước!");
      return;
    }
    setIsGenerating(true);
    const result = await generateSectionContent(
      initiative.title,
      section.aiPrompt,
      section.content,
      { author: '', subject: initiative.subject, grade: initiative.grade }
    );
    if (result) {
      onUpdate(section.id, result);
    }
    setIsGenerating(false);
  };

  const handleRefine = async () => {
    if (!section.content) return;
    setIsRefining(true);
    const result = await refineContent(section.content);
    if (result) {
      onUpdate(section.id, result);
    }
    setIsRefining(false);
  };

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          {section.title}
        </h3>
        <div className="flex gap-2">
           <button
            onClick={handleRefine}
            disabled={isRefining || !section.content}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
          >
            {isRefining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            Trau chuốt văn bản
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            AI Viết bản thảo
          </button>
        </div>
      </div>
      
      <div className="relative flex-1 p-4">
        <textarea
          className="w-full h-full min-h-[400px] resize-none border-none focus:ring-0 text-slate-700 leading-relaxed text-lg"
          placeholder={section.placeholder}
          value={section.content}
          onChange={(e) => onUpdate(section.id, e.target.value)}
        />
        
        {showToast && (
          <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm">Đã lưu nháp tự động</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          Lưu mục này
        </button>
      </div>
    </div>
  );
};

export default InitiativeEditor;
