export type Step = 'main' | 'survey_common' | 'survey_grade' | 'animation' | 'customize' | 'tree' | 'ranking' | 'comments';

export type Affiliation = '1학년' | '2학년' | '3학년' | '전공심화' | '교수님';

export type Theme = '올해의 추억' | '현재의 고민' | '미래를 위한 다짐';

export type OrnamentColor = 'yellow' | 'red' | 'green';

export interface UserData {
  name: string;
  affiliation: Affiliation | '';
  interests: string[];
  theme: Theme | '';
  title: string;
  content: string;
}

export interface OrnamentDesign {
  id: string;
  cap: string;
  shape: string;
}

export interface PlacedOrnament {
  id: string;
  userId: string;
  userName: string;
  affiliation: Affiliation; // To filter trees
  design: OrnamentDesign;
  panelIndex: number; // 0-17
  slotIndex?: number; // 0-6 (index in SLOT_POINTS)
  x: number; // 0.0 - 1.0 (percent)
  y: number; // 0.0 - 1.0 (percent)
  message: string;
}

export interface RankingItem {
  Interest: string;
  Count: number;
}

export interface Comment {
  ID: string;
  PostID: string;
  CommenterName: string;
  Affiliation: string;
  CommentContent: string;
  Timestamp: string;
}

export interface PostListItem {
  ID: string;
  Name: string;
  Affiliation: string;
  Title: string;
  Content: string;
  Timestamp: string;
}