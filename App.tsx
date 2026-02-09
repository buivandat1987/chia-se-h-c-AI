
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Settings, 
  Download, 
  BookOpen, 
  User, 
  Building2, 
  Calendar,
  Layout,
  MessageSquare,
  Sparkles,
  Loader2,
  Trash2,
  CheckCircle2,
  BrainCircuit,
  FileDown,
  Info
} from 'lucide-react';
import { InitiativeData } from './types';
import EditorSection from './components/EditorSection';
import PreviewPaper from './components/PreviewPaper';
import { generateFullReport } from './services/geminiService';
import { exportToWord } from './services/wordExportService';

const initialData: InitiativeData = {
  title: '',
  fullName: '',
  workplace: '',
  collaborators: '',
  startDate: '',
  endDate: '',
  problemStatement: '',
  necessity: '',
  content: '',
  novelty: '',
  efficiency: '',
  scope: '',
  conclusion: '',
  place: 'Cà Mau'
};

const App: React.FC = () => {
  const [data, setData] = useState<InitiativeData>(() => {
    const saved = localStorage.getItem('initiative_data');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [activeTab, setActiveTab] = useState<'info' | 'intro' | 'content' | 'eval' | 'conclusion'>('info');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const steps = [
    "Khởi tạo mô hình Gemini 3 Pro (Chuyên sâu)...",
    "Phân tích sâu tiêu đề và lập dàn ý chi tiết...",
    "Viết Phần I: Đặt vấn đề và Sự cần thiết (Dài)...",
    "Triển khai Phần II: Hệ thống các biện pháp thực hiện (Cực chi tiết)...",
    "Phân tích Phần III: Đánh giá tính mới, hiệu quả & thực tiễn...",
    "Tổng kết Phần IV và hoàn thiện báo cáo chuẩn 12 trang..."
  ];

  useEffect(() => {
    localStorage.setItem('initiative_data', JSON.stringify(data));
  }, [data]);

  const updateField = (field: keyof InitiativeData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateAll = async () => {
    if (!data.title) {
      alert("Vui lòng nhập 'Tên sáng kiến' trước khi yêu cầu AI viết toàn bộ.");
      return;
    }

    setIsGenerating(true);
    setGenStep(0);
    
    const interval = setInterval(() => {
      setGenStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 5000); // Tăng thời gian chờ vì model Pro viết dài hơn

    try {
      const result = await generateFullReport(data.title);
      setData(prev => ({
        ...prev,
        ...result
      }));
      setGenStep(steps.length - 1);
      setTimeout(() => {
        setIsGenerating(false);
        setActiveTab('content');
        alert("AI đã phác thảo xong báo cáo chuyên sâu. Bạn nên nhấn nút 'Gợi ý bằng AI' ở từng phần để mở rộng nội dung dài hơn nữa!");
      }, 1000);
    } catch (error) {
      alert("Có lỗi khi tạo nội dung dài. Vui lòng thử lại.");
      setIsGenerating(false);
    } finally {
      clearInterval(interval);
    }
  };

  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      await exportToWord(data);
    } catch (error) {
      alert("Có lỗi khi xuất file Word. Vui lòng thử lại.");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const clearData = () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ dữ liệu để viết mới?")) {
      setData(initialData);
      localStorage.removeItem('initiative_data');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Navigation - Desktop */}
      <aside className="no-print hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-10 text-indigo-600">
          <div className="p-2 bg-indigo-50 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="font-bold text-lg leading-tight">Trợ Lý Sáng Kiến</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('info')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'info' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Thông tin cơ bản</span>
          </button>
          <button 
            onClick={() => setActiveTab('intro')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'intro' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">I. Đặt vấn đề</span>
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'content' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Layout className="w-5 h-5" />
            <span className="font-medium">II. Nội dung</span>
          </button>
          <button 
            onClick={() => setActiveTab('eval')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'eval' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">III. Đánh giá</span>
          </button>
          <button 
            onClick={() => setActiveTab('conclusion')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'conclusion' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">IV. Kết luận</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-slate-100 space-y-3">
          <button 
            onClick={handleExportWord} 
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5" />}
            Xuất File Word (.docx)
          </button>
          <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-100 py-3 rounded-xl font-medium hover:bg-indigo-100 transition-all">
            <Printer className="w-5 h-5" />
            In Báo Cáo
          </button>
          <button onClick={clearData} className="w-full flex items-center justify-center gap-2 text-slate-400 text-sm hover:text-red-500 transition-colors py-2">
            <Trash2 className="w-4 h-4" />
            Xóa dữ liệu cũ
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="no-print flex-1 overflow-y-auto p-4 lg:p-8 relative">
        {isGenerating && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center">
            <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-lg border border-indigo-100">
              <div className="relative mb-6">
                <BrainCircuit className="w-16 h-16 text-indigo-600 animate-pulse" />
                <Loader2 className="w-20 h-20 text-indigo-100 animate-spin absolute inset-0 -m-2" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Đang Viết Sáng Kiến Chuyên Sâu</h3>
              
              <div className="w-full space-y-4 mb-8 text-left">
                {steps.map((step, idx) => (
                  <div key={idx} className={`flex items-center gap-3 transition-opacity duration-500 ${idx > genStep ? 'opacity-30' : 'opacity-100'}`}>
                    {idx < genStep ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <div className={`w-5 h-5 rounded-full border-2 ${idx === genStep ? 'border-indigo-600 border-t-transparent animate-spin' : 'border-slate-200'}`} />}
                    <span className={`text-sm ${idx === genStep ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}>{step}</span>
                  </div>
                ))}
              </div>
              
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-1000 ease-out" 
                  style={{ width: `${((genStep + 1) / steps.length) * 100}%` }}
                />
              </div>
              <p className="mt-4 text-[12px] text-amber-600 font-medium">Lưu ý: Quá trình tạo nội dung 12 trang có thể mất 1-2 phút.</p>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-8 pb-10">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Soạn thảo nội dung</h2>
              <p className="text-slate-500">Hoàn thành các phần để tạo báo cáo chuyên sâu.</p>
            </div>
            <div className="lg:hidden flex gap-2">
               <button onClick={handleExportWord} className="p-3 bg-blue-600 text-white rounded-xl shadow-lg">
                  <FileDown className="w-5 h-5" />
               </button>
               <button onClick={handlePrint} className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg">
                  <Printer className="w-5 h-5" />
               </button>
            </div>
          </header>

          {/* Tips for long content */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-4 items-start">
            <Info className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-sm text-indigo-800">
              <p className="font-bold mb-1">Mẹo để có sáng kiến dài 12 trang:</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>Sử dụng nút <strong>"AI Viết toàn bộ"</strong> để lấy khung sườn chuyên sâu ban đầu.</li>
                <li>Tại mỗi phần (đặc biệt là mục II), hãy nhấn <strong>"Gợi ý bằng AI"</strong> để AI phân tích sâu thêm từng biện pháp.</li>
                <li>Bổ sung thêm các bảng biểu hoặc ví dụ thực tế từ đơn vị của bạn để tăng tính thuyết phục.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 relative">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">Tên sáng kiến / Giải pháp</label>
                    <button
                      onClick={handleGenerateAll}
                      disabled={isGenerating || !data.title}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient text-white rounded-full text-xs font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:grayscale group"
                    >
                      <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                      AI VIẾT BÁO CÁO CHUYÊN SÂU (PRO)
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={data.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-medium text-slate-800"
                    placeholder="VD: Một số biện pháp nâng cao chất lượng dạy học môn Toán..."
                  />
                </div>
                {/* ... other fields remain same ... */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Họ và tên</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={data.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Đơn vị công tác</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={data.workplace}
                      onChange={(e) => updateField('workplace', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Trường Tiểu học..."
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Thành viên phối hợp</label>
                  <textarea 
                    value={data.collaborators}
                    onChange={(e) => updateField('collaborators', e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Ghi cụ thể từng thành viên nếu có..."
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Từ ngày</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={data.startDate}
                      onChange={(e) => updateField('startDate', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Đến ngày</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={data.endDate}
                      onChange={(e) => updateField('endDate', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Nơi lập báo cáo</label>
                  <input 
                    type="text" 
                    value={data.place}
                    onChange={(e) => updateField('place', e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="VD: Cà Mau"
                  />
                </div>
              </div>
            )}

            {activeTab === 'intro' && (
              <>
                <EditorSection 
                  label="1. Tên sáng kiến hoặc giải pháp"
                  value={data.problemStatement}
                  onChange={(val) => updateField('problemStatement', val)}
                  context={data.title}
                  placeholder="Ghi lại tên sáng kiến cụ thể..."
                  rows={2}
                />
                <EditorSection 
                  label="2. Sự cần thiết, mục đích thực hiện"
                  value={data.necessity}
                  onChange={(val) => updateField('necessity', val)}
                  context={data.title}
                  placeholder="Tại sao bạn thực hiện sáng kiến này? Mục đích là gì?..."
                  rows={10}
                />
              </>
            )}

            {activeTab === 'content' && (
              <EditorSection 
                label="II. Nội dung sáng kiến hoặc giải pháp"
                value={data.content}
                onChange={(val) => updateField('content', val)}
                context={data.title}
                placeholder="Trình bày chi tiết các bước, quy trình, giải pháp đã thực hiện. Hãy yêu cầu AI phân tích sâu từng biện pháp để đạt độ dài cần thiết."
                rows={20}
              />
            )}

            {activeTab === 'eval' && (
              <>
                <EditorSection 
                  label="1. Tính mới"
                  value={data.novelty}
                  onChange={(val) => updateField('novelty', val)}
                  context={data.title}
                  placeholder="Phân tích sự sáng tạo và khác biệt..."
                  rows={8}
                />
                <EditorSection 
                  label="2. Tính hiệu quả và khả thi"
                  value={data.efficiency}
                  onChange={(val) => updateField('efficiency', val)}
                  context={data.title}
                  placeholder="Dữ liệu so sánh, kết quả thực tiễn..."
                  rows={8}
                />
                <EditorSection 
                  label="3. Phạm vi áp dụng"
                  value={data.scope}
                  onChange={(val) => updateField('scope', val)}
                  context={data.title}
                  placeholder="Khả năng nhân rộng mô hình..."
                  rows={4}
                />
              </>
            )}

            {activeTab === 'conclusion' && (
              <EditorSection 
                label="IV. Kết luận"
                value={data.conclusion}
                onChange={(val) => updateField('conclusion', val)}
                context={data.title}
                placeholder="Tóm tắt ý nghĩa và đề xuất kiến nghị..."
                rows={8}
              />
            )}
            
            <div className="flex justify-between mt-10">
              <button 
                onClick={() => {
                  const tabs: any[] = ['info', 'intro', 'content', 'eval', 'conclusion'];
                  const currentIdx = tabs.indexOf(activeTab);
                  if (currentIdx > 0) setActiveTab(tabs[currentIdx - 1]);
                }}
                disabled={activeTab === 'info'}
                className="px-6 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-30"
              >
                Quay lại
              </button>
              <button 
                onClick={() => {
                  const tabs: any[] = ['info', 'intro', 'content', 'eval', 'conclusion'];
                  const currentIdx = tabs.indexOf(activeTab);
                  if (currentIdx < tabs.length - 1) setActiveTab(tabs[currentIdx + 1]);
                  else handlePrint();
                }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
              >
                {activeTab === 'conclusion' ? 'In báo cáo' : 'Tiếp theo'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Preview Area */}
      <section className="no-print hidden xl:flex flex-col w-[600px] bg-slate-200 overflow-y-auto p-8 border-l border-slate-300">
        <div className="sticky top-0 mb-4 flex justify-between items-center">
          <h3 className="text-slate-600 font-bold uppercase text-xs tracking-widest">Xem trước (A4)</h3>
          <span className="px-2 py-1 bg-white/50 rounded text-[10px] text-slate-500 uppercase font-medium">Bản thảo Pro</span>
        </div>
        <div className="scale-[0.85] origin-top transition-transform duration-500">
          <PreviewPaper data={data} />
        </div>
      </section>

      <div className="hidden print:block w-full">
        <PreviewPaper data={data} />
      </div>

      {/* Mobile Nav */}
      <div className="no-print lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 grid grid-cols-5 h-16">
        <button onClick={() => setActiveTab('info')} className={`flex flex-col items-center justify-center ${activeTab === 'info' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Thông tin</span>
        </button>
        <button onClick={() => setActiveTab('intro')} className={`flex flex-col items-center justify-center ${activeTab === 'intro' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <FileText className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Đặt v.đề</span>
        </button>
        <button onClick={() => setActiveTab('content')} className={`flex flex-col items-center justify-center ${activeTab === 'content' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Layout className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Nội dung</span>
        </button>
        <button onClick={() => setActiveTab('eval')} className={`flex flex-col items-center justify-center ${activeTab === 'eval' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Settings className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Đánh giá</span>
        </button>
        <button onClick={() => setActiveTab('conclusion')} className={`flex flex-col items-center justify-center ${activeTab === 'conclusion' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">K.luận</span>
        </button>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
