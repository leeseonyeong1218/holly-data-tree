import { OrnamentDesign, Theme, OrnamentColor } from './types';

// Google Apps Script URL (from Chaewon's file)
export const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyvbLW5WgbxUCbNVw4EpETNotU25LD8YjikIDVSUCJySiBFICBjKbxFgDz6M5hen83u4g/exec";

// Asset URLs
export const ASSETS = {
  bgMain: "img/main-bg.png",
  bgCommon: "img/common-bg.png",
  paper: "img/paper.png",
  envelopeOpen: "img/envelope-back.png",
  envelopeFront: "img/envelope-front.png",
  envelopeClosed: "img/envelope.png",
  treeStarBg: "https://i.imgur.com/B3CVlaG.jpeg",
  snowGround: "https://i.imgur.com/cNV3Klr.png",
  treeTexture1: "https://i.imgur.com/mdj2xgd.png",
  treeTexture2: "https://i.imgur.com/n3jhXgf.png",
  snowmanIcon: "https://i.imgur.com/5Xxmpjh.png",
  rankingBg: "https://i.imgur.com/zy9SnsF.png",
  modalBg: "https://i.imgur.com/3YOgwUI.png",
  defaultRankIcon: "https://i.imgur.com/uMsWosV.png",
};

// Ranking Category Images
export const RANK_IMAGES: Record<string, string> = {
  "브랜드 디자인": "https://i.imgur.com/vANoYXL.png",
  "편집/출판 디자인": "https://i.imgur.com/paP8tuF.png",
  "UI/UX 디자인": "https://i.imgur.com/XuB5tfQ.png",
  "그래픽/일러스트레이션": "https://i.imgur.com/nIMBg6v.png",
  "모션/영상 디자인": "https://i.imgur.com/0Rx7qHP.png",
  "3D/제품 비주얼라이제이션 디자인": "https://i.imgur.com/QJfhdY9.png",
  "레터링/활자 디자인": "https://i.imgur.com/8WwNUgs.png",
  "기타": "https://i.imgur.com/zJiBViP.png"
};

export const OFFICIAL_CATEGORIES = [
  "브랜드 디자인", 
  "편집/출판 디자인", 
  "UI/UX 디자인", 
  "그래픽/일러스트레이션", 
  "모션/영상 디자인", 
  "3D/제품 비주얼라이제이션 디자인", 
  "레터링/활자 디자인", 
  "기타"
];

// Ornament Data Config
export const ORNAMENT_DATA: Record<OrnamentColor, { label: string; accent: string; patterns: OrnamentDesign[] }> = {
  yellow: {
    label: "추억",
    accent: "#f5b400",
    patterns: [
      { id: "plain", cap: "https://i.imgur.com/bQ7Rfza.png", shape: "https://i.imgur.com/zKtjAX7.png" },
      { id: "dot", cap: "https://i.imgur.com/BCSPZE1.png", shape: "https://i.imgur.com/hD4oE1b.png" },
      { id: "star", cap: "https://i.imgur.com/TdV7sJm.png", shape: "https://i.imgur.com/bHbSqx3.png" },
      { id: "snow", cap: "https://i.imgur.com/pWkO6qb.png", shape: "https://i.imgur.com/SjnAzAJ.png" },
      { id: "stripe1", cap: "https://i.imgur.com/AdlhJN0.png", shape: "https://i.imgur.com/6uiU5YA.png" },
      { id: "stripe2", cap: "https://i.imgur.com/LwpNDIR.png", shape: "https://i.imgur.com/ujYQOfU.png" },
    ],
  },
  red: {
    label: "고민",
    accent: "#c63926",
    patterns: [
      { id: "plain", cap: "https://i.imgur.com/hkHu9Eb.png", shape: "https://i.imgur.com/VPnVPam.png" },
      { id: "dot", cap: "https://i.imgur.com/HnPoieL.png", shape: "https://i.imgur.com/Un0xHIP.png" },
      { id: "star", cap: "https://i.imgur.com/xfCzHIu.png", shape: "https://i.imgur.com/qQkixfI.png" },
      { id: "snow", cap: "https://i.imgur.com/3meCnRR.png", shape: "https://i.imgur.com/JWSjR9n.png" },
      { id: "stripe1", cap: "https://i.imgur.com/8OJgTRS.png", shape: "https://i.imgur.com/TZx9lSj.png" },
      { id: "stripe2", cap: "https://i.imgur.com/6G4J6xV.png", shape: "https://i.imgur.com/9AT23K3.png" },
    ],
  },
  green: {
    label: "다짐",
    accent: "#0f7d8c",
    patterns: [
      { id: "plain", cap: "https://i.imgur.com/q6d9qMg.png", shape: "https://i.imgur.com/57dM8PS.png" },
      { id: "dot", cap: "https://i.imgur.com/0m62Uic.png", shape: "https://i.imgur.com/BQOqZMO.png" },
      { id: "star", cap: "https://i.imgur.com/LBTty3f.png", shape: "https://i.imgur.com/b8aUxEk.png" },
      { id: "snow", cap: "https://i.imgur.com/VAqncS6.png", shape: "https://i.imgur.com/vgtcsuV.png" },
      { id: "stripe1", cap: "https://i.imgur.com/H0MDosO.png", shape: "https://i.imgur.com/di8bXGL.png" },
      { id: "stripe2", cap: "https://i.imgur.com/wJOtZWG.png", shape: "https://i.imgur.com/DIU5tmp.png" },
    ],
  },
};

// Logic to map Survey Theme to Ornament Color
export const mapThemeToColor = (theme: Theme): OrnamentColor => {
  if (theme === '올해의 추억') return 'yellow';
  if (theme === '현재의 고민') return 'red';
  if (theme === '미래를 위한 다짐') return 'green';
  return 'yellow'; // Default
};

// Tree Slots Configuration (Relative positions)
export const SLOT_POINTS = [
  { dotX: 0.88, dotY: 0.29, orbX: 0.75, orbY: 0.22 },
  { dotX: 0.88, dotY: 0.36, orbX: 0.6, orbY: 0.33 },
  { dotX: 0.88, dotY: 0.43, orbX: 0.56, orbY: 0.4 },
  { dotX: 0.88, dotY: 0.5, orbX: 0.46, orbY: 0.48 },
  { dotX: 0.88, dotY: 0.62, orbX: 0.28, orbY: 0.63 },
  { dotX: 0.88, dotY: 0.71, orbX: 0.16, orbY: 0.75 },
  { dotX: 0.88, dotY: 0.8, orbX: 0.12, orbY: 0.83 },
];

import { PlacedOrnament } from './types';
export const INITIAL_PLACED_ORNAMENTS: PlacedOrnament[] = []; // Started empty, will fetch from spreadsheet