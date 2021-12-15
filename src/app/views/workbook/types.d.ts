export interface WorkbookQuizContent {
  index: number; // 不要かも？
  question: string;
  answers?: string[];
  correctAnswerIndex: number;
}
export interface WorkbookQuiz {
  [category: string]: WorkbookQuizContent[];
}
export interface WorkbookQuizzes {
  [docID: string]: WorkbookQuiz;
}


export interface WorkbookData {
  id: string; // `docID`と同じ
  title: string;
  shortTitle: string;
  desc: string;
  tags: string[]; // 開発途中（検索かソートに活用できるかも？）
  quiz: {
    [category: string]: {
      index: number; // オブジェクトの順番は保証されないため、`この変数の値が若い順に並べる
      displayName: string; // 例： "通常問題", "配線図問題"
      commonAnswers?: string[];
      dialog?: {
        trigger: string; // 例： <svg>(map icons)</svg>
        content: string; // 例： <img src="(url)" />
      }
    }
  };
  searchToken: {
    [token: string]: true;
  };
}
export interface WorkbookDataset {
  [docID: string]: WorkbookData; 
}
