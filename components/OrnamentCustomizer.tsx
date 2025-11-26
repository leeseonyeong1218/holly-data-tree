import React, { useState, useEffect } from 'react';
import { UserData, OrnamentColor, OrnamentDesign } from '../types';
import { ORNAMENT_DATA, mapThemeToColor } from '../constants';

interface Props {
  userData: UserData;
  onConfirm: (design: OrnamentDesign) => void;
}

const OrnamentCustomizer: React.FC<Props> = ({ userData, onConfirm }) => {
  const [colorKey, setColorKey] = useState<OrnamentColor>('yellow');
  const [config, setConfig] = useState(ORNAMENT_DATA['yellow']);
  const [selectedPattern, setSelectedPattern] = useState<OrnamentDesign>(ORNAMENT_DATA['yellow'].patterns[0]);

  useEffect(() => {
    // Theme from Survey determines color
    const derivedColor = mapThemeToColor(userData.theme as any);
    setColorKey(derivedColor);
    setConfig(ORNAMENT_DATA[derivedColor]);
    setSelectedPattern(ORNAMENT_DATA[derivedColor].patterns[0]);
  }, [userData.theme]);

  const handleConfirm = () => {
    onConfirm(selectedPattern);
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#080f2b] p-4">
      {/* Category Pill */}
      <div 
        className="px-6 py-2 rounded-full font-bold mb-6 text-[#111322] shadow-lg animate-fade-in-down"
        style={{ backgroundColor: config.accent }}
      >
        {config.label}
      </div>

      <h1 className="text-white text-2xl font-bold text-center mb-8 font-noto leading-tight">
        당신만의 오너먼트를<br />만들어 주세요
      </h1>

      {/* Main Preview */}
      <div className="w-60 h-60 rounded-full flex items-center justify-center mb-10 drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)] transition-all">
        <img 
          src={selectedPattern.cap} 
          alt="Selected Ornament" 
          className="w-full h-full object-contain animate-float"
        />
      </div>

      {/* Control Panel */}
      <div className="w-full max-w-lg bg-[#d0d1d6] rounded-3xl p-8 shadow-2xl">
        <header className="flex items-center justify-between mb-6">
          <div className="text-lg font-bold text-[#111322] font-noto">모양 고르기</div>
          <button 
            onClick={handleConfirm}
            className="px-5 py-2 rounded-full text-white font-bold text-sm shadow-md hover:scale-105 transition-transform"
            style={{ backgroundColor: config.accent }}
          >
            트리에 걸러 가기
          </button>
        </header>

        <div className="h-px bg-black/10 mb-6" />

        {/* Thumbnails */}
        <div className="grid grid-cols-3 gap-6 justify-items-center">
          {config.patterns.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPattern(p)}
              className={`w-24 h-24 rounded-full bg-[#f5f5f7] flex items-center justify-center shadow-sm transition-all border-4 relative group
                ${selectedPattern.id === p.id ? 'border-current transform -translate-y-1' : 'border-transparent hover:-translate-y-1'}`}
              style={{ borderColor: selectedPattern.id === p.id ? config.accent : 'transparent' }}
            >
              <img src={p.shape} alt={p.id} className="w-full h-full object-contain rounded-full transform -translate-y-1" />
              {/* Highlight effect */}
              {selectedPattern.id === p.id && (
                  <div className="absolute inset-0 rounded-full ring-2 ring-white/50" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Help Button */}
      <button className="fixed right-6 bottom-6 w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#111322] shadow-xl z-50 hover:scale-110 transition-transform"
        style={{ backgroundColor: config.accent }}>
        ?
      </button>

    </section>
  );
};

export default OrnamentCustomizer;
