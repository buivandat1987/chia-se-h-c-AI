
import React from 'react';
import { InitiativeData } from '../types';

interface PreviewPaperProps {
  data: InitiativeData;
}

const PreviewPaper: React.FC<PreviewPaperProps> = ({ data }) => {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  return (
    <div className="paper bg-white w-full mx-auto shadow-2xl p-[2cm] paper-font text-black text-justify leading-relaxed min-h-[29.7cm]">
      {/* Header */}
      <div className="flex flex-col items-end mb-8">
        <div className="text-center w-[60%]">
          <p className="font-bold text-[14px]">Phụ lục 01/BCSK</p>
          <p className="italic text-[13px]">(Ban hành kèm theo Quyết định số 09/2021/QĐ-UBND ngày 20 tháng 4 năm 2021 của Ủy ban nhân dân tỉnh Cà Mau)</p>
          <div className="mt-4 italic text-[13px]">
             {data.place || '..........'}, ngày {day} tháng {month} năm {year}
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-[16px] font-bold uppercase">BÁO CÁO</h1>
        <h2 className="text-[15px] font-bold mt-2">Sáng kiến hoặc giải pháp: {data.title || '........................................'}</h2>
      </div>

      {/* Basic Info */}
      <div className="mb-8 space-y-2 text-[14px]">
        <p><span className="font-bold">- Tên sáng kiến:</span> {data.title || '........................................'}</p>
        <p><span className="font-bold">- Họ và tên:</span> {data.fullName || '........................................'}</p>
        <p><span className="font-bold">- Đơn vị công tác:</span> {data.workplace || '........................................'}</p>
        <p><span className="font-bold">- Cá nhân, tổ chức phối hợp (ghi cụ thể từng thành viên):</span> {data.collaborators || '........................................'}</p>
        <p><span className="font-bold">- Thời gian đã được triển khai thực hiện:</span> Từ ngày: {data.startDate || '/ /'} đến ngày: {data.endDate || '/ /'}</p>
      </div>

      {/* Sections */}
      <div className="space-y-6 text-[14px]">
        <div>
          <h3 className="font-bold uppercase">I. ĐẶT VẤN ĐỀ</h3>
          <div className="pl-4 mt-2">
            <p className="font-bold">1. Tên sáng kiến hoặc giải pháp</p>
            <p className="whitespace-pre-wrap mt-1">{data.problemStatement || '........................................'}</p>
            <p className="font-bold mt-3">2. Sự cần thiết, mục đích của việc thực hiện sáng kiến (lý do nghiên cứu)</p>
            <p className="whitespace-pre-wrap mt-1">{data.necessity || '........................................'}</p>
          </div>
        </div>

        <div>
          <h3 className="font-bold uppercase">II. NỘI DUNG SÁNG KIẾN HOẶC GIẢI PHÁP</h3>
          <p className="whitespace-pre-wrap mt-2">{data.content || '........................................'}</p>
        </div>

        <div>
          <h3 className="font-bold uppercase">III. ĐÁNH GIÁ VỀ TÍNH MỚI, TÍNH HIỆU QUẢ VÀ KHẢ THI, PHẠM VI ÁP DỤNG</h3>
          <div className="pl-4 mt-2">
            <p className="font-bold">1. Tính mới</p>
            <p className="whitespace-pre-wrap mt-1">{data.novelty || '........................................'}</p>
            <p className="font-bold mt-3">2. Tính hiệu quả và khả thi</p>
            <p className="whitespace-pre-wrap mt-1">{data.efficiency || '........................................'}</p>
            <p className="font-bold mt-3">3. Phạm vi áp dụng</p>
            <p className="whitespace-pre-wrap mt-1">{data.scope || '........................................'}</p>
          </div>
        </div>

        <div>
          <h3 className="font-bold uppercase">IV. KẾT LUẬN</h3>
          <p className="whitespace-pre-wrap mt-2">{data.conclusion || '........................................'}</p>
        </div>
      </div>

      {/* Footer Signatures */}
      <div className="grid grid-cols-2 mt-16 text-[14px]">
        <div className="text-center">
          <p className="font-bold uppercase">XÁC NHẬN CỦA</p>
          <p className="font-bold uppercase leading-tight">THỦ TRƯỞNG ĐƠN VỊ TRỰC TIẾP</p>
          <p className="italic text-[12px] mt-1 px-4">(Riêng đối với các trường hợp đề nghị công nhận sáng kiến cấp tỉnh, phải có ý kiến xác nhận của Thủ trưởng đơn vị trình)</p>
        </div>
        <div className="text-center">
          <p className="font-bold uppercase">Người báo cáo</p>
          <div className="h-24"></div>
          <p className="font-bold">{data.fullName || '............................'}</p>
        </div>
      </div>
    </div>
  );
};

export default PreviewPaper;
