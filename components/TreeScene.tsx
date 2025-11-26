
import React, { useState, useEffect } from 'react';
import { UserData, OrnamentDesign, PlacedOrnament } from '../types';
import { ASSETS, SLOT_POINTS } from '../constants';
import { fetchOrnamentsFromSheet, saveOrnamentToSheet } from '../utils/api';
import SnowEffect from './SnowEffect';
import { X } from 'lucide-react';

interface Props {
  userData: UserData;
  userOrnamentDesign: OrnamentDesign;
  onBack: () => void;
  onGoRanking: () => void;
  onGoComments: () => void;
}

const TreeScene: React.FC<Props> = ({ userData, userOrnamentDesign, onBack, onGoRanking, onGoComments }) => {
  const [rotation, setRotation] = useState(20);
  const [placedOrnaments, setPlacedOrnaments] = useState<PlacedOrnament[]>([]);
  const [showHint, setShowHint] = useState(true);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasPlaced, setHasPlaced] = useState(false); // One ornament per session
  
  // Track which tree we are viewing. Defaults to user's own affiliation.
  const [viewingAffiliation, setViewingAffiliation] = useState<string>(userData.affiliation);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Detail View State
  const [focusedOrnament, setFocusedOrnament] = useState<PlacedOrnament | null>(null);
  const [focusSide, setFocusSide] = useState<'left' | 'right'>('left');

  // Panels for 3D tree (18 panels * 20deg = 360)
  const panels = Array.from({ length: 18 }, (_, i) => i * 20);
  const GRADE_TABS = ['1학년', '2학년', '3학년', '전공심화'];

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3000);
    loadOrnaments();
    return () => clearTimeout(timer);
  }, []);

  const loadOrnaments = async () => {
    setLoading(true);
    const data = await fetchOrnamentsFromSheet();
    setPlacedOrnaments(data);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Find ornament by name
    const target = placedOrnaments.find(o => o.userName === searchTerm.trim() || o.userId === searchTerm.trim());

    if (target) {
      // 1. Switch to the correct grade tree
      setViewingAffiliation(target.affiliation);
      
      // 2. Rotate to show that panel (Same logic as initial placement)
      // Panel is at translateX(-100%), so rotating by -(angle) brings it to front-left view
      setRotation(-(target.panelIndex * 20));

      alert(`${target.userName}님의 오너먼트를 찾았습니다!`);
      setSearchTerm('');
    } else {
      alert("해당 이름의 오너먼트를 찾을 수 없습니다.");
    }
  };

  const handleSlotClick = async (slotIndex: number) => {
    if (hasPlaced) {
      alert("오너먼트는 한 번만 달 수 있어요!");
      return;
    }
    if (saving) return;

    // Filter occupied panels for this specific slot by exact slotIndex in metadata if available,
    // otherwise fallback to approximate coordinate matching.
    const slotConfig = SLOT_POINTS[slotIndex];
    const targetY = slotConfig.orbY || slotConfig.dotY;
    
    // Find panels that already have an ornament at this slot
    const occupiedPanels = placedOrnaments
      .filter(o => o.affiliation === userData.affiliation)
      .filter(o => {
          // If legacy data doesn't have slotIndex, use Y coordinate approximation
          if (o.slotIndex === undefined) {
              return Math.abs(o.y - targetY) < 0.05;
          }
          return o.slotIndex === slotIndex;
      })
      .map(o => o.panelIndex);
    
    const availablePanels = panels.map((_, idx) => idx).filter(idx => !occupiedPanels.includes(idx));

    if (availablePanels.length === 0) {
      setLimitModalOpen(true);
      return;
    }

    // Pick random available panel
    const randomPanelIdx = availablePanels[Math.floor(Math.random() * availablePanels.length)];
    
    // Prepare ornament data
    const x = slotConfig.orbX || slotConfig.dotX;
    const y = slotConfig.orbY || slotConfig.dotY;

    setSaving(true);
    try {
        const success = await saveOrnamentToSheet(userData, userOrnamentDesign, randomPanelIdx, slotIndex, x, y);
        
        if (success) {
            // Optimistic update
            const newOrnament: PlacedOrnament = {
                id: 'temp-' + Date.now(),
                userId: userData.name,
                userName: userData.name,
                affiliation: userData.affiliation as any,
                design: userOrnamentDesign,
                panelIndex: randomPanelIdx,
                slotIndex: slotIndex,
                x,
                y,
                message: userData.content
            };
            setPlacedOrnaments(prev => [...prev, newOrnament]);
            setHasPlaced(true);
            
            // Rotate to show the new ornament
            setRotation(-(randomPanelIdx * 20));
            alert("오너먼트가 성공적으로 달렸어요!");
        } else {
            alert("저장에 실패했습니다. 다시 시도해주세요.");
        }
    } finally {
        setSaving(false);
    }
  };

  const handleOrnamentClick = (ornament: PlacedOrnament, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop propagation so we don't trigger other things
    // Determine side
    const screenCenter = window.innerWidth / 2;
    const clickX = e.clientX;
    
    if (clickX < screenCenter) {
      setFocusSide('left');
    } else {
      setFocusSide('right');
    }
    setFocusedOrnament(ornament);
  };

  // Filter ornaments for the currently viewed grade (Room)
  const visibleOrnaments = placedOrnaments.filter(o => o.affiliation === viewingAffiliation);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center select-none" onClick={() => setFocusedOrnament(null)}>
       {/* === Layer 0: Backgrounds === */}
       <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#85b4e0] via-[#79addd] to-[#6ab8ca]" />
       <div 
         className="absolute inset-0 z-0 bg-cover bg-center opacity-10 pointer-events-none mix-blend-screen"
         style={{ backgroundImage: `url(${ASSETS.treeStarBg})` }}
       />
       <div className="absolute left-0 bottom-0 w-full z-0 pointer-events-none">
          <img src={ASSETS.snowGround} className="w-full object-cover md:object-fill" alt="snow ground" />
       </div>

       <SnowEffect />

       {/* === Layer 30: UI (Search & Title & Tabs) === */}
       {/* Search Bar - Absolute Top Left - ONLY SHOW AFTER PLACEMENT */}
       {hasPlaced && (
         <div className="absolute top-10 left-4 md:left-10 z-50 pointer-events-auto" onClick={e => e.stopPropagation()}>
           <form className="search" onSubmit={handleSearch}>
              <input 
                type="text" 
                className="search__input" 
                placeholder="이름을 검색하세요." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="search__button">
                  <svg className="search__icon" aria-hidden="true" viewBox="0 0 24 24">
                      <g>
                          <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                      </g>
                  </svg>
              </button>
           </form>
         </div>
       )}

       {/* Center Top UI: Title or Grade Tabs */}
       <div className="absolute top-10 left-0 w-full flex justify-center z-30 pointer-events-none">
         <div className="pointer-events-auto" onClick={e => e.stopPropagation()}>
            {!hasPlaced ? (
                <div className="text-center">
                  <h2 className="text-white text-3xl font-bold font-tangerine drop-shadow-md">
                      {userData.affiliation} Tree
                  </h2>
                  {loading && <p className="text-white text-xs mt-2">다른 사람들의 오너먼트를 불러오는 중...</p>}
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-2 px-4">
                  {GRADE_TABS.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setViewingAffiliation(tab)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all border-2 ${
                        viewingAffiliation === tab
                          ? 'bg-transparent border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                          : 'bg-white border-white text-slate-900 hover:bg-gray-100'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
            )}
         </div>
      </div>

      {/* === Layer 40: Navigation Buttons === */}
      <button onClick={(e) => { e.stopPropagation(); setRotation(r => r - 30); }} className="absolute left-4 md:left-20 z-40 text-white text-2xl border-2 border-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-white/20 shadow-lg top-1/2 -translate-y-1/2">◀</button>
      <button onClick={(e) => { e.stopPropagation(); setRotation(r => r + 30); }} className="absolute right-4 md:right-20 z-40 text-white text-2xl border-2 border-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-white/20 shadow-lg top-1/2 -translate-y-1/2">▶</button>

      {/* === Layer 100: Detail Popup (Letter Paper) === */}
      {focusedOrnament && (
        <div 
          className={`absolute top-1/2 -translate-y-1/2 z-[100] w-80 md:w-96 bg-[#fdfdfd] shadow-2xl rounded-sm p-1 flex flex-col font-noto animate-fade-in-up
            ${focusSide === 'left' ? 'left-4 md:left-10' : 'right-4 md:right-10'}`}
          onClick={(e) => e.stopPropagation()}
        >
           {/* Texture */}
           <div className="absolute inset-0 bg-orange-50/20 opacity-50 pointer-events-none" />
           
           <button onClick={() => setFocusedOrnament(null)} className="absolute top-2 right-2 text-slate-400 hover:text-red-800 z-50">
             <X className="w-6 h-6" />
           </button>

           <div className="relative z-10 p-6 flex flex-col h-full overflow-y-auto max-h-[80vh] custom-scrollbar">
              <div className="mb-4 border-b border-gray-300 pb-2">
                <p className="text-xs text-slate-500">
                  작성자: <span className="font-bold text-slate-800">{focusedOrnament.userName}</span> ({focusedOrnament.affiliation})
                </p>
                <p className="text-xs text-slate-500 mt-1">
                   <span className="font-bold text-red-800">Messgae</span>
                </p>
              </div>

              <div className="w-full bg-transparent resize-none outline-none border-none text-slate-700 text-sm leading-8 min-h-[200px]"
                style={{
                  backgroundImage: 'linear-gradient(transparent 1.95rem, rgba(110, 26, 26, 0.15) 1.95rem)',
                  backgroundSize: '100% 2rem',
                  backgroundAttachment: 'local'
                }}
              >
                {focusedOrnament.message}
              </div>
           </div>
        </div>
      )}

      {/* === Layer 10: Scene (Tree) === */}
      <div className="scene relative z-10">
        <style>{`
          .scene {
            width: 520px;
            height: 720px;
            perspective: 1800px;
            position: relative;
          }
          .tree-3d {
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transition: transform 0.8s ease;
            transform-origin: 50% 70%;
            position: relative;
          }
          .tree-panel {
            position: absolute;
            left: 50%;
            bottom: 60px;
            transform-style: preserve-3d;
            transform-origin: right center;
          }
          /* Tree Image: Mirrored and non-selectable */
          .tree-panel img.tree-img {
            height: 580px; 
            display: block;
            transform: scaleX(-1);
            pointer-events: none;
            user-select: none;
          }
          @media (max-width: 600px) {
            .scene { width: 360px; height: 520px; }
            .tree-panel img.tree-img { height: 420px; }
          }
          /* Slot markers */
          .slot-marker {
             position: absolute; width: 25px; height: 25px; border-radius: 50%;
             background-color: rgba(239, 71, 80, 0.96); border: none;
             display: flex; align-items: center; justify-content: center;
             box-shadow: 0px 0px 0px 4px rgba(255, 190, 190, 0.35);
             cursor: pointer; transition: 0.3s;
             color: white; font-size: 10px; font-weight: 700;
             transform: translate(-50%, -50%);
             z-index: 50; /* Above tree */
          }
          .slot-marker:hover { width: 95px; border-radius: 50px; background-color: rgb(239, 105, 105); }
          .slot-marker:hover::before { content: "여기에 걸기"; font-size: 13px; }
          .slot-marker:hover span { display: none; }
          
          /* Search CSS */
          .search {
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-align: center;
          }
          .search__input {
            font-family: inherit;
            font-size: inherit;
            background-color: #f4f2f2;
            border: none;
            color: #646464;
            padding: 0.7rem 1rem;
            border-radius: 30px;
            width: 12em;
            transition: all ease-in-out .5s;
            margin-right: -2rem;
            height: 40px; /* Match button height approx */
          }
          .search__input:hover, .search__input:focus {
            box-shadow: 0 0 1em #00000013;
          }
          .search__input:focus {
            outline: none;
            background-color: #f0eeee;
          }
          .search__input::-webkit-input-placeholder {
            font-weight: 100;
            color: #ccc;
          }
          .search__input:focus + .search__button {
            background-color: #f0eeee;
          }
          .search__button {
            border: none;
            background-color: #f4f2f2;
            margin-top: .1em;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          .search__icon {
            height: 1.3em;
            width: 1.3em;
            fill: #b4b4b4;
          }
        `}</style>

        {/* Tree Shadow */}
        <div className="absolute left-1/2 bottom-[30px] -translate-x-1/2 w-[360px] h-[50px] rounded-full bg-black/50 blur-sm opacity-70 z-0" />

        {/* The 3D Tree Container */}
        <div className="tree-3d z-10" style={{ transform: `rotateY(${rotation}deg)` }}>
          {panels.map((angle, idx) => (
            <div 
              key={idx} 
              className="tree-panel"
              style={{ transform: `translateX(-100%) rotateY(${angle}deg)` }}
            >
               <img 
                  src={idx % 2 === 0 ? ASSETS.treeTexture1 : ASSETS.treeTexture2} 
                  className="tree-img"
                  alt=""
               />
               
               {/* Ornaments on this panel */}
               {visibleOrnaments.filter(o => o.panelIndex === idx).map(ornament => (
                  <div 
                    key={ornament.id}
                    className="absolute w-[40px] h-[40px] flex flex-col items-center justify-center group cursor-pointer pointer-events-auto"
                    style={{ 
                      left: `${ornament.x * 100}%`, 
                      top: `${ornament.y * 100}%`,
                      transform: 'translate(-50%, calc(-50% - 6px))'
                    }}
                    onClick={(e) => handleOrnamentClick(ornament, e)}
                  >
                     <img src={ornament.design.cap} className="w-full h-full object-contain drop-shadow-lg" alt="ornament" />
                     
                     {/* Nickname Label */}
                     <span className="absolute top-full mt-1 text-[10px] text-white font-bold drop-shadow-md whitespace-nowrap pointer-events-none bg-black/20 px-1 rounded">
                       {ornament.userName}
                     </span>
                  </div>
               ))}
            </div>
          ))}
        </div>

        {/* Slot Markers (Interactive layer inside scene) */}
        {!hasPlaced && !saving && SLOT_POINTS.map((slot, idx) => (
          <button
            key={idx}
            className="slot-marker"
            style={{ left: `${slot.dotX * 100}%`, top: `${slot.dotY * 100}%` }}
            onClick={(e) => { e.stopPropagation(); handleSlotClick(idx); }}
          >
            <span>←</span>
          </button>
        ))}
      </div>

      {/* === Layer 50: Top UI (Modals/Hints) === */}
      {/* Hint */}
      <div className={`fixed bottom-24 bg-[#8fd5eb]/90 px-6 py-2 rounded-full shadow-lg z-50 text-sm transition-opacity duration-700 pointer-events-none text-[#111322] font-bold ${showHint && !hasPlaced ? 'opacity-100' : 'opacity-0'}`}>
        트리의 빨간 점 중 하나를 눌러 오너먼트를 걸 위치를 골라 주세요
      </div>

      {/* Limit Modal */}
      {limitModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[999]" onClick={() => setLimitModalOpen(false)}>
          <div className="w-[200px] bg-white rounded-3xl p-6 text-center shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
             <img src={ASSETS.snowmanIcon} className="w-[100px] h-[100px] object-contain mx-auto mb-2" alt="limit" />
             <h3 className="text-lg font-bold mb-1 text-[#111322]">앗...</h3>
             <p className="text-[13px] text-[#7e8391] mb-4 leading-snug">이 위치에는 더 이상<br/>오너먼트를 걸 수 없어요!</p>
             <button onClick={() => setLimitModalOpen(false)} className="px-6 py-2 bg-[#ff8a7a] text-white font-bold text-sm rounded-full shadow-md">다시 고르기</button>
          </div>
        </div>
      )}

      {/* Saving Indicator */}
      {saving && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000] text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>저장 중...</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
         <button onClick={onGoRanking} className="bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors shadow-sm font-bold">Ranking</button>
         <button onClick={onGoComments} className="bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors shadow-sm font-bold">Comments</button>
         <button onClick={onBack} className="bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors shadow-sm font-bold">MAIN</button>
      </div>
    </div>
  );
};

export default TreeScene;
