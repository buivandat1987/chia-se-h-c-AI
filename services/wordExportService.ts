
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle
} from "docx";
import FileSaver from "file-saver";
import { InitiativeData } from "../types";

export const exportToWord = async (data: InitiativeData) => {
  const today = new Date();
  const dateStr = `${data.place || ".........."}, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  const saveAsFunc = (FileSaver as any).saveAs || (FileSaver as any).default || FileSaver;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: "2cm",
              bottom: "2cm",
              left: "3cm",
              right: "1.5cm",
            },
          },
        },
        children: [
          // Header
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, children: [] }),
                  new TableCell({
                    width: { size: 60, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "Phụ lục 01/BCSK", bold: true, size: 28, font: "Times New Roman" })],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ 
                            text: "(Ban hành kèm theo Quyết định số 09/2021/QĐ-UBND ngày 20 tháng 4 năm 2021 của Ủy ban nhân dân tỉnh Cà Mau)", 
                            italics: true, 
                            size: 24,
                            font: "Times New Roman"
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: dateStr, italics: true, size: 26, font: "Times New Roman" })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 400, after: 400 } }),

          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "BÁO CÁO", bold: true, size: 32, font: "Times New Roman" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            children: [
              new TextRun({ text: `Sáng kiến hoặc giải pháp: ${data.title || "...................."}`, bold: true, size: 28, font: "Times New Roman" }),
            ],
          }),

          // Info
          ...[
            ["- Tên sáng kiến:", data.title],
            ["- Họ và tên:", data.fullName],
            ["- Đơn vị công tác:", data.workplace],
            ["- Cá nhân, tổ chức phối hợp:", data.collaborators],
            ["- Thời gian triển khai:", `Từ ngày: ${data.startDate || "/ /"} đến ngày: ${data.endDate || "/ /"}`]
          ].map(([label, val]) => (
            new Paragraph({
              spacing: { line: 360, after: 120 }, // 1.5 lines spacing
              children: [
                new TextRun({ text: label + " ", bold: true, size: 28, font: "Times New Roman" }),
                new TextRun({ text: val || "....................", size: 28, font: "Times New Roman" }),
              ],
            })
          )),

          new Paragraph({ spacing: { before: 400 } }),

          // Sections with 1.5 line spacing for maximum page count
          ...[
            { title: "I. ĐẶT VẤN ĐỀ", isBold: true },
            { title: "1. Tên sáng kiến hoặc giải pháp", isBold: true, indent: 400 },
            { content: data.problemStatement, indent: 400 },
            { title: "2. Sự cần thiết, mục đích của việc thực hiện sáng kiến", isBold: true, indent: 400 },
            { content: data.necessity, indent: 400 },
            { title: "II. NỘI DUNG SÁNG KIẾN HOẶC GIẢI PHÁP", isBold: true, spacing: 400 },
            { content: data.content },
            { title: "III. ĐÁNH GIÁ VỀ TÍNH MỚI, TÍNH HIỆU QUẢ VÀ KHẢ THI, PHẠM VI ÁP DỤNG", isBold: true, spacing: 400 },
            { title: "1. Tính mới", isBold: true, indent: 400 },
            { content: data.novelty, indent: 400 },
            { title: "2. Tính hiệu quả và khả thi", isBold: true, indent: 400 },
            { content: data.efficiency, indent: 400 },
            { title: "3. Phạm vi áp dụng", isBold: true, indent: 400 },
            { content: data.scope, indent: 400 },
            { title: "IV. KẾT LUẬN", isBold: true, spacing: 400 },
            { content: data.conclusion },
          ].map((item: any) => {
            return new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { line: 360, before: item.spacing || 0, after: 200 },
              indent: { left: item.indent || 0 },
              children: [
                new TextRun({ 
                  text: item.title || item.content || "....................", 
                  bold: !!item.isBold, 
                  size: 28, // Font size 14
                  font: "Times New Roman" 
                })
              ],
            });
          }),

          new Paragraph({ spacing: { before: 1000 } }),

          // Signature
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "XÁC NHẬN CỦA", bold: true, size: 28, font: "Times New Roman" })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "THỦ TRƯỞNG ĐƠN VỊ TRỰC TIẾP", bold: true, size: 28, font: "Times New Roman" })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(Ký tên, đóng dấu)", italics: true, size: 24, font: "Times New Roman" })] }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "NGƯỜI BÁO CÁO", bold: true, size: 28, font: "Times New Roman" })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true, size: 24, font: "Times New Roman" })] }),
                      new Paragraph({ spacing: { before: 1200 } }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: data.fullName || "....................", bold: true, size: 28, font: "Times New Roman" })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `Sang_kien_kinh_nghiem_${data.fullName.replace(/\s+/g, "_") || "SKKN"}.docx`;
  
  if (typeof saveAsFunc === 'function') {
    saveAsFunc(blob, fileName);
  } else {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};
