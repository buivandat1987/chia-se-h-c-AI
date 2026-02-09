
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.gemini_API_KEY || "" });

export const generateSectionContent = async (
  sectionName: string,
  context: string,
  currentValue: string
): Promise<string> => {
  const ai = getAI();
  const prompt = `
    Bạn là một chuyên gia nghiên cứu sư phạm và lý luận giáo dục cấp cao.
    Nhiệm vụ: Mở rộng nội dung phần "${sectionName}" cho sáng kiến: "${context}".
    
    YÊU CẦU BẮT BUỘC VỀ ĐỘ DÀI VÀ CHI TIẾT:
    1. Viết CỰC KỲ DÀI và CHI TIẾT. Triển khai mỗi luận điểm thành nhiều đoạn văn phân tích.
    2. Nếu là "Nội dung" (Mục II): Hãy chia nhỏ thành ít nhất 5-7 biện pháp. Mỗi biện pháp phải có: 
       - Cơ sở lý luận và thực tiễn.
       - Cách thức thực hiện chi tiết (Bước 1, Bước 2, Bước 3...).
       - Ví dụ minh họa thực tế cụ thể tại lớp học/đơn vị.
       - Những lưu ý khi thực hiện.
    3. Nếu là "Đánh giá" (Mục III): Phân tích so sánh đối chứng khoa học, đưa ra các con số giả định về hiệu quả (%, điểm số), phân tích tính sáng tạo vượt trội so với các đồng nghiệp khác.
    4. Văn phong: Trang trọng, đúng chuẩn Nghị định 30, ngôn từ chuyên môn giàu sức thuyết phục.
    5. Không viết tóm tắt. Hãy viết như thể đây là một luận văn chuyên sâu.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 8000 }
      }
    });
    return response.text || "";
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};

export const generateFullReport = async (title: string): Promise<any> => {
  const ai = getAI();
  const prompt = `
    Bạn là một giáo sư đầu ngành chuyên thẩm định Sáng kiến kinh nghiệm (SKKN) cấp Tỉnh.
    Hãy soạn thảo toàn bộ báo cáo SKKN cho đề tài: "${title}".
    
    MỤC TIÊU: Nội dung phải cực kỳ đồ sộ, hướng tới độ dài 12-15 trang giấy A4 khi trình bày chuẩn (Font 14, dãn dòng 1.5).
    
    YÊU CẦU CHI TIẾT CHO CÁC MỤC TRỌNG TÂM:
    - PHẦN I.2 (Sự cần thiết): Phân tích bối cảnh giáo dục hiện nay, thực trạng tại đơn vị, những khó khăn tồn tại và tại sao đề tài này là "cứu cánh". Viết ít nhất 3-4 trang.
    - PHẦN II (NỘI DUNG - CHIẾM 60% ĐỘ DÀI): 
        + Triển khai ít nhất 7 biện pháp chiến lược. 
        + Mỗi biện pháp phải mô tả tỉ mỉ từ khâu chuẩn bị, quy trình thực hiện đến cách đánh giá. 
        + Phải có kịch bản hoặc ví dụ cụ thể cho từng biện pháp. 
        + Phân tích tâm lý đối tượng tác động (học sinh/giáo viên).
    - PHẦN III (ĐÁNH GIÁ - CỰC KỲ QUAN TRỌNG): 
        + Mục 1 (Tính mới): Chứng minh sự độc bản, chưa từng có trong các tài liệu hiện hành. Phân tích sự thay đổi về tư duy quản lý/giảng dạy.
        + Mục 2 (Hiệu quả): Chia thành hiệu quả kinh tế (nếu có), hiệu quả xã hội, hiệu quả giáo dục. Phải có bảng so sánh "Trước khi áp dụng" và "Sau khi áp dụng" (dạng mô tả văn bản).
        + Mục 3 (Phạm vi): Khẳng định khả năng ứng dụng rộng rãi trong toàn Ngành, toàn Tỉnh.
    - PHẦN IV (Kết luận): Đúc kết giá trị cốt lõi và đề xuất 3-5 kiến nghị cấp thiết lên cấp trên.

    YÊU CẦU KỸ THUẬT: Trả về JSON. Hãy viết thật đầy đủ, không bỏ sót bước nào.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 15000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problemStatement: { type: Type.STRING, description: "Phần I.1: Tên giải pháp" },
            necessity: { type: Type.STRING, description: "Phần I.2: Sự cần thiết (Yêu cầu viết cực dài, khoảng 1000-1500 từ)" },
            content: { type: Type.STRING, description: "Phần II: Nội dung sáng kiến (Yêu cầu viết cực dài, ít nhất 7 biện pháp, khoảng 3000-4000 từ)" },
            novelty: { type: Type.STRING, description: "Phần III.1: Tính mới (Phân tích cực sâu)" },
            efficiency: { type: Type.STRING, description: "Phần III.2: Hiệu quả và khả thi (Phân tích cực sâu, có dữ liệu đối sánh)" },
            scope: { type: Type.STRING, description: "Phần III.3: Phạm vi áp dụng" },
            conclusion: { type: Type.STRING, description: "Phần IV: Kết luận và kiến nghị" },
          },
          required: ["problemStatement", "necessity", "content", "novelty", "efficiency", "scope", "conclusion"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Full Generation Error:", error);
    throw error;
  }
};
