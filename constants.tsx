
import { SectionType, InitiativeSection } from './types';

export const INITIAL_SECTIONS: InitiativeSection[] = [
  {
    id: SectionType.INTRODUCTION,
    title: 'Phần 1: Mở đầu (Lý do chọn đề tài)',
    content: '',
    placeholder: 'Trình bày lý do tại sao bạn chọn nghiên cứu chủ đề này...',
    aiPrompt: 'Viết phần mở đầu cho sáng kiến kinh nghiệm về chủ đề này. Tập trung vào tính cấp thiết, vai trò của vấn đề và mục đích của sáng kiến.'
  },
  {
    id: SectionType.PROBLEM,
    title: 'Phần 2: Thực trạng vấn đề',
    content: '',
    placeholder: 'Mô tả tình hình thực tế, những khó khăn, thuận lợi tại đơn vị...',
    aiPrompt: 'Phân tích thực trạng vấn đề, nêu ra các ưu điểm và hạn chế hiện tại trước khi áp dụng giải pháp mới.'
  },
  {
    id: SectionType.SOLUTIONS,
    title: 'Phần 3: Các biện pháp giải quyết',
    content: '',
    placeholder: 'Mô tả chi tiết các giải pháp, phương pháp mới bạn đã áp dụng...',
    aiPrompt: 'Đề xuất các biện pháp cụ thể, sáng tạo để giải quyết thực trạng đã nêu. Chia thành các bước rõ ràng.'
  },
  {
    id: SectionType.RESULTS,
    title: 'Phần 4: Hiệu quả của sáng kiến',
    content: '',
    placeholder: 'Số liệu, kết quả so sánh trước và sau khi thực hiện...',
    aiPrompt: 'Viết về kết quả đạt được sau khi áp dụng sáng kiến. Nêu bật sự thay đổi của học sinh và chất lượng giảng dạy.'
  },
  {
    id: SectionType.CONCLUSION,
    title: 'Phần 5: Kết luận và kiến nghị',
    content: '',
    placeholder: 'Tóm tắt nội dung và đưa ra các đề xuất, bài học kinh nghiệm...',
    aiPrompt: 'Viết phần kết luận tóm tắt giá trị của sáng kiến và đưa ra các kiến nghị thực tế cho đồng nghiệp hoặc lãnh đạo.'
  }
];
