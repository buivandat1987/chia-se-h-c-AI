
export interface InitiativeData {
  title: string;
  fullName: string;
  workplace: string;
  collaborators: string;
  startDate: string;
  endDate: string;
  problemStatement: string; // I.1 Tên sáng kiến (refine)
  necessity: string;       // I.2 Sự cần thiết, mục đích
  content: string;         // II. Nội dung
  novelty: string;         // III.1 Tính mới
  efficiency: string;      // III.2 Hiệu quả và khả thi
  scope: string;           // III.3 Phạm vi áp dụng
  conclusion: string;      // IV. Kết luận
  place: string;           // Địa phương ký
}

export type SectionKey = keyof InitiativeData;
